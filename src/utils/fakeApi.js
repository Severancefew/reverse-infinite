import { delay, slice, random, reverse } from 'lodash-es';
import dataset from './dataset.json';

export const fetchHistory = params =>
  new Promise((resolve, reject) => {
    delay(() => {
      const { offset = 0, pageSize = 50 } = params;

      const messages = slice(
        dataset.messages,
        offset * pageSize,
        (offset + 1) * pageSize,
      );

      resolve({
        messages: reverse(messages),
        lastTimestamp: 0,
      });
    }, random(300, 1000));
  });
