export function isProd() {
  return process.env.NODE_ENV === "production";
}

export function isLocal() {
  return !isProd();
}
