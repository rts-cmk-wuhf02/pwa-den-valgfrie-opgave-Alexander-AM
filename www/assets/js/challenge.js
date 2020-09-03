document.addEventListener("DOMContentLoaded", async () => {
    initDatabase();

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
        const textSplit = decodeURIComponent(text).split("\n");

        for (let i = 0; i < textSplit.length; i++) {
            code += `<span>${
                textSplit[i]
                    ? textSplit[i].replace(/</g, "&lt;").replace(/>/g, "&gt;")
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
            text += `${codeSplit[i]
                .replace(/<br>/g, "")
                .replace(/&lt;/g, "<")
                .replace(/&gt;/g, ">")
                .replace(/&nbsp;/g, " ")}\n`;
        }

        return text;
    };

    window.addEventListener(
        "message",
        (e) => {
            if (e.origin == location.origin) {
                console.log(e.data);
                challengeExecuteButtonDOM.classList.remove("running");
            }
        },
        false
    );

    if (challenge !== null) {
        challengeTitleDOM.innerText = challenge.title;
        challengeDescriptionDOM.innerText = challenge.description;
        challengeCodeEditorDOM.innerHTML = parseTextToCode(challenge.code);

        challengeExecuteButtonDOM.addEventListener("click", () => {
            if (!challengeExecuteButtonDOM.classList.contains("running")) {
                const objectStore = db
                    .transaction(["exe-scripts"], "readwrite")
                    .objectStore("exe-scripts");

                let request = objectStore.put({
                    id: challengeId,
                    data: parseCodeToText(challengeCodeEditorDOM.innerHTML),
                });
                request.onsuccess = (ev) => {
                    codeCheckerDOM.src = `/execute/?id=${challengeId}`;
                };

                challengeExecuteButtonDOM.classList.add("running");
            }
        });
    }
});
