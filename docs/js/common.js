const DATABASE_URL =
  "https://script.google.com/macros/s/AKfycbwvWbE4gVpDY7cm11dxc3bBCbVEDYQ6XKTG4IMN1kvWH0LbNbq_i6hBrd8q8I1BjmMeFA/exec";

function fetchDataWithCache(url) {
  const cacheKey = `cache_${url}`;
  const cachedData = sessionStorage.getItem(cacheKey);
  if (cachedData) {
    return Promise.resolve(JSON.parse(cachedData));
  }
  return fetch(url)
    .then((response) => response.json())
    .then((data) => {
      sessionStorage.setItem(cacheKey, JSON.stringify(data));
      return data;
    });
}
