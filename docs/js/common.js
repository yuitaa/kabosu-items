const DATABASE_URL =
  "https://script.google.com/macros/s/AKfycbwv5_oOOSN-YhI9_ZvdG4Webfd9vrOCrhoGuw7dPB90oXhLpqt3xx-Kye73a6EB1ZnrAQ/exec";

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
