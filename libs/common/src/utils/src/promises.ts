export async function timeout<T = void>(
  ms?: number,
  callback?: () => T,
): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(callback ? callback() : void 0), ms);
  });
}
