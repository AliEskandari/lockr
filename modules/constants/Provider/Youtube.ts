import tw from "@/modules/tailwind";
import { API } from "@/modules/routes";
import { YoutubeIcon } from "@/components/icons";
import { YouTubeLogoLight } from "@/components/images/youtube-logo-light";
import { Provider } from "@/types";

const Youtube: Provider = {
  name: "Youtube",
  key: "google",
  colors: {
    text: "text-red-500",
    bg: "red",
    code: tw?.colors?.["red"]["500"],
  },
  route: API.Paths.Auth.Google,
  Icon: YoutubeIcon,
  Logo: YouTubeLogoLight,
};
export default Youtube;
