import { EntityManager, ID } from "@/types/EntityManager";
import { OmitID } from "@/types/OmitID";

/**
 * Adds an item to collection by updating the id's and entities properties. Note: this function updates
 * the passed in collection.
 * @param collection
 * @param itemToAdd
 */
const add = <T>(collection: EntityManager<T>, item: OmitID<T>) => {
  const lastItemId = collection.ids.slice(-1)[0] ?? -1;
  let newItemId = lastItemId + 1;
  const itemWithId = item as T & ID;
  itemWithId.id = newItemId;
  collection.ids.push(newItemId);
  collection.entities[newItemId] = itemWithId;
  return collection;
};

/**
 * Removes item from collection by updating the id's and entities properties. Note: this function updates
 * the passed in collection.
 * @param collection
 * @param itemToRemove
 */
const remove = <T extends ID>(
  collection: EntityManager<T>,
  itemToRemove: T | number
) => {
  let _id: number;
  if (typeof itemToRemove == "number") _id = itemToRemove;
  else _id = itemToRemove.id!;

  collection.ids = collection.ids.filter((id) => id !== _id);
  delete collection.entities[_id!];
};

const create = <T>(items: OmitID<T>[]): EntityManager<T> => {
  const collection = { ids: [], entities: {} };
  items.forEach((item) => add(collection, item));
  return collection;
};

const _new = (): EntityManager<any> => {
  const collection = { ids: [], entities: {} };
  return collection;
};

const entityManager = { add, remove, create, new: _new };
export default entityManager;
