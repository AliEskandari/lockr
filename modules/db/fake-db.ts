import {
  createMultipleObject,
  createFakeSocialUnlock,
  createFakeCollection,
} from "@/modules/faker/faker";

const DB = {
  SocialUnlock: {
    all: createMultipleObject(28, createFakeSocialUnlock),
    find: function (id: string) {
      return this.all[id];
    },
  },
  Collection: {
    all: createMultipleObject(5, createFakeCollection),
    find: function (id: string) {
      return this.all[id];
    },
    rand: function (id: string) {
      return Object.values(this.all)[0];
    },
  },
};

export default DB;
