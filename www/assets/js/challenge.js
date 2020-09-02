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

document.addEventListener("DOMContentLoaded", async () => {
    let db;

    // Open database
    let request = window.indexedDB.open("programming-challenges", 1);
    request.onsuccess = (ev) => {
        db = event.target.result;
    };
    request.onerror = (ev) => {
        console.error("Application is not allowed to use IndexedDB.");
    };
    request.onupgradeneeded = (ev) => {
        ev.target.result.createObjectStore("exe-scripts", {
            keyPath: "id",
        });
    };

    const challengeTitleDOM = document.querySelector(".challenge-title-text");
    const challengeDescriptionDOM = document.querySelector(
        ".challenge-description-text"
    );
    const challengeCodeEditorDOM = document.querySelector(
        ".code-editor-editor"
    );
    const challengeExecuteButtonDOM = document.querySelector(".execute-button");
    const codeCheckerDOM = document.querySelector(".code-checker");

    const challengeId = new URLSearchParams(location.search).get("id");

    const challenge = await fetch(`/.netlify/functions/challenges-get-all`)
        .then((e) => e.json())
        .then((data) => {
            if (!data.error) {
                for (let i = 0; i < data.data.length; i++) {
                    if (data.data[i].id == challengeId) {
                        return data.data[i];
                    }
                }
            } else {
                return null;
            }
        });

    const parseTextToCode = (text) => {
        let code = "";
        const textSplit = text.split("\n");

        for (let i = 0; i < textSplit.length; i++) {
            code += `<span>${
                textSplit[i]
                    ? textSplit[i].replace("<", "&lt;").replace(">", "&gt;")
                    : "<br>"
            }</span>`;
        }

        return code;
    };

    const parseCodeToText = (code) => {
        let text = "";
        const codeSplit = code
            .split(/(?:<span>)|(?:<\/span>)/)
            .filter((s) => s != "");

        for (let i = 0; i < codeSplit.length; i++) {
            text += `${codeSplit[i].replace("<br>", "")}\n`;
        }

        return text;
    };

    if (challenge !== null) {
        challengeTitleDOM.innerText = challenge.title;
        challengeDescriptionDOM.innerText = challenge.description;
        challengeCodeEditorDOM.innerHTML = parseTextToCode(challenge.code);

        challengeExecuteButtonDOM.addEventListener("click", () => {
            const objectStore = db
                .transaction(["exe-scripts"], "readwrite")
                .objectStore("exe-scripts");

            objectStore.put({
                id: challengeId,
                data: parseCodeToText(challengeCodeEditorDOM.innerHTML),
            }).onsuccess = () => {
                codeCheckerDOM.src = `/execute/?id=${challengeId}`;
            };
        });
    }
});
