const fs = require('fs');
const fsPromises = fs.promises;
const { create, IPFSHTTPClient } = require('ipfs-http-client');
const request = require('request');
const jsonCards = require('./old_cards.json');

async function httpRequest(url) {
  return new Promise((resolve, reject) => {
    request.get(url, function (error, response, body) {
      if (error) {
        reject(error);
        throw error;
      }
      resolve({ body, response });
    });
  });
}

async function httpRequestPost(url,file, cardid) {
  return new Promise((resolve, reject) => {
    let req = request.post(url, function (error, response, body) {
      if (error) {
        reject(error);
        throw error;
      }
      resolve({ body, response });
    });
    let form = req.form();
    form.append('file', file, {
      filename: `${cardid}.svg`,
      contentType: 'image/svg+xml'
    });
  });
}
async function get(path) {
  const response = await httpRequest(path);
  return response.body;
}



class IPFS {
  client;
  constructor() {
    this.client = create({
      url: 'https://ipfs.infura.io:5001/api/v0',
    });
  }

  async add(data) {
    try {
      const added = await this.client.add(data);
      const url = `https://flipsies.infura-ipfs.io/ipfs/${added.path}`;
      return { url, path: added.path };
    } catch (error) {
      console.log('Error uploading: ', error);
    }
  }

  async get(path) {
    const response = await httpRequest(path);
    return response.body;
  }
}

const ipfs = new IPFS();

async function start() {

  const newCards =[];

  console.log('start')
  for await (let card of jsonCards) {
    const file = await ipfs.get(card.metadata.url);

    const send = await httpRequestPost('http://localhost:5001/api/v1/add', file, card.cardId)

    if(send.body) {
      const body = JSON.parse(send.body)
      card.metadata.ipfsUrl = card.metadata.url;
      card.metadata.url = `http://gateway.btfs.io/btfs/${body.Hash}`
    }

    newCards.push(card)

    await fsPromises.writeFile('cards.json', JSON.stringify(newCards, null, 4))
    console.log('save cardId: '+card.cardId)
    console.log('-------')
  }
console.log(end)
  /*const newCards = await Promise.all(jsonCards.map(async jsonCard => {


    })
  )

   */

}
start()
