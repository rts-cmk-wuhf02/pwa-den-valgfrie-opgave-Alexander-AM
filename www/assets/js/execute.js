/* IndexedDB Start */
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
/* IndexedDB End */

document.addEventListener("DOMContentLoaded", () => {
    const executeId = new URLSearchParams(location.search).get("id");

    if (window.indexedDB && executeId != undefined) {
        let db;

        // Open database
        let request = window.indexedDB.open("programming-challenges");
        request.onsuccess = (ev) => {
            db = event.target.result;

            // Get script
            request = db
                .transaction("exe-scripts")
                .objectStore("exe-scripts")
                .get(executeId);
            request.onsuccess = (ev) => {
                console.log(ev.target.result);
            };
            request.onerror = (ev) => {
                console.error("Request failed.");
            };
        };
        request.onerror = (ev) => {
            console.error("Application is not allowed to use IndexedDB.");
        };
    }
});
