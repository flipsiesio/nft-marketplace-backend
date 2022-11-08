# NFT Marketplace (WIP)

> How to start server?

- install `node`, `yarn`, `docker`
- clone repo by command `git clone https://git.sfxdx.ru/poker-dapp/poker-marketplace-backend.git`
- if you use linux system, remove quotes in .env file
- start **App** by command `yarn docker:env:up` or with docker-compose `sudo docker-compose up -d`

<hr>

# Info for developers

#### Micro-services (BackEnd):

- **auth** (get access, login by browser extension)
- **users** (user personal account management, change data like photo, name, email etc)
- **marketplace**
- **order-listener**
- **admin** (change global vars and configs)
- **cards-cli**
- **jackpot**

#### Util
- **ipfs.util.ts** - loaded generated svg cards to ipfs

#### About (FrontEnd):

Test -> Vanilla JS. Directory **apps -> front**. How it works:

##### Login:

- Скрипту нужно братиться на сервер и получить проверочную строку. Строка существует 15 секунд
- Строку нужно подписать расширением для браузера **TronLink (sign)** и отправить обратно серверу на проверку
- Если проверка прошла, то в ответ сервер должен вернуть **JWT(access и refresh)**

##### Protected API routes:

- **access token** дает доступ к роутам на 1 час
- **refresh token** не позволяет обращаться к защищенным роутам, существует 7 дней, позволяет обновить **access token**
- у бэка есть защищенный роут по ролям (**user.roles**). Существуют два типа пользователей **user** && **admin**
- (**_WIP_**) JWT можно блокировать, тем самым делать logout.

##### Subscriptions and Notifications:

- User or NFT generate a events
- Events trigger the subscriptions
- Subscriptions trigger the notifications

##### Card schema #####

{
  name: string,
  face: string,
  suit: string,
  metadata: {
    faceFrequency: number,
    suitFrequency: number,
    tears: boolean,
    content: string(svg),
    url: string(ipfs),
    maxRarity: number,
    mediumRarity: number,
    frequencyRarity: number,
    traits: {
      [traitName]: {
        main: {
          name: string(traitName),
          color: {
            name: string(Color name),
            color: string(hex16),
            rgb: { r: number, g: number, b: number },
          }
        },
        parts: ...,
        frequency: number(chance),
        rarity: number,
      },
      ...
    }
  },
  hash: string
}
