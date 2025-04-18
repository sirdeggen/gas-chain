import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Setup } from '@bsv/wallet-toolbox'
import { PrivateKey, WalletWireProcessor } from '@bsv/sdk'

const wallet = await Setup.createWalletClientNoEnv({
  chain: 'main', 
  rootKeyHex: process.env.WALLET_ROOT_KEY_HEX!,
  storageUrl: process.env.WALLET_STORAGE_URL!,
  privilegedKeyGetter: async () => {
    return PrivateKey.fromHex(process.env.WALLET_PRIVILEGED_KEY_HEX! as string)
  }
})
 
export default async function handler(
  req: VercelRequest,
  res: VercelResponse,
) {
  try {
    const w = new WalletWireProcessor(wallet)

    // convert the arrayBuffer to number[]
    const message = Array.from(new Uint8Array(req.body))

    // transmit the message to the wallet
    const result = await w.transmitToWallet(message)

    // transmit the result as an arrayBuffer back to the client
    res.setHeader('Content-Type', 'application/octet-stream')
    res.status(200).send(Buffer.from(result))
  } catch (error) {
    console.error('Error processing wallet wire request:', error)
    res.status(500).json({ error: 'Internal Server Error' })
  }
}