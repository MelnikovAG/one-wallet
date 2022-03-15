const TestUtil = require('./util')
const CheckUtil = require('./checkUtil')
const unit = require('ethjs-unit')
const ONEUtil = require('../lib/util')
const ONEDebugger = require('../lib/debug')
const ONE = require('../lib/onewallet')
const ONEConstants = require('../lib/constants')
const Flow = require('../lib/api/flow')
const ONEWallet = require('../lib/onewallet')
const crypto = require('crypto')
const BN = require('bn.js')
const { getIdentificationKey } = require('../lib/util')

const INTERVAL = 30000
const DURATION = INTERVAL * 12
const SLOT_SIZE = 1
const EFFECTIVE_TIME = Math.floor(Date.now() / INTERVAL / 6) * INTERVAL * 6 - DURATION / 2
const ONE_CENT = unit.toWei('0.01', 'ether')
// const HALF_DIME = unit.toWei('0.05', 'ether')
// const ONE_DIME = unit.toWei('0.1', 'ether')
// const ONE_ETH = unit.toWei('1', 'ether')
const TEN_ETH = unit.toWei('10', 'ether')

const Logger = TestUtil.Logger
const Debugger = ONEDebugger(Logger)

contract('ONEWallet', (accounts) => {
  let snapshotId
  beforeEach(async function () {
    snapshotId = await TestUtil.snapshot()
    await TestUtil.init()
  })

  afterEach(async function () {
    await TestUtil.revert(snapshotId)
  })
/*
  // Transfer Native Token to external wallet
  it('Wallet_CommitReveal: Native Token Transfer must commit and reveal successfully', async () => {
    // Create Wallets and tokens
    const alice = await makeWallet(1, accounts[1])
    const bob = await makeWallet(2, accounts[2])
    const aliceInitialWalletBalance = await web3.eth.getBalance(alice.wallet.address)
    const bobInitialWalletBalance = await web3.eth.getBalance(bob.wallet.address)
    assert.equal(TEN_ETH, aliceInitialWalletBalance, 'Alice Wallet initially has correct balance')
    // alice tranfers ONE CENT to bob
    await tokenTransfer(
      {
        wallet: alice,
        operationType: ONEConstants.OperationType.TRANSFER,
        dest: bob.wallet.address,
        amount: (ONE_CENT / 2)
      }
    )
    const alicewalletBalance = await web3.eth.getBalance(alice.wallet.address)
    const bobwalletBalance = await web3.eth.getBalance(bob.wallet.address)
    assert.equal(parseInt(aliceInitialWalletBalance) - parseInt(ONE_CENT / 2), alicewalletBalance, 'Alice Wallet has correct balance')
    assert.equal(parseInt(bobInitialWalletBalance) + parseInt(ONE_CENT / 2), bobwalletBalance, 'Bob Wallet has correct balance')
    // Alice Items that have changed - nonce, spendingState, lastOperationTime, Commits
    assert.notStrictEqual(await alice.wallet.nonce, alice.state.nonce, 'alice wallet.nonce should have been changed')
    // alice.state.nonce = parseInt(alice.state.nonce) + 1
    alice.state.nonce = await alice.wallet.getNonce()
    // spendingState
    assert.notStrictEqual(await alice.wallet.getSpendingState(), alice.state.spendingState, 'alice spendingState should have been changed')
    alice.state.spendingState = await alice.wallet.getSpendingState()
    assert.equal(alice.state.spendingState.spentAmount, ONE_CENT / 2, 'alice wallet.spentAmount should have been changed')
    assert.notStrictEqual(alice.state.spendingState.lastSpendingInterval, 0, 'alice wallet.spentAmount should have been changed')
    // lastOperationTime
    assert.notStrictEqual(await alice.wallet.lastOperationTime(), alice.state.lastOperationTime, 'alice wallet.lastOperationTime should have been updated')
    alice.state.lastOperationTime = await alice.wallet.lastOperationTime()
    // commits
    assert.notDeepEqual(await alice.wallet.getAllCommits(), alice.state.allCommits, 'alice wallet.allCommits should have been updated')
    alice.state.allCommits = await alice.wallet.getAllCommits()
    // check alice
    await CheckUtil.checkONEWallet(alice.wallet, alice.state)
  })

  // ERC20 Token Testing (Transfer, Mint, Track, SpendingLimit)
  it('Wallet_CommitReveal: ERC20(Transfer, Mint, Track) must commit and reveal successfully', async () => {
    // Create Wallets and tokens
    const alice = await makeWallet(1, accounts[1])
    const bob = await makeWallet(2, accounts[2])
    const { testerc20 } = await makeTokens(alice.lastResortAddress)
    let aliceBalanceERC20
    let aliceWalletBalanceERC20
    let bobBalanceERC20
    let bobWalletBalanceERC20
    // transfer ERC20 tokens from alice.lastResortAddress (which owns the tokens) to alices wallet
    await testerc20.transfer(alice.wallet.address, 1000, { from: alice.lastResortAddress })
    aliceWalletBalanceERC20 = await testerc20.balanceOf(alice.wallet.address)
    assert.equal(1000, aliceWalletBalanceERC20, 'Transfer of 1000 ERC20 tokens to alice.wallet succesful')
    // alice transfers tokens to bob
    await tokenTransfer(
      {
        wallet: alice,
        operationType: ONEConstants.OperationType.TRANSFER_TOKEN,
        tokenType: ONEConstants.TokenType.ERC20,
        contractAddress: testerc20.address,
        dest: bob.wallet.address,
        amount: 100
      }
    )
    // OneWallet Items that have changed
    // check alice and bobs balance
    aliceBalanceERC20 = await testerc20.balanceOf(alice.wallet.address)
    aliceWalletBalanceERC20 = await alice.wallet.getBalance(ONEConstants.TokenType.ERC20, testerc20.address, 0)
    bobBalanceERC20 = await testerc20.balanceOf(bob.wallet.address)
    bobWalletBalanceERC20 = await bob.wallet.getBalance(ONEConstants.TokenType.ERC20, testerc20.address, 0)
    assert.equal(900, aliceBalanceERC20, 'Transfer of 100 ERC20 tokens from alice.wallet succesful')
    assert.equal(900, aliceWalletBalanceERC20, 'Transfer of 100 ERC20 tokens from alice.wallet succesful and wallet balance updated')
    assert.equal(100, bobBalanceERC20, 'Transfer of 100 ERC20 tokens to bob.wallet succesful')
    assert.equal(100, bobWalletBalanceERC20, 'Transfer of 100 ERC20 tokens to bob.wallet succesful and wallet balance updated')
    // Alice Items that have changed - nonce, lastOperationTime, Commits, trackedTokens
    assert.notStrictEqual(await alice.wallet.nonce, alice.state.nonce, 'alice wallet.nonce should have been changed')
    // alice.state.nonce = parseInt(alice.state.nonce) + 1
    alice.state.nonce = await alice.wallet.getNonce()
    // lastOperationTime
    assert.notStrictEqual(await alice.wallet.lastOperationTime(), alice.state.lastOperationTime, 'alice wallet.lastOperationTime should have been updated')
    alice.state.lastOperationTime = await alice.wallet.lastOperationTime()
    // commits
    assert.notDeepEqual(await alice.wallet.getAllCommits(), alice.state.allCommits, 'alice wallet.allCommits should have been updated')
    alice.state.allCommits = await alice.wallet.getAllCommits()
    // tracked tokens
    assert.notDeepEqual(await alice.wallet.getTrackedTokens(), alice.state.trackedTokens, 'alice.wallet.trackedTokens should have been updated')
    alice.state.trackedTokens = await alice.wallet.getTrackedTokens()
    await CheckUtil.checkONEWallet(alice.wallet, alice.state)
    // Bob Items that have changed - nothing
    await CheckUtil.checkONEWallet(bob.wallet, bob.state)
  })

  // ERC20 Decimals 9 Testing (Transfer, Mint, Track, SpendingLimit)
  it('Wallet_CommitReveal: ERC20-9(Transfer, Mint, Track) must commit and reveal successfully', async () => {
    // Create Wallets and tokens
    const alice = await makeWallet(1, accounts[1])
    const aliceInitialWalletBalance = await web3.eth.getBalance(alice.wallet.address)
    assert.equal(TEN_ETH, aliceInitialWalletBalance, 'Alice Wallet initially has correct balance')
    const bob = await makeWallet(2, accounts[2])
    const { testerc20d9 } = await makeTokens(alice.lastResortAddress)
    let aliceWalletBalanceERC20d9
    let bobWalletBalanceERC20d9
    // transfer ERC20d9 tokens from alice.lastResortAddress (which owns the tokens) to alices wallet
    await testerc20d9.transfer(alice.wallet.address, 1000, { from: alice.lastResortAddress })
    aliceWalletBalanceERC20d9 = await testerc20d9.balanceOf(alice.wallet.address)
    assert.equal(1000, aliceWalletBalanceERC20d9, 'Transfer of 1000 ERC20d9 tokens to alice.wallet succesful')
    // alice transfers tokens to bob
    await tokenTransfer(
      {
        wallet: alice,
        operationType: ONEConstants.OperationType.TRANSFER_TOKEN,
        tokenType: ONEConstants.TokenType.ERC20,
        contractAddress: testerc20d9.address,
        dest: bob.wallet.address,
        amount: 100
      }
    )
    // check alice and bobs balance
    aliceWalletBalanceERC20d9 = await testerc20d9.balanceOf(alice.wallet.address)
    bobWalletBalanceERC20d9 = await testerc20d9.balanceOf(bob.wallet.address)
    assert.equal(900, aliceWalletBalanceERC20d9, 'Transfer of 100 ERC20d9 tokens from alice.wallet succesful')
    assert.equal(100, bobWalletBalanceERC20d9, 'Transfer of 100 ERC20d9 tokens to bob.wallet succesful')
    // Alice Items that have changed - nonce, lastOperationTime, Commits, trackedTokens
    assert.notStrictEqual(await alice.wallet.nonce, alice.state.nonce, 'alice wallet.nonce should have been changed')
    // alice.state.nonce = parseInt(alice.state.nonce) + 1
    alice.state.nonce = await alice.wallet.getNonce()
    // lastOperationTime
    assert.notStrictEqual(await alice.wallet.lastOperationTime(), alice.state.lastOperationTime, 'alice wallet.lastOperationTime should have been updated')
    alice.state.lastOperationTime = await alice.wallet.lastOperationTime()
    // commits
    assert.notDeepEqual(await alice.wallet.getAllCommits(), alice.state.allCommits, 'alice wallet.allCommits should have been updated')
    alice.state.allCommits = await alice.wallet.getAllCommits()
    // tracked tokens
    console.log(`alice.wallet.getTrackedTokens(): ${JSON.stringify(await alice.wallet.getTrackedTokens())}`)
    console.log(`alice.state.trackedTokens: ${JSON.stringify(alice.state.trackedTokens)}`)
    assert.notDeepEqual(await alice.wallet.getTrackedTokens(), alice.state.trackedTokens, 'alice.wallet.trackedTokens should have been updated')
    alice.state.trackedTokens = await alice.wallet.getTrackedTokens()
    await CheckUtil.checkONEWallet(alice.wallet, alice.state)
    // Bob Items that have changed - nothing
    console.log(`bob.wallet.getTrackedTokens(): ${JSON.stringify(await bob.wallet.getTrackedTokens())}`)
    console.log(`bob.state.trackedTokens: ${JSON.stringify(bob.state.trackedTokens)}`)
    await CheckUtil.checkONEWallet(bob.wallet, bob.state)
  })

  // ERC721 Testing (Transfer, Mint, Track)
  it('Wallet_CommitReveal: ERC721(Transfer, Mint, Track) must commit and reveal successfully', async () => {
    // Create Wallets and tokens
    const alice = await makeWallet(1, accounts[1])
    const aliceInitialWalletBalance = await web3.eth.getBalance(alice.wallet.address)
    assert.equal(TEN_ETH, aliceInitialWalletBalance, 'Alice Wallet initially has correct balance')
    const bob = await makeWallet(2, accounts[2])
    const { testerc721 } = await makeTokens(alice.lastResortAddress)
    let aliceWalletBalanceERC721
    let bobWalletBalanceERC721
    assert.equal(alice.lastResortAddress, await testerc721.ownerOf(8), 'Alice.lastResortAddress owns token 8')
    // transfer ERC721 tokens from alice.lastResortAddress (which owns the tokens) to alices wallet
    await testerc721.transferFrom(alice.lastResortAddress, alice.wallet.address, 8, { from: alice.lastResortAddress })
    aliceWalletBalanceERC721 = await testerc721.balanceOf(alice.wallet.address)
    await testerc721.transferFrom(alice.lastResortAddress, alice.wallet.address, 9, { from: alice.lastResortAddress })
    aliceWalletBalanceERC721 = await testerc721.balanceOf(alice.wallet.address)
    assert.equal(2, aliceWalletBalanceERC721, 'Transfer of 2 ERC721 token to alice.wallet succesful')
    assert.equal(alice.wallet.address, await testerc721.ownerOf(8), 'Transfer of ERC721 token 8 to alice.wallet succesful')
    assert.equal(alice.wallet.address, await testerc721.ownerOf(9), 'Transfer of ERC721 token 9 to alice.wallet succesful')
    console.log(`alice.wallet.getTrackedTokens(): ${JSON.stringify(await alice.wallet.getTrackedTokens())}`)
    // alice transfers tokens to bob
    await tokenTransfer(
      {
        wallet: alice,
        operationType: ONEConstants.OperationType.TRANSFER_TOKEN,
        tokenType: ONEConstants.TokenType.ERC721,
        contractAddress: testerc721.address,
        tokenId: 8,
        dest: bob.wallet.address,
        amount: 1
      }
    )
    // check alice and bobs balance
    aliceWalletBalanceERC721 = await testerc721.balanceOf(alice.wallet.address)
    bobWalletBalanceERC721 = await testerc721.balanceOf(bob.wallet.address)
    assert.equal(1, aliceWalletBalanceERC721, 'Transfer of 1 ERC721 token from alice.wallet succesful')
    assert.equal(1, bobWalletBalanceERC721, 'Transfer of 1 ERC721 token to bob.wallet succesful')
    assert.equal(bob.wallet.address, await testerc721.ownerOf(8), 'Transfer of ERC721 token 8 to bob.wallet succesful')
    // Alice Items that have changed - nonce, lastOperationTime, Commits, trackedTokens
    assert.notStrictEqual(await alice.wallet.nonce, alice.state.nonce, 'alice wallet.nonce should have been changed')
    // alice.state.nonce = parseInt(alice.state.nonce) + 1
    alice.state.nonce = await alice.wallet.getNonce()
    // lastOperationTime
    assert.notStrictEqual(await alice.wallet.lastOperationTime(), alice.state.lastOperationTime, 'alice wallet.lastOperationTime should have been updated')
    alice.state.lastOperationTime = await alice.wallet.lastOperationTime()
    // commits
    assert.notDeepEqual(await alice.wallet.getAllCommits(), alice.state.allCommits, 'alice wallet.allCommits should have been updated')
    alice.state.allCommits = await alice.wallet.getAllCommits()
    // tracked tokens
    console.log(`alice.wallet.getTrackedTokens(): ${JSON.stringify(await alice.wallet.getTrackedTokens())}`)
    console.log(`alice.state.trackedTokens: ${JSON.stringify(alice.state.trackedTokens)}`)
    // assert.notDeepEqual(await alice.wallet.getTrackedTokens(), alice.state.trackedTokens, 'alice.wallet.trackedTokens should have been updated')
    // alice.state.trackedTokens = await alice.wallet.getTrackedTokens()
    await CheckUtil.checkONEWallet(alice.wallet, alice.state)
    // Bob Items that have changed - tracked Tokens
    console.log(`bob.wallet.getTrackedTokens(): ${JSON.stringify(await bob.wallet.getTrackedTokens())}`)
    console.log(`bob.state.trackedTokens: ${JSON.stringify(bob.state.trackedTokens)}`)
    assert.notDeepEqual(await bob.wallet.getTrackedTokens(), bob.state.trackedTokens, 'alice.wallet.trackedTokens should have been updated')
    bob.state.trackedTokens = await bob.wallet.getTrackedTokens()
    await CheckUtil.checkONEWallet(bob.wallet, bob.state)
  })

  // ERC1155 Testing (Transfer, Mint, Track) 
  it('Wallet_CommitReveal: ERC1155(Transfer, Mint, Track) must commit and reveal successfully', async () => {
    const alice = await makeWallet(1, accounts[1])
    const aliceInitialWalletBalance = await web3.eth.getBalance(alice.wallet.address)
    assert.equal(TEN_ETH, aliceInitialWalletBalance, 'Alice Wallet initially has correct balance')
    const bob = await makeWallet(2, accounts[2])
    const { testerc1155 } = await makeTokens(alice.lastResortAddress)
    let aliceWalletBalanceERC1155T8
    let bobWalletBalanceERC1155T8
    assert.equal(20, await testerc1155.balanceOf(alice.lastResortAddress, 8), 'Alice.lastResortAddress owns 20 of token 8')
    // transfer ERC721 tokens from alice.lastResortAddress (which owns the tokens) to alices wallet
    // TODO review the bytes value we are passing in safeTransferFrom (currently using ONEUtil.hexStringToBytes('5') )
    await testerc1155.safeTransferFrom(alice.lastResortAddress, alice.wallet.address, 8, 8, ONEUtil.hexStringToBytes('5'), { from: alice.lastResortAddress })
    aliceWalletBalanceERC1155T8 = await testerc1155.balanceOf(alice.wallet.address, 8)
    assert.equal(8, aliceWalletBalanceERC1155T8, 'Transfer of 8 ERC721 token to alice.wallet succesful')
    // alice transfers tokens to bob
    await tokenTransfer(
      {
        wallet: alice,
        operationType: ONEConstants.OperationType.TRANSFER_TOKEN,
        tokenType: ONEConstants.TokenType.ERC1155,
        contractAddress: testerc1155.address,
        tokenId: 8,
        dest: bob.wallet.address,
        amount: 3
      }
    )
    // check alice and bobs balance
    aliceWalletBalanceERC1155T8 = await testerc1155.balanceOf(alice.wallet.address, 8)
    bobWalletBalanceERC1155T8 = await testerc1155.balanceOf(bob.wallet.address, 8)
    assert.equal(5, aliceWalletBalanceERC1155T8, 'Transfer of 3 ERC1155 tokens from alice.wallet succesful')
    assert.equal(3, bobWalletBalanceERC1155T8, 'Transfer of 3 ERC1155 token to bob.wallet succesful')
    // Alice Items that have changed - nonce, lastOperationTime, Commits, trackedTokens
    assert.notStrictEqual(await alice.wallet.nonce, alice.state.nonce, 'alice wallet.nonce should have been changed')
    // alice.state.nonce = parseInt(alice.state.nonce) + 1
    alice.state.nonce = await alice.wallet.getNonce()
    // lastOperationTime
    assert.notStrictEqual(await alice.wallet.lastOperationTime(), alice.state.lastOperationTime, 'alice wallet.lastOperationTime should have been updated')
    alice.state.lastOperationTime = await alice.wallet.lastOperationTime()
    // commits
    assert.notDeepEqual(await alice.wallet.getAllCommits(), alice.state.allCommits, 'alice wallet.allCommits should have been updated')
    alice.state.allCommits = await alice.wallet.getAllCommits()
    // tracked tokens
    console.log(`alice.wallet.getTrackedTokens(): ${JSON.stringify(await alice.wallet.getTrackedTokens())}`)
    console.log(`alice.state.trackedTokens: ${JSON.stringify(alice.state.trackedTokens)}`)
    assert.notDeepEqual(await alice.wallet.getTrackedTokens(), alice.state.trackedTokens, 'alice.wallet.trackedTokens should have been updated')
    alice.state.trackedTokens = await alice.wallet.getTrackedTokens()
    await CheckUtil.checkONEWallet(alice.wallet, alice.state)
    // Bob Items that have changed - tracked Tokens
    console.log(`bob.wallet.getTrackedTokens(): ${JSON.stringify(await bob.wallet.getTrackedTokens())}`)
    console.log(`bob.state.trackedTokens: ${JSON.stringify(bob.state.trackedTokens)}`)
    assert.notDeepEqual(await bob.wallet.getTrackedTokens(), bob.state.trackedTokens, 'alice.wallet.trackedTokens should have been updated')
    bob.state.trackedTokens = await bob.wallet.getTrackedTokens()
    await CheckUtil.checkONEWallet(bob.wallet, bob.state)
  })
*/
  // TokenTracker Testing (track, multitrack, getTrackedTokens, getBalance, recoverToken) also batch transactions
  it('Wallet_CommitReveal: TokenTracker(token management) must commit and reveal successfully', async () => {
    const alice = await makeWallet(1, accounts[1])
    const bob = await makeWallet(2, accounts[2])
    const { testerc20, testerc20d9, testerc721, testerc1155, tokentracker } = await makeTokens(alice.lastResortAddress)
    // alice tranfers ONE CENT to bob
    await tokenTransfer(
      {
        wallet: alice,
        operationType: ONEConstants.OperationType.TRANSFER,
        dest: bob.wallet.address,
        amount: (ONE_CENT / 2)
      }
    )
    console.log(`await alice.wallet.getNonce(): ${await alice.wallet.getNonce()}`)
    // await TestUtil.increaseTime(60)
    console.log(`await alice.wallet.getNonce(): ${await alice.wallet.getNonce()}`)
    // await TestUtil.increaseTime(60)
    console.log(`await alice.wallet.getNonce(): ${await alice.wallet.getNonce()}`)
    await tokenTransfer(
      {
        wallet: alice,
        operationType: ONEConstants.OperationType.TRANSFER,
        dest: bob.wallet.address,
        amount: (ONE_CENT / 2)
      }
    )
    // transfer ERC20 tokens from alice.lastResortAddress (which owns the tokens) to alices wallet
    await testerc20.transfer(alice.wallet.address, 1000, { from: alice.lastResortAddress })
    // alice transfers tokens to bob
    console.log(`await alice.wallet.getNonce(): ${await alice.wallet.getNonce()}`)
    await tokenTransfer(
      {
        wallet: alice,
        operationType: ONEConstants.OperationType.TRANSFER_TOKEN,
        tokenType: ONEConstants.TokenType.ERC20,
        contractAddress: testerc20.address,
        dest: bob.wallet.address,
        amount: 100
      }
    )
    // transfer ERC20d9 tokens from alice.lastResortAddress (which owns the tokens) to alices wallet
    await testerc20d9.transfer(alice.wallet.address, 1000, { from: alice.lastResortAddress })
    // alice transfers tokens to bob
    console.log(`await alice.wallet.getNonce(): ${await alice.wallet.getNonce()}`)
    await tokenTransfer(
      {
        wallet: alice,
        operationType: ONEConstants.OperationType.TRANSFER_TOKEN,
        tokenType: ONEConstants.TokenType.ERC20,
        contractAddress: testerc20d9.address,
        dest: bob.wallet.address,
        amount: 100
      }
    )
    // transfer ERC721 tokens from alice.lastResortAddress (which owns the tokens) to alices wallet
    await testerc721.transferFrom(alice.lastResortAddress, alice.wallet.address, 8, { from: alice.lastResortAddress })
    assert.equal(alice.wallet.address, await testerc721.ownerOf(8), 'Transfer of ERC721 token 8 to alice.wallet succesful')
    // alice transfers tokens to bob
    console.log(`await alice.wallet.getNonce(): ${await alice.wallet.getNonce()}`)
    await tokenTransfer(
      {
        wallet: alice,
        operationType: ONEConstants.OperationType.TRANSFER_TOKEN,
        tokenType: ONEConstants.TokenType.ERC721,
        contractAddress: testerc721.address,
        tokenId: 8,
        dest: bob.wallet.address,
        amount: 1
      }
    )
    // transfer ERC721 tokens from alice.lastResortAddress (which owns the tokens) to alices wallet
    // TODO review the bytes value we are passing in safeTransferFrom (currently using ONEUtil.hexStringToBytes('5') )
    await testerc1155.safeTransferFrom(alice.lastResortAddress, alice.wallet.address, 8, 8, ONEUtil.hexStringToBytes('5'), { from: alice.lastResortAddress })
    // alice transfers tokens to bob
    console.log(`await alice.wallet.getNonce(): ${await alice.wallet.getNonce()}`)
    await tokenTransfer(
      {
        wallet: alice,
        operationType: ONEConstants.OperationType.TRANSFER_TOKEN,
        tokenType: ONEConstants.TokenType.ERC1155,
        contractAddress: testerc1155.address,
        tokenId: 8,
        dest: bob.wallet.address,
        amount: 3
      }
    )
  })
})

// makeWallet uses an index and unlocked web3.eth.account and creates and funds a ONEwallet
const makeWallet = async (accountIndex, lastResortAddress) => {
  // create wallet
  const EFFECTIVE_TIME = Math.floor(Date.now() / INTERVAL / 6) * INTERVAL * 6 - DURATION / 2
  const TEN_ETH = unit.toWei('10', 'ether')
  const { wallet, seed, hseed, root, client: { layers } } = await TestUtil.createWallet({
    salt: new BN(accountIndex),
    effectiveTime: EFFECTIVE_TIME,
    duration: DURATION,
    maxOperationsPerInterval: SLOT_SIZE,
    lastResortAddress,
    spendingLimit: TEN_ETH
  })
  // Fund wallet
  await web3.eth.sendTransaction({
    from: lastResortAddress,
    to: wallet.address,
    value: TEN_ETH
  })
  const state = await CheckUtil.getONEWalletState(wallet)
  return { wallet, seed, hseed, root, layers, lastResortAddress, state }
}

// makeTokens makes test ERC20, ERC20Decimals9, ERC721, ERC1155
const makeTokens = async (owner) => {
  // create an ERC20
  const TESTERC20 = artifacts.require('TestERC20')
  const testerc20 = await TESTERC20.new(10000000, { from: owner })
  // create an ERC20Decimals9
  const TESTERC20DECIMALS9 = artifacts.require('TestERC20Decimals9')
  const testerc20d9 = await TESTERC20DECIMALS9.new(10000000, { from: owner })
  // create an ERC721
  const TESTERC721 = artifacts.require('TestERC721')
  const tids = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  const uris = ['ipfs://test721/0', 'ipfs://test721/1', 'ipfs://test721/2', 'ipfs://test721/3', 'ipfs://test721/4', 'ipfs://test721/5', 'ipfs://test721/6', 'ipfs://test721/7', 'ipfs://test721/8', 'ipfs://test721/9']
  const testerc721 = await TESTERC721.new(tids, uris, { from: owner })
  // create an ERC1155
  const TESTERC1155 = artifacts.require('TestERC1155')
  const tids1155 = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  const amounts1155 = [10, 20, 20, 20, 20, 20, 20, 20, 20, 100]
  const uris1155 = ['ipfs://test1155/0', 'ipfs://test1155/1', 'ipfs://test1155/2', 'ipfs://test1155/3', 'ipfs://test1155/4', 'ipfs://test1155/5', 'ipfs://test1155/6', 'ipfs://test1155/7', 'ipfs://test1155/8', 'ipfs://test1155/9']
  const testerc1155 = await TESTERC1155.new(tids1155, amounts1155, uris1155, { from: owner })
  // create a TokenTracker
  const TOKENTRACKER = artifacts.require('TokenTracker')
  const tokentracker = await TOKENTRACKER.new()
  return { testerc20, testerc20d9, testerc721, testerc1155, tokentracker }
}

// tokenTransfer commits and reveals a wallet transaction
const tokenTransfer = async ({ wallet, operationType, tokenType, contractAddress, tokenId, dest, amount }) => {
  Debugger.printLayers({ layers: wallet.layers })
  const otp = ONEUtil.genOTP({ seed: wallet.seed })
  const index = ONEUtil.timeToIndex({ effectiveTime: EFFECTIVE_TIME })
  const eotp = await ONE.computeEOTP({ otp, hseed: wallet.hseed })
  // Format commit and revealParams based on tokenType
  let commitParams
  let revealParams
  let paramsHash
  switch (operationType) {
    case ONEConstants.OperationType.TRANSFER:
      paramsHash = ONEWallet.computeTransferHash
      commitParams = { dest, amount }
      revealParams = { dest, amount, operationType }
      break
    case ONEConstants.OperationType.TRANSFER_TOKEN:
      paramsHash = ONEWallet.computeGeneralOperationHash
      switch (tokenType) {
        case ONEConstants.TokenType.ERC20:
          commitParams = { operationType, tokenType, contractAddress, dest, amount }
          revealParams = { operationType, tokenType, contractAddress, dest, amount }
          break
        case ONEConstants.TokenType.ERC721:
          commitParams = { operationType, tokenType, contractAddress, tokenId, dest, amount }
          revealParams = { operationType, tokenType, contractAddress, tokenId, dest, amount }
          break
        case ONEConstants.TokenType.ERC1155:
          commitParams = { operationType, tokenType, contractAddress, tokenId, dest, amount }
          revealParams = { operationType, tokenType, contractAddress, tokenId, dest, amount }
          break
        default:
          console.log(`TODO: add in Token error handling`)
          return
      }
      break
    default:
      console.log(`TODO: add in error handling`)
      return
  }
  await TestUtil.commitReveal({
    Debugger,
    layers: wallet.layers,
    index,
    eotp,
    paramsHash,
    commitParams,
    revealParams,
    wallet: wallet.wallet
  })
}
