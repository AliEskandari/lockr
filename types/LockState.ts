import constants from "@/modules/constants";
type LockState = {
  actions: {
    [actionId: number | string]: {
      status: (typeof constants.Action.Status)[keyof typeof constants.Action.Status];
    };
  };
};
export default LockState;
