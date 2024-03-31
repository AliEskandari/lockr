import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGripVertical } from "@fortawesome/free-solid-svg-icons/faGripVertical";
import { faInstagram } from "@fortawesome/free-brands-svg-icons/faInstagram";
import { faTwitter } from "@fortawesome/free-brands-svg-icons/faTwitter";
import { faYoutube } from "@fortawesome/free-brands-svg-icons/faYoutube";

import React from "react";
import { FontAwesomeIconProps } from "@fortawesome/react-fontawesome";

export type IconProps = Omit<FontAwesomeIconProps, "icon">;

export function YoutubeIcon(props: IconProps) {
  return <FontAwesomeIcon icon={faYoutube} {...props} />;
}
export function InstagramIcon(props: IconProps) {
  return <FontAwesomeIcon icon={faInstagram} {...props} />;
}
export function TwitterIcon(props: IconProps) {
  return <FontAwesomeIcon icon={faTwitter} {...props} />;
}
export function GripVerticalIcon(props: IconProps) {
  return <FontAwesomeIcon icon={faGripVertical} {...props} />;
}
