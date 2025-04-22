import { WalletStorageManager, Services, Wallet, StorageClient } from '@bsv/wallet-toolbox-client'
import { KeyDeriver, PrivateKey, WalletWireProcessor, calls } from '@bsv/sdk'

const createWallet = async () => {
  console.log({ WALLET_STORAGE_URL: process.env.WALLET_STORAGE_URL, WALLET_ROOT_KEY_HEX: process.env.WALLET_ROOT_KEY_HEX })
  const endpointUrl = process.env.WALLET_STORAGE_URL!
  const rootKey = PrivateKey.fromHex(process.env.WALLET_ROOT_KEY_HEX!)
  const keyDeriver = new KeyDeriver(rootKey)
  const storage = new WalletStorageManager(keyDeriver.identityKey)
  const chain = 'main'
  const services = new Services(chain)
  const wallet = new Wallet({
    chain,
    keyDeriver,
    storage,
    services,
  })
  const client = new StorageClient(wallet, endpointUrl)
  await storage.addWalletStorageProvider(client)
  await storage.makeAvailable()
  return wallet
}

export async function POST(req: Request) {
  try {
    const data = await req.arrayBuffer()
    console.log({ data })
    const wallet = await createWallet()
    const auth = await wallet.isAuthenticated({})
    console.log({ auth })

    // get the path from the request
    const path = req.url.split('/').pop()
    console.log({ path })
    const callCode = calls[path as keyof typeof calls]
    console.log({ callCode })

    const w = new WalletWireProcessor(wallet)

    // convert the arrayBuffer to number[]
    const message = Array.from(new Uint8Array(data))

    // prepend the call code
    const messageWithCallCode = [callCode, ...message]

    console.log({ messageWithCallCode })

    // transmit the message to the wallet
    const result = await w.transmitToWallet(messageWithCallCode)
    
    console.log({ result })

    // transmit the result as an arrayBuffer back to the client
    return new Response(Buffer.from(result), { headers: { 'Content-Type': 'application/octet-stream' } })
  } catch (error) {
    console.error('Error processing wallet wire request:', error)
    return new Response(null, { status: 500 })
  }
}