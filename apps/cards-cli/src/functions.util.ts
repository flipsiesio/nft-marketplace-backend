export function sleep(ms: number = 1000) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(true);
    }, ms);
  });
}

export function randomRange(min: number, max: number) {
  return Math.random() * (max - min) + min;
}
