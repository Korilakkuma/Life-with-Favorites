if (location.hostname === 'korilakkuma.github.io' && navigator.serviceWorker) {
  navigator.serviceWorker
    .register('./service-worker.js', { scope: '/Life-with-Favorites/' })
    .then((registration) => {
      console.log(registration.installing);
    })
    .catch((error) => {
      console.error(error.message);
    });
}
