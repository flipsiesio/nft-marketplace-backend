// ��13:04
// npx hardhat deploy --tags deploy_mock,main --network <configured network in hardhat config>
// npx hardhat deploy --tags deploy_mock,main --network hardhat
// ��13:06
// const mockNftContract = await tronWeb.contract().at('TBBp5VF2q73hfMUoyxr138Kx3kbsi6HQRS');
// ��13:12
// https://eth-mainnet.alchemyapi.io/v2/LEtbrsFLsPRXdW04r95K8K2BBm9RPMjA
// LEtbrsFLsPRXdW04r95K8K2BBm9RPMjA
// Nikolai Savchenko13:13
// ������ � �����������, ����� ���� ������� ������� 2� �� ������ ���, ��� �� ������ ����� ������ ��� ���������
// ��13:20
// npx hardhat deploy --tags main --network localhost
// Golden Sylph13:23
// npx hardhat node --tags
// main
// ��13:26
// deploying "MockNFT" (tx: 0x38099db099fd2ee70d37b994fac7dda8f28a2b8321b82713049a22ed2a6cb768)...: deployed at 0x5FbDB2315678afecb367f032d93F642f64180aa3 with 1376653 gas
// Golden Sylph13:36
// 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
// ��13:38
// const mockNftContract = await tronWeb.contract().at('5FbDB2315678afecb367f032d93F642f64180aa3');
// ��13:45
// Invalid contract address provided
// ��13:47
//       const mockNftContract = await tronWeb.contract().at('5FbDB2315678afecb367f032d93F642f64180aa3');
// Golden Sylph13:51
// let instance = await tronWeb.contract(abi,'contractAddress');
// Golden Sylph13:58
// https://developers.tron.network/v3.7/reference/methodsend
// Yuri Miter14:00
//     contract(abi = [], address = false) {
//         return new Contract(this, abi, address);
//     }
// import Contract from 'lib/contract';
// Golden Sylph14:06
// function balanceOf(address owner) external view returns(uint256 balance)
// Nikolai Savchenko14:07
// ���� �������� ������)
// Golden Sylph14:07
// function tokenByIndex(uint256 index) public view virtual override returns (uint256)
// Yuri Miter14:10
// https://git.sfxdx.ru/poker-dapp/backend
// https://git.sfxdx.ru/poker-dapp/poker-backend-ms
// https://git.sfxdx.ru/poker-dapp/sc
// Golden Sylph14:12
// function jackpotDistribution(address payable player) external onlyGame activePool() returns (bool)
// Golden Sylph14:19
// event Jackpot(address indexed who)
// � ��������� Poker.sol
// Golden Sylph14:21
// https://ethtx.info/
// Golden Sylph14:24
// https://web3js.readthedocs.io/en/v1.2.11/web3-eth-subscribe.html
// https://developers.tron.network/v3.7/reference/events-by-transaction-id
// Golden Sylph14:28
// https://developers.tron.network/reference/gettransactioninfo
// Golden Sylph14:32
// https://developers.tron.network/docs/getting-started_new
// Golden Sylph14:34
// https://web3js.readthedocs.io/en/v1.2.11/web3-eth-subscribe.html
// ��14:41
// tronWeb.provider.eth.subscribe(type [, options] [, callback]);

//SCREEN CAST
// 1. call cards.balanceOf(userAddress) -> count.
// if (count > 0) -> access
// 2. call cards.tokenByIndex
// 3. call cards.ballanceOf
// function tokenByIndex(uint256 index) public view virtual override returns (uint256)
/**
 * function jackpotDistribution(address payable player) external onlyGame activePool() returns (bool)
 */
// Poker.sol event Jackpot(address indexed who) WIP

// DECODER mainNet: --- https://ethtx.info/
// Tron -> error handler
// subscribe by webSocket https://web3js.readthedocs.io/en/v1.2.11/web3-eth-subscribe.html
// tron by API event https://developers.tron.network/v3.7/reference/events-by-transaction-id
// filter bloom -> event history
// get transaction de
/**
       * https://developers.tron.network/reference/gettransactioninfo
Golden Sylph14:32
https://developers.tron.network/docs/getting-started_new
       */
// create sockets -> call providers list
// https://web3js.readthedocs.io/en/v1.2.11/web3-eth-subscribe.html
// web3.eth.subscribe(type [, options] [, callback]);
// tronWeb!!!.provider!!!.eth.subscribe(type [, options] [, callback]);
// event emitter;
// CRON ->> API Tron;
