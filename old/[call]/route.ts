import { Setup } from '@bsv/wallet-toolbox'
import { PrivateKey, WalletWireProcessor } from '@bsv/sdk'

export async function POST(req: Request) {
  try {
    const data = await req.arrayBuffer()
    const wallet = await Setup.createWalletClientNoEnv({
      chain: 'main', 
      rootKeyHex: process.env.WALLET_ROOT_KEY_HEX!,
      storageUrl: process.env.WALLET_STORAGE_URL!,
      privilegedKeyGetter: async () => {
        return PrivateKey.fromHex(process.env.WALLET_PRIVILEGED_KEY_HEX!)
      }
    })
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