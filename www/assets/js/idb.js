window.indexedDB =
    window.indexedDB ||
    window.mozIndexedDB ||
    window.webkitIndexedDB ||
    window.msIndexedDB;
window.IDBTransaction = window.IDBTransaction ||
    window.webkitIDBTransaction ||
    window.msIDBTransaction || { READ_WRITE: "readwrite" };
window.IDBKeyRange =
    window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;

let db;

const initDatabase = (success) => {
    let request = window.indexedDB.open("programming-challenges");
    request.onsuccess = (ev) => {
        db = ev.target.result;

        if (success) success();
    };
    request.onerror = (ev) => {
        db = null;
        console.error("Application was not allowed to use IndexedDB.");
    };
    request.onupgradeneeded = (ev) => {
        ev.target.result.createObjectStore("exe-scripts", {
            keyPath: "id",
        });

        ev.target.result.createObjectStore("challenges", {
            keyPath: "id",
        });
    };
};

const getChallenges = () => {
    return new Promise((resolve, reject) => {
        let objectStore = db
            .transaction(["challenges"], "readwrite")
            .objectStore("challenges");

        let request = objectStore.getAll();
        request.onsuccess = async (ev) => {
            if (ev.target.result.length == 0) {
                resolve(
                    await fetch("/.netlify/functions/challenges-get-all")
                        .then((e) => e.json())
                        .then((data) => {
                            if (data.hasOwnProperty("length"))
                                data = JSON.parse(data);

                            return data.error ? null : data.data;
                        })
                );
            } else {
                resolve(ev.target.result);
            }
        };
        request.onerror = () => {
            console.error("Could not get challenges.");
        };
    });
};
