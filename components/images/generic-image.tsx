import Image, { ImageProps } from "next/image";

export type GenericImageProps = Omit<ImageProps, "src" | "alt"> & {
  src?: string;
  alt?: string;
};

export function GenericImage({
  src = "",
  alt = "Image",
  priority = false,
  ...props
}: GenericImageProps) {
  return (
    <span {...props}>
      <Image
        src={src}
        fill
        className="object-contain !w-auto !relative max-w-none"
        alt={alt}
        priority={priority}
      />
    </span>
  );
}
