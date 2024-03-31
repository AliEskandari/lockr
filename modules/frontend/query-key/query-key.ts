/**
 * Query keys for use with `useQuery` and `useMutation` hooks.
 */

import { Clauses, Options } from "@/modules/db/functions/find";
import { User } from "@/types/App/User";
import { Primitive } from "@/types/utilities";

export const queryKey = {
  user: (
    id?: string | { filters?: Clauses<User>; options?: Options<User> },
    ...keys: Primitive[]
  ) => ["users", id, ...keys],
  users: (
    filters: Clauses<User> = {},
    options: Options<User> = {},
    ...keys: Primitive[]
  ): [string, Clauses<User>, Options<User>, ...Primitive[]] => [
    "users",
    filters,
    options,
    ...keys,
  ],
} as const;
