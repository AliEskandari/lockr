import { logEvent as firebaseLogEvent, getAnalytics } from "firebase/analytics";
import { app } from "@/modules/firebase/app";

export const logEvent = (
  event: {
    name: string;
  } & Record<string, any>
) => {
  const analytics = getAnalytics(app);
  firebaseLogEvent(analytics, event.name, event);
};
