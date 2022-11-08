export function queryToArray(query: string | any[]) {
  if (query == 'null') {
    return null;
  }
  if (query == 'undefined') {
    return undefined;
  }
  if (!query) return [];
  if (Array.isArray(query)) {
    return query;
  }
  return [query];
}

export function queryToNumber(query: string, def = 0) {
  try {
    if (query == 'null') {
      return null;
    }
    if (query == 'undefined') {
      return def;
    }
    const number = Number(query);
    if (Number.isNaN(number)) {
      return def;
    }
    return number;
  } catch {
    return def;
  }
}

export function queryToBoolean(query: string, def?: boolean) {
  if (query == 'null') {
    return null;
  }
  if (query == 'undefined') {
    return def;
  }
  if (query == 'true') return true;
  if (query == 'false') return false;
  return def;
}
