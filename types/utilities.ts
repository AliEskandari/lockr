import { DocumentData } from "firebase/firestore";

export type OmitID<T> = Omit<T, "id">;
export type Tail<T extends any[]> = T extends [infer A, ...infer R] ? R : never;
export type Primitive = Data | null | undefined;
export type Data = string | number | bigint | boolean;

// Overload for depth limiting
export type DotNotation<
  T,
  Parent extends string = "",
  Depth extends unknown[] = []
> = {
  [K in keyof Required<T> & (string | number)]: Depth["length"] extends 5
    ? never // Stop recursion at depth 5
    : Required<T>[K] extends Array<any>
    ? `${Parent}${K & string}` // Handle arrays differently: return the property name only
    : Required<T>[K] extends Function
    ? never // Exclude functions
    : Required<T>[K] extends object
    ? DotNotation<
        Required<T>[K],
        `${Parent}${K & string}.`,
        [unknown, ...Depth]
      >
    : `${Parent}${K & string}`;
}[keyof Required<T> & (string | number)];

export type UniqueTo<S, T> = Omit<S, keyof T>;
