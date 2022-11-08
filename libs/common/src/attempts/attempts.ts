export async function intervalAttempts(
  event = (): any => {},
  condition = (data: any): boolean => {
    return !!data;
  },
  attempts = 10,
  interval = 1000,
) {
  let attempt = 0;
  {
    const data = await event();
    if (condition(data)) {
      return data;
    }
  }
  return new Promise((resolve, reject) => {
    const iAttempts = setInterval(async () => {
      try {
        const data = await event();
        if (condition(data)) {
          clearInterval(iAttempts);
          resolve(data);
        }
        if (++attempt > attempts) {
          clearInterval(iAttempts);
          resolve(null);
        }
      } catch (e) {
        reject(e);
      }
    }, interval);
  });
}
