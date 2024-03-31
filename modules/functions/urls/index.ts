import qs from "qs";

export function encode(params: any) {
  return qs.stringify(params);
}

export function isURL(string: string) {
  let url: URL;

  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
