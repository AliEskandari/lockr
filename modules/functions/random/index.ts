export function randomInteger(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomFixedNumber(min: number, max: number) {
  return (Math.random() * (max - min + 1) + min).toFixed(2);
}

export function randomSeconds(min: number, max: number) {
  return parseFloat(randomFixedNumber(min, max)) * 1000;
}
