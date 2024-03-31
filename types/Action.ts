import Action from "@/modules/constants/Action";

type ActionStatus = (typeof Action.Status)[keyof typeof Action.Status];

type ActionError = {
  code: string;
  message: string;
};

type ActionType =
  | (typeof Action.Type)["Youtube"][keyof (typeof Action.Type)["Youtube"]]
  | (typeof Action.Type)["Twitter"][keyof (typeof Action.Type)["Twitter"]]
  | (typeof Action.Type)["Instagram"][keyof (typeof Action.Type)["Instagram"]];

type Action = {
  id: number;
  type: ActionType;
  url: string;
  directConnect?: boolean;
  status?: ActionStatus;
  errors?: ActionError[];
};

export type { Action, ActionStatus, ActionError, ActionType };
