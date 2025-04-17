import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Setup } from '@bsv/wallet-toolbox'
import { PrivateKey } from '@bsv/sdk'

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
  console.log(await wallet.isAuthenticated({}))


  res.status(200).json({
    message: 'Hello World',
  });
} 