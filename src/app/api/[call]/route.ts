import { WalletStorageManager, Services, Wallet, StorageClient } from '@bsv/wallet-toolbox-client'
import { KeyDeriver, PrivateKey, WalletWireProcessor } from '@bsv/sdk'

const createWallet = async () => {
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
    const wallet = await createWallet()
    console.log(await wallet.isAuthenticated({}))

    const w = new WalletWireProcessor(wallet)

    // convert the arrayBuffer to number[]
    const message = Array.from(new Uint8Array(data))

    // transmit the message to the wallet
    const result = await w.transmitToWallet(message)

    // transmit the result as an arrayBuffer back to the client
    return new Response(Buffer.from(result), { headers: { 'Content-Type': 'application/octet-stream' } })
  } catch (error) {
    console.error('Error processing wallet wire request:', error)
    return new Response(null, { status: 500 })
  }
}