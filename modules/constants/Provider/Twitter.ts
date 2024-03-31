import tw from "@/modules/tailwind";
import { API } from "@/modules/routes";
import { TwitterIcon } from "@/components/icons";
import { TwitterLogoLight } from "@/components/images/twitter-logo-light";
import { Provider } from "@/types";

const Twitter: Provider = {
  name: "Twitter",
  key: "twitter",
  colors: {
    text: "text-blue-500",
    bg: "blue",
    code: tw?.colors?.["red"]["500"],
  },
  route: API.Paths.Auth.Twitter,
  Icon: TwitterIcon,
  Logo: TwitterLogoLight,
};
export default Twitter;
