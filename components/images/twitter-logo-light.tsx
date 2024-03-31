import { GenericImage, GenericImageProps } from "./generic-image";

type TwitterLogoLightProps = Omit<GenericImageProps, "src" | "alt">;

export function TwitterLogoLight(props: TwitterLogoLightProps) {
  return (
    <>
      Twitter
      <GenericImage
        {...props}
        src="/assets/images/twitter/twitter-logo-blue.png"
        alt="Twitter Logo"
        priority={true}
      />
    </>
  );
}
