const { promises: fs } = require('fs')
const { sortBy } = require('lodash')
const BN = require('bn.js')
const moment = require('moment-timezone')
const ADDRESSES_CACHE = process.env.ADDRESSES_CACHE || './data/addresses.csv'
const BIN_SIZE = parseInt(process.env.BIN_SIZE || 7) * 3600 * 1000 * 24
const ONEUtil = require('../lib/util')
const { setConfig } = require('../lib/config/provider')
const config = require('../lib/config/common')
setConfig(config)
const { api, initBlockchain } = require('../lib/api')
initBlockchain()

const timeString = timestamp => {
  return moment(timestamp).tz('America/Los_Angeles').format('YYYY-MM-DDTHH:mm:ssZ')
}

async function exec () {
  const lines = (await fs.readFile(ADDRESSES_CACHE, { encoding: 'utf-8' })).split('\n')
  const bins = {}
  for (const [index, line] of lines.entries()) {
    const [a, th, bh] = line.split(',')
    const time = new BN(th, 16)
    const balance = new BN(bh, 16)
    if (index % 50 === 0) {
      console.log(`Processed ${index}`)
    }
    if (balance.eqn(0)) {
      continue
    }
    try {
      const backlinks = await api.blockchain.getBacklinks({ address: a })
      const { majorVersion } = await api.blockchain.getVersion({ address: a })
      const { lastResortAddress } = await api.blockchain.getWallet({ address: a })
      const innerCores = majorVersion >= 15 ? (await api.blockchain.getInnerCores({ address: a })) : []
      const isUpgrade = backlinks.length > 0
      const isTimeless = !isUpgrade && (majorVersion >= 15 && innerCores.length === 0
      // || (majorVersion === 14 && lastResortAddress.toLowerCase() === '0x02f2cf45dd4bacba091d78502dba3b2f431a54d3')
      )

      const bin = time.div(new BN(BIN_SIZE)).toNumber()
      if (!bins[bin]) {
        bins[bin] = {
          originalBalance: new BN(0),
          upgradedBalance: new BN(0),
          numOriginalWallets: 0,
          numUpgradedWallets: 0,
          numTimeless: 0,
          timelessBalance: new BN(0)
        }
      }
      if (isUpgrade) {
        bins[bin].upgradedBalance = bins[bin].upgradedBalance.add(balance)
        bins[bin].numUpgradedWallets += 1
      } else {
        bins[bin].originalBalance = bins[bin].originalBalance.add(balance)
        bins[bin].numOriginalWallets += 1
      }
      if (isTimeless) {
        bins[bin].numTimeless += 1
        bins[bin].timelessBalance = bins[bin].timelessBalance.add(balance)
      }
    } catch (ex) {
      console.error(ex)
      console.error('[ERROR]', line)
    } finally {
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }
  const sortedBins = sortBy(Object.entries(bins), e => e[0])
  for (const b of sortedBins) {
    const { originalBalance, upgradedBalance, numOriginalWallets, numUpgradedWallets, numTimeless, timelessBalance } = b[1]
    console.log(timeString(b[0] * BIN_SIZE), {
      originalBalance: ONEUtil.toOne(originalBalance),
      upgradedBalance: ONEUtil.toOne(upgradedBalance),
      timelessBalance: ONEUtil.toOne(timelessBalance),
      numOriginalWallets,
      numUpgradedWallets,
      numTimeless
    })
  }
}

exec().catch(ex => console.error(ex))
