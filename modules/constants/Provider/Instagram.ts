import tw from "@/modules/tailwind";
import { API } from "@/modules/routes";
import { InstagramIcon } from "@/components/icons";
import { Provider } from "@/types";

const Instagram: Provider = {
  name: "Instagram",
  key: "instagram",
  colors: {
    text: "text-purple-500",
    bg: "purple",
    code: tw?.colors?.["purple"]["500"],
  },
  route: API.Paths.Auth.Instagram,
  Icon: InstagramIcon,
  Logo: InstagramIcon,
};
export default Instagram;
