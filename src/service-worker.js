if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("sw.js").catch(function (err) {
    console.warn("Error whilst registering service worker", err);
  });
}
