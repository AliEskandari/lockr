import { z } from "zod";

export type ID = { id?: number };

export type EntityManager<T> = {
  entities: {
    [id: number]: T & ID;
  };
  ids: number[];
};

export const IDSchema = z.object({
  id: z.number().optional(),
});

export function createEntityManagerSchema<T>(entitySchema: z.ZodType<T, any>) {
  return z.object({
    entities: z.record(entitySchema.and(IDSchema)),
    ids: z.array(z.number()),
  });
}
