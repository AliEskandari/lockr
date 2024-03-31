import React from "react";
import { IconProps } from "@/components/icons";

export type ProviderRouteFormatter = (query: Object) => string;

export namespace Provider {
  export type Name = "Youtube" | "Instagram" | "Twitter";
  export type Key = "google" | "twitter" | "instagram";
}

export type Provider = {
  name: Provider.Name;
  key: Provider.Key;
  colors: {
    text: "text-purple-500" | "text-red-500" | "text-blue-500";
    bg: "purple" | "red" | "blue";
    code: string;
  };
  route: string | ProviderRouteFormatter;
  Icon: React.ComponentType<IconProps>;
  Logo: React.ComponentType<any>;
};
