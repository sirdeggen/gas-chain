import { WalletStorageManager, Services, Wallet, StorageClient } from '@bsv/wallet-toolbox-client'
import { KeyDeriver, PrivateKey, WalletWireProcessor } from '@bsv/sdk'

// NOTE: Enum values must not exceed the UInt8 range (0–255)
enum calls {
  createAction = 1,
  signAction = 2,
  abortAction = 3,
  listActions = 4,
  internalizeAction = 5,
  listOutputs = 6,
  relinquishOutput = 7,
  getPublicKey = 8,
  revealCounterpartyKeyLinkage = 9,
  revealSpecificKeyLinkage = 10,
  encrypt = 11,
  decrypt = 12,
  createHmac = 13,
  verifyHmac = 14,
  createSignature = 15,
  verifySignature = 16,
  acquireCertificate = 17,
  listCertificates = 18,
  proveCertificate = 19,
  relinquishCertificate = 20,
  discoverByIdentityKey = 21,
  discoverByAttributes = 22,
  isAuthenticated = 23,
  waitForAuthentication = 24,
  getHeight = 25,
  getHeaderForHeight = 26,
  getNetwork = 27,
  getVersion = 28,
}

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
    const data = await req.json()
    console.log({ data })
    const wallet = await createWallet()
    const auth = await wallet.isAuthenticated({})
    console.log({ auth })

    // get the path from the request
    const path = req.url.split('/').pop()
    console.log({ path })

    let result: unknown

    // transmit the message to the wallet
    switch(path) {
      case 'createAction':
        result = await wallet.createAction(data)
        break
      case 'getPublicKey':
        result = await wallet.getPublicKey(data)
        break
      case 'createSignature':
        result = await wallet.createSignature(data)
        break
      default:
        throw new Error('Invalid path')
    }

    // transmit the result as json
    return Response.json(result, { status: 200 })
  } catch (error) {
    console.error({ error })
    return Response.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}