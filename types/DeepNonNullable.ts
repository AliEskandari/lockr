export type DeepNonNullable<T> = {
  [K in keyof T]: T[K] extends object
    ? DeepNonNullable<NonNullable<T[K]>>
    : NonNullable<T[K]>;
};
