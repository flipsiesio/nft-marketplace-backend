# Artem Zhuleev
## Цели перед проектом (apps):
- Auth
  - доработка гарда (проверка наличия токенов/карт у юзера)
  - добавить гарды на все нужные эндпоинты:
    - marketplace
    - admin
- Cards-cli
  - генерация метадаты для карт (требования ниже)
  - занесение метадаты в базу данных (проверить)
  - создание SVG копий оригинальных карт и их раскраска
  - распределение по папкам картинка+метадата (SVG+JSON)
  - на этом этапе фронт уже может получать карты и их дату с бека!!!
  - модуль загрузки в IPFS (посмотри какой загрузчик идет от заказчика, какие у загрузчика требования и формат метадаты)
- Marketplace
  - минт карты при джекпоте (проверка работоспособности)
    - нужно вносить данные о джекпотах в базу во избежание повторного минта
    - джекпот дает юзеру существенный выигрыш, ничем более не отличается от остальных транзакций
- Admin
  - вывод статистики в виде csv, частично сделано, но не проверялось

## Требования по картам:
- 6500 colorized cards. Раскрашеные карты, обычные.
- 7 rare cards. В канале закреплена картинка с редкими картами, такими как король суицидник
- 25 jokers. Они находятся тут https://www.figma.com/file/oGjZymeMbnPIImsUBEnsOg/Cards?node-id=0%3A1
- 771 cards with eggs. Это должны быть короли с по разному разукрашенными яйцами.   (должны быть готовы, их делал Юра Митер).
- 500 cards with tears. Раскрашеные карты со слезой.
- По итогу мне нужен будет гугл диск со всеми картами, чтобы Никлдай утвердил с заказчиком итоговую версию.

Еще требования
- Цвета используются только из выбранной заказчиком палитры. Они находятся в фигме https://www.figma.com/file/oGjZymeMbnPIImsUBEnsOg/Cards?node-id=376%3A8770
- Файлы Юрия и Даниила используют цвета с карт плюс их рандомный сдвиг по HUE. Насколько понял это неверно.

## Помощь и вопросы:
  - нужно связаться с фронтом, активно с ним переговариваться о том, как вы будете обмениваться метадатой карт и картинками
  - у блокчейн отдела уточни как тебе наминтить карт на свой тестовый TRON кошелек, чтобы ты мог тестить получение карт с блокчейна
  - уточни у блокчейнистов как грузить файлы с IPFS, дадут тебе человека для консультации по формату данных. Возможно Denis Semenov (ранее с ним грузили обезьян в сеть), Danila Korneev.

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

# About - бизнес логика проекта

Проект состоит из трех основных сервисов:

- `Auth` (отвечает за авторизацию и доступ к маркетплейсу)
- `Marketplace` (отвечает за сам маркетплейс)
- `Image analysis` (отвечает за определение свойств карты по ее **SVG** картинке)

## Auth

Авторизация происходит за счет проверки тестовой строки, вернее числа.

Фронт стучится в бэк с запросом на проверку, получая от бэка уникальный номерок. Далее фронт подписывает этот номерок с помощью браузерного расширения TronLink. Бэк проверяет подпись при помощи публичного ключа (публичный ключ и адрес пользователя это одна и та же строка). Если подпись верна, то пользователю выдается пара токенов, один `access` другой - `refresh`.

> `refresh` токен не дает доступ к маркетплейсу, а служит лишь для обновления пары токенов.

> `publicKey` и `userAddress` это одна и та же строка

## Marketplace

API Маркетплейса дает списки `Token/Card/NFT`

- `Gallery` (список карт, не доступный для продажи)
- `Market` (список карт, выставленных на продажу)
- `Owner` (список карт, принадлежащих пользователю)

Помимо работы с контрактами карт, ведется запись в истории:

- `Sales` продажи (кто у кого и за сколько купил токены, итд). Администраторы могут посмотреть список продаж
- `Events` события (чеканка, выставление и снятие с продажи итд). Ивенты карты видят все пользователи, когда открывают страницу карты.

## Image analysis

Часть кода, которая расшифровывает метаданные карты по ее картинке. Также скрипты загружают фотографии в **IPFS** децентрализованное хранилище.

# TODO

// makertplace

- работа с контрактами и их событиями
- корректировка моделей и энтити сущностей
- тесты и проверки

// Image analysis

- задействовать сервисы цвета и карт - складывать записи в базу при парсинге **SVG**.
- сделать и задействовать **IPFS** клиент.

Card generator:
- https://git.sfxdx.ru/poker-dapp/cards-cli
- yarn start card-cli
- add metadata
- ipfs