import { GenericImage, GenericImageProps } from "./generic-image";

type YouTubeLogoLightProps = Omit<GenericImageProps, "src" | "alt">;

export function YouTubeLogoLight(props: YouTubeLogoLightProps) {
  return (
    <GenericImage
      {...props}
      src="/assets/images/youtube/youtube-logo-dark.png"
      alt="YouTube Logo"
      priority={true}
    />
  );
}
