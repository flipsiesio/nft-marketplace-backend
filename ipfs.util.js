const { create, IPFSHTTPClient } = require('ipfs-http-client');
const request = require('request');
const { MongoClient } = require('mongodb');
const { writeFileSync } = require('fs');

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
    const response = await httpRequest(`https://flipsies.infura-ipfs.io/ipfs/${path}`);
    return response.body;
  }
}

async function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const ipfs = new IPFS();

let mongoConnection = {};

async function mongoConnect() {
  const username = 'root';
  const password = 'rootpassword';

  const mongo = new MongoClient(
    `mongodb://${username}:${password}@${process.env.NODE_ENV != 'production' ?
      'localhost:17017'
      :
      'mongodb:27017'}/?authMechanism=DEFAULT`
  );
  await mongo.connect();

  const db = mongo.db('test');
  const collection = db.collection('cards');

  return { username, password, mongo, db, collection };
}

async function mongoGetCard(id) {
  return new Promise((resolve) => {
    mongoConnection.collection.find().sort({ _id: 1 }).skip(id).limit(1).forEach((card) => {
      resolve(card);
    });
  });
}

async function mongoUpdateUrl(id, url) {
  let card = await mongoGetCard(id);
  card.metadata.url = url;

  return mongoConnection.collection.updateOne({
    _id: card._id,
  }, {
    $set: card,
  });
}

async function getCard(cardId) {
  return JSON.parse((await httpRequest(`http://localhost:3002/cards/get?cardId=${cardId}`)).body);
}

async function saveCardSvg(id) {
  const card = await mongoGetCard(id);

  if (card?.metadata?.url) {
    //if (id % 100 == 0) {
      console.log(`Skip card svg № ${id}`);
    //}
    return false;
  }

  console.log(new Date());
  console.log(`Save card svg № ${id}`);
  const content = (await getCard(id)).metadata.content;
  const added = await ipfs.add(content);
  if (added) {
    const response = await mongoUpdateUrl(id, added.url);
    console.log(`Success saved card svg № ${id}`);
    return response;
  } else {
    console.log(`Error save card svg № ${id}`);
    await sleep(15000);
    return null;
  }
}

async function saveCardsSvg(offset = 0, jump = 1) {
  const cardsCount = await mongoConnection.collection.countDocuments();
  if (cardsCount) {
    for (let i = offset; i < cardsCount; i += jump) {
      if (await saveCardSvg(i) == null) i -= jump;
    }
    console.log('Saved cards ipfs');
    return true;
  }
  console.log('Not found cards');
  return false;
}

async function main() {
  mongoConnection = await mongoConnect();

  await Promise.all([
    saveCardsSvg(0, 3),
    saveCardsSvg(1, 3),
    saveCardsSvg(2, 3),
  ]);

  mongoConnection.mongo.close();
}

main();

// function checkCardSvg(url) {
//   //mongoGetCard()
// }

// function checkCardsSvg() {

// }

//checkCardsSvg();

// httpRequest('https://bafybeiaihr6bfyxnqocsf5afeysrk6pch7hl64qixv45zfchh62yklc7lu.ipfs.infura-ipfs.io/')
//   .then((res) => {
//     writeFileSync(__dirname + '/card.svg', res.body);
//   });
