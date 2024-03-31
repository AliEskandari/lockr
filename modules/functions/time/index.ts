export function debounce<T extends (...args: any[]) => any>(
  this: any,
  func: T,
  timeout = 350
): T {
  let timer: NodeJS.Timeout;
  return function (this: any, ...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  } as T;
}

export function delay(time: number) {
  return new Promise((resolve) => setTimeout(resolve, time));
}
