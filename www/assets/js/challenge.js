document.addEventListener("DOMContentLoaded", async () => {
    const challengeTitleDOM = document.querySelector(".challenge-title-text");
    const challengeDescriptionDOM = document.querySelector(
        ".challenge-description-text"
    );
    const challengeCodeEditorDOM = document.querySelector(
        ".code-editor-editor"
    );
    const challengeExecuteButtonDOM = document.querySelector(".execute-button");
    const codeCheckerDOM = document.querySelector(".code-checker");
    const codeTestsDOM = document.querySelector(".code-tests");

    const challengeId = new URLSearchParams(location.search).get("id");

    initDatabase();

    const challenge = await fetch(`/.netlify/functions/challenges-get-all`)
        .then((e) => e.json())
        .then((data) => {
            data = JSON.parse(data);

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

    challenge.tests.forEach((test) => {
        codeTestsDOM.innerHTML += `
            <li id="code-test-${test.id}"><p>Input: ${JSON.stringify(
            test.input
        )}</p><p>Output: ${JSON.stringify(test.output)}</p></li>
        `;
    });

    let tests = [];
    const _BLANK = [];

    const parseTextToCode = (text) => {
        let code = "";
        const textSplit = decodeURIComponent(
            text
        ); /*.split("\n");

        for (let i = 0; i < textSplit.length; i++) {
            code += `<span>${
                textSplit[i]
                    ? textSplit[i].replace(/</g, "&lt;").replace(/>/g, "&gt;")
                    : "<br>"
            }</span>`;
        }*/
        code = textSplit;

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
                tests[e.data.id] = e.data.data;
                let correct = 1;

                for (let i = 0; i < challenge.tests.length; i++) {
                    const testId = challenge.tests[i].id;

                    if (tests[testId] == _BLANK) {
                        correct = 2;
                        break;
                    } else {
                        if (tests[testId] != challenge.tests[i].output) {
                            correct = 0;
                            document
                                .querySelector(`#code-test-${testId}`)
                                .classList.add("incorrect");
                        } else {
                            document
                                .querySelector(`#code-test-${testId}`)
                                .classList.add("correct");
                        }
                    }
                }

                if (correct == 1) {
                    navigator.vibrate([100, 50, 100]);
                    dialog("You have successfully completed the challenge.");
                }

                if (correct < 2) {
                    challengeExecuteButtonDOM.classList.remove("running");
                }
            }
        },
        false
    );

    if (challenge !== null) {
        const codeMirrorEditor = CodeMirror(
            (elt) => {
                challengeCodeEditorDOM.parentNode.replaceChild(
                    elt,
                    challengeCodeEditorDOM
                );
            },
            {
                value: parseTextToCode(challenge.code),
                mode: "javascript",
                lineNumbers: true,
            }
        );

        challengeTitleDOM.innerText = challenge.title;
        challengeDescriptionDOM.innerText = challenge.description;

        challengeExecuteButtonDOM.addEventListener("click", () => {
            if (!challengeExecuteButtonDOM.classList.contains("running")) {
                const objectStore = db
                    .transaction(["exe-scripts"], "readwrite")
                    .objectStore("exe-scripts");

                let request = objectStore.put({
                    id: challengeId,
                    data: codeMirrorEditor.getValue(),
                });
                request.onsuccess = (ev) => {
                    tests = challenge.tests.map((test) => {
                        document
                            .querySelector(`#code-test-${test.id}`)
                            .classList.remove("correct", "incorrect");
                        return _BLANK;
                    });
                    codeCheckerDOM.src = `/execute/?id=${challengeId}`;
                };

                challengeExecuteButtonDOM.classList.add("running");
            }
        });
    }
});

// Notifications
/*const displayNotification = () => {
    if(Notification.permission == "granted") {
        navigator.serviceWorker.getRegistration().then((reg) => {
            console.log(reg);

            reg.showNotification("Hello.", {
                body: "Notification body.",
                icon: "mario.png",
                data: {
                    dateOfArrival: Date.now(),
                    primaryKey: 1,
                },
            });
        });
    }
};

Notification.requestPermission().then((status) => {
    console.log("Notification status: ", status);

    //displayNotification();
});

document.querySelector(".message").addEventListener("click", () => {
    displayNotification();
});*/
