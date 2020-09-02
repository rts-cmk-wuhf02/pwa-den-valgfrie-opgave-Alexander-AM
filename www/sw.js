importScripts(
    "https://storage.googleapis.com/workbox-cdn/releases/5.1.2/workbox-sw.js"
);
/*importScripts("https://unpkg.com/idb@5.0.4/build/iife/index-min.js");

let db;

if(idb) {
    db = idb.openDB('products', 1, {
        upgrade(upgradeDB) {
            let store = upgradeDB.createObjectStore('beverages', {
                keyPath: 'id'
            });
            console.log(store);
            store.put({id: 123, name: 'coke', price: 10.99, quantity: 200});
            store.put({id: 321, name: 'pepsi', price: 8.99, quantity: 100});
            store.put({id: 222, name: 'water', price: 11.99, quantity: 300});
        }
    });
}*/

if (workbox) {
    /*workbox.precaching.precacheAndRoute([
        { url: "/", revision: null },
        { url: "/challenge", revision: null },
        { url: "/offline.html", revision: null },
        { url: "/assets/css/style.css", revision: null },
        { url: "/assets/img/icon_192.png", revision: null },
        { url: "/assets/img/icon_512.png", revision: null },
    ]);*/

    workbox.routing.registerRoute(
        () => true,
        new workbox.strategies.StaleWhileRevalidate()
    );

    workbox.routing.setCatchHandler(({ event }) => {
        if (event.request.destination === "/offline.html") {
            return caches.match("/offline.html");
        } else {
            return Response.error();
        }
    });
} else {
    console.log("Workbox failed to load.");
}
