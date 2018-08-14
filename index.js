const JsonRpcEngine = require('json-rpc-engine')
const createScaffoldMiddleware = require('json-rpc-engine/src/createScaffoldMiddleware')
const providerFromEngine = require('eth-json-rpc-middleware/providerFromEngine')
const providerAsMiddleware = require('eth-json-rpc-middleware/providerAsMiddleware')
const createInfuraMiddleware = require('eth-json-rpc-infura')

module.exports = createInfuraProvider

function createInfuraProvider(opts) {
  opts = opts || {}
  const infuraOpts = opts.infura || {}
  const walletOpts = opts.wallet || {}

  // create json rpc handler stack
  const engine = new JsonRpcEngine()
  // 1: intercept all infura requests
  engine.push(createInfuraWhitelistMiddleware(infuraOpts))
  // 2: all other requests fall to wallet
  engine.push(createWalletMiddleware(walletOpts))

  // wrap in ethereum provider api
  const provider = providerFromEngine(engine)
  return provider
}

function createInfuraWhitelistMiddleware(opts) {
  const infuraMiddleware = createInfuraMiddleware(opts)
  // manually hook all methods supported by infura
  const middleware = createScaffoldMiddleware({
    'web3_clientVersion': infuraMiddleware,
    'net_version': infuraMiddleware,
    'net_listening': infuraMiddleware,
    'net_peerCount': infuraMiddleware,
    'eth_protocolVersion': infuraMiddleware,
    'eth_syncing': infuraMiddleware,
    'eth_mining': infuraMiddleware,
    'eth_hashrate': infuraMiddleware,
    'eth_gasPrice': infuraMiddleware,
    'eth_accounts': infuraMiddleware,
    'eth_blockNumber': infuraMiddleware,
    'eth_getBalance': infuraMiddleware,
    'eth_getStorageAt': infuraMiddleware,
    'eth_getTransactionCount': infuraMiddleware,
    'eth_getBlockTransactionCountByHash': infuraMiddleware,
    'eth_getBlockTransactionCountByNumber': infuraMiddleware,
    'eth_getUncleCountByBlockHash': infuraMiddleware,
    'eth_getUncleCountByBlockNumber': infuraMiddleware,
    'eth_getCode': infuraMiddleware,
    'eth_call': infuraMiddleware,
    'eth_estimateGas': infuraMiddleware,
    'eth_getBlockByHash': infuraMiddleware,
    'eth_getBlockByNumber': infuraMiddleware,
    'eth_getTransactionByHash': infuraMiddleware,
    'eth_getTransactionByBlockHashAndIndex': infuraMiddleware,
    'eth_getTransactionByBlockNumberAndIndex': infuraMiddleware,
    'eth_getTransactionReceipt': infuraMiddleware,
    'eth_getUncleByBlockHashAndIndex': infuraMiddleware,
    'eth_getUncleByBlockNumberAndIndex': infuraMiddleware,
    'eth_getCompilers': infuraMiddleware,
    'eth_getLogs': infuraMiddleware,
    'eth_getWork': infuraMiddleware,
    'eth_sendRawTransaction': infuraMiddleware,
    'eth_call': infuraMiddleware,
    'eth_estimateGas': infuraMiddleware,
    'eth_submitWork': infuraMiddleware,
    'eth_submitHashrate': infuraMiddleware,
  })
  return middleware
}

function createWalletMiddleware(opts) {
  // use specified or injected web3 provider
  const walletProvider = opts.provider || (global.web3 && global.web3.currentProvider)
  // wrap in middleware interface
  const middleware = providerAsMiddleware(walletProvider)
  return middleware
}
