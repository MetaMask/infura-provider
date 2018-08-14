const createInfuraProvider = require('../')
const EthQuery = require('ethjs-query')
const BN = require('bn.js')

const weiBn = new BN(10).pow(new BN(18))

const provider = createInfuraProvider()
const eth = new EthQuery(provider)

eth.getBalance('0xEA674fdDe714fd979de3EdF0F56AA9716B898ec8', function (err, balanceBn) {
  if (err) return console.error(err)
  console.log('EtherMine balance:', balanceBn.div(weiBn).toString(), 'eth')
})
