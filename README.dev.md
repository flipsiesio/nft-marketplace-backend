# Artem Zhuleev
## ���� ����� �������� (apps):
- Auth
  - ��������� ����� (�������� ������� �������/���� � �����)
  - �������� ����� �� ��� ������ ���������:
    - marketplace
    - admin
- Cards-cli
  - ��������� �������� ��� ���� (���������� ����)
  - ��������� �������� � ���� ������ (���������)
  - �������� SVG ����� ������������ ���� � �� ���������
  - ������������� �� ������ ��������+�������� (SVG+JSON)
  - �� ���� ����� ����� ��� ����� �������� ����� � �� ���� � ����!!!
  - ������ �������� � IPFS (�������� ����� ��������� ���� �� ���������, ����� � ���������� ���������� � ������ ��������)
- Marketplace
  - ���� ����� ��� �������� (�������� �����������������)
    - ����� ������� ������ � ��������� � ���� �� ��������� ���������� �����
    - ������� ���� ����� ������������ �������, ����� ����� �� ���������� �� ��������� ����������
- Admin
  - ����� ���������� � ���� csv, �������� �������, �� �� �����������

## ���������� �� ������:
- 6500 colorized cards. ����������� �����, �������.
- 7 rare cards. � ������ ���������� �������� � ������� �������, ������ ��� ������ ���������
- 25 jokers. ��� ��������� ��� https://www.figma.com/file/oGjZymeMbnPIImsUBEnsOg/Cards?node-id=0%3A1
- 771 cards with eggs. ��� ������ ���� ������ � �� ������� �������������� ������.   (������ ���� ������, �� ����� ��� �����).
- 500 cards with tears. ����������� ����� �� ������.
- �� ����� ��� ����� ����� ���� ���� �� ����� �������, ����� ������� �������� � ���������� �������� ������.

��� ����������
- ����� ������������ ������ �� ��������� ���������� �������. ��� ��������� � ����� https://www.figma.com/file/oGjZymeMbnPIImsUBEnsOg/Cards?node-id=376%3A8770
- ����� ���� � ������� ���������� ����� � ���� ���� �� ��������� ����� �� HUE. ��������� ����� ��� �������.

## ������ � �������:
  - ����� ��������� � �������, ������� � ��� ���������������� � ���, ��� �� ������ ������������ ��������� ���� � ����������
  - � �������� ������ ������ ��� ���� ��������� ���� �� ���� �������� TRON �������, ����� �� ��� ������� ��������� ���� � ���������
  - ������ � ������������� ��� ������� ����� � IPFS, ����� ���� �������� ��� ������������ �� ������� ������. �������� Denis Semenov (����� � ��� ������� ������� � ����), Danila Korneev.

<br>
<br>
<br>
<br>

# Project info:

### Contracts and BackEnd prepare:

- add `.env` vars (delete `0x` from address string `0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0`)
- config `hardhat.config.js`
- add all `deployments/localhost/CONTRACT_NAME.json` contract data into `backend`. Only `abi` fields on JSON file is needed

### How to run contracts local:

- run poker-nft-marketplace-sc: `npx hardhat node --tags main` - run NODE, await contracts deploy
- run poker-nft-marketplace-sc: `npx hardhat deploy --tags main --network localhost` - deploy contracts into NODE

### How to run backend local:

- run poker-marketplace-backend: `yarn docker:env:up` - run backend containers

### todo:

> add env vars switch

> update start docs for client

> types for tronweb

### Backend contract initiation:

- add contract variable `const contractName = tronWeb.contract(abi: [], address: string)`
- call method `this.contractName.contractMethod(contractParam)`
- await answer
- (do not use SIGN() CALL() SEND() methods to call contract)

Method call example:

```jsx
const mockNftContract = tronWeb.contract(contractObj.abi,contract.address);

async setWorkingNftNftSale(newNFTOnSale) {
    try {
      return this.nftSaleContract.setWorkingNFT(newNFTOnSale);
    } catch (error) {
      console.log(error);
    }
  }
```

# About - ������ ������ �������

������ ������� �� ���� �������� ��������:

- `Auth` (�������� �� ����������� � ������ � ������������)
- `Marketplace` (�������� �� ��� �����������)
- `Image analysis` (�������� �� ����������� ������� ����� �� �� **SVG** ��������)

## Auth

����������� ���������� �� ���� �������� �������� ������, ������ �����.

����� �������� � ��� � �������� �� ��������, ������� �� ���� ���������� �������. ����� ����� ����������� ���� ������� � ������� ����������� ���������� TronLink. ��� ��������� ������� ��� ������ ���������� ����� (��������� ���� � ����� ������������ ��� ���� � �� �� ������). ���� ������� �����, �� ������������ �������� ���� �������, ���� `access` ������ - `refresh`.

> `refresh` ����� �� ���� ������ � ������������, � ������ ���� ��� ���������� ���� �������.

> `publicKey` � `userAddress` ��� ���� � �� �� ������

## Marketplace

API ������������ ���� ������ `Token/Card/NFT`

- `Gallery` (������ ����, �� ��������� ��� �������)
- `Market` (������ ����, ������������ �� �������)
- `Owner` (������ ����, ������������� ������������)

������ ������ � ����������� ����, ������� ������ � �������:

- `Sales` ������� (��� � ���� � �� ������� ����� ������, ���). �������������� ����� ���������� ������ ������
- `Events` ������� (�������, ����������� � ������ � ������� ���). ������ ����� ����� ��� ������������, ����� ��������� �������� �����.

## Image analysis

����� ����, ������� �������������� ���������� ����� �� �� ��������. ����� ������� ��������� ���������� � **IPFS** ������������������ ���������.

# TODO

// makertplace

- ������ � ����������� � �� ���������
- ������������� ������� � ������ ���������
- ����� � ��������

// Image analysis

- ������������� ������� ����� � ���� - ���������� ������ � ���� ��� �������� **SVG**.
- ������� � ������������� **IPFS** ������.

Card generator:
- https://git.sfxdx.ru/poker-dapp/cards-cli
- yarn start card-cli
- add metadata
- ipfs