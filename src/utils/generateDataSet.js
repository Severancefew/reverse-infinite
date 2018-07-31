const { writeFile } = require('fs');
const { random, range } = require('lodash');
const faker = require('faker');

// only 4 users to test message merge
const userNames = {
  0: 'Aracely Walter',
  1: 'Kelly Mante',
  2: 'Matt Ankunding',
  3: 'Vyacheslav Minin',
};

const rooms = {
  0: 'dev',
  1: 'random',
};

const generateMessages = ({ timestamp, length } = { length: 1000 }) => {
  let currentTimestampOffset = timestamp || Date.now();
  const messages = range(0, length).map(idx => {
    const randomSeconds = random(30, 60) * 1000;
    currentTimestampOffset = currentTimestampOffset - randomSeconds;

    return {
      timestamp: currentTimestampOffset,
      idx: idx,
      text: faker.lorem.sentences(),
      userId: random(0, 3),
    };
  });

  return {
    messages,
    lastTimestamp: messages[0].timestamp,
  };
};

writeFile(
  `${__dirname}/dataset.json`,
  JSON.stringify(generateMessages(), null, 2),
  () => console.log('done'),
);

module.exports = {
  generateMessages,
  rooms,
  userNames,
};
