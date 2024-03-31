import { faker } from "@faker-js/faker";
import { Type } from "@/modules/constants/Action";
import { randomInteger } from "@/modules/functions/random";

export const createFakeSocialUnlockAction = (id: number) => {
  return {
    id,
    type: faker.helpers.arrayElement([
      ...Object.values(Type.Youtube),
      ...Object.values(Type.Twitter),
      ...Object.values(Type.Instagram),
    ]),
    url: faker.internet.url(),
  };
};

export const createFakeSocialUnlock = () => {
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    destinationURL: faker.internet.url(),
    actions: createMultipleObject(
      randomInteger(1, 4),
      createFakeSocialUnlockAction
    ),
    views: faker.datatype.number(1000),
    unlocks: faker.datatype.number(1000),
  };
};

export const createFakeCollectionSocialUnlock = (id: number) => {
  return {
    id,
    title: faker.commerce.productName(),
    socialUnlock: createFakeSocialUnlock(),
  };
};

export const createFakeCollection = () => {
  const randNumber = faker.datatype.number(10);
  return {
    id: faker.database.mongodbObjectId(),
    title: faker.commerce.productName(),
    description: faker.lorem.sentence(),
    views: faker.datatype.number(1000),
    collectionSocialUnlocks: createMultipleObject(
      randNumber,
      createFakeCollectionSocialUnlock
    ),
  };
};

export const createFakeViewEvent = (date: Date) => {
  const views = faker.datatype.number(100);
  return {
    x: date,
    y: views,
  };
};

export const createFakeViewEvents = (length: number) => {
  const dates = faker.date.betweens(
    "2022-01-01T00:00:00.000Z",
    "2022-03-01T00:00:00.000Z",
    length
  );
  return dates.map((date) => createFakeViewEvent(date));
};

/**
 * HELPERS
 */

const range = (len: number) => {
  const arr = [];
  for (let i = 0; i < len; i++) {
    arr.push(i);
  }
  return arr;
};

export const createMultipleObject = (
  length: number,
  createFunction: (index: number) => any
) => {
  return Object.fromEntries(
    createMultiple(length, createFunction).map((item) => [item.id, item])
  );
};

export const createMultiple = (
  length: number,
  createFunction: (index: number) => any
) => {
  return range(length).map((num, index) => createFunction(index));
};

export function makeData(...lens: number[]) {
  const makeDataLevel: any = (depth = 0) => {
    const len = lens[depth];
    return range(len).map((d) => {
      return {
        ...createFakeSocialUnlock(),
        subRows: lens[depth + 1] ? makeDataLevel(depth + 1) : undefined,
      };
    });
  };

  return makeDataLevel();
}
