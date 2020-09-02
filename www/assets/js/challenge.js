document.addEventListener("DOMContentLoaded", async () => {
    const challengeTitleDOM = document.querySelector(".challenge-title-text");
    const challengeDescriptionDOM = document.querySelector(
        ".challenge-description-text"
    );
    const challengeCodeEditorDOM = document.querySelector(
        ".code-editor-editor"
    );
    const challengeExecuteButtonDOM = document.querySelector(".execute-button");

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
        console.info(codeSplit);

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
            console.log(parseCodeToText(challengeCodeEditorDOM.innerHTML));
            const scriptElement = document.createElement("script");

            scriptElement.className = "code-editor-script";
            scriptElement.async = true;
            scriptElement.innerHTML = parseCodeToText(
                challengeCodeEditorDOM.innerHTML
            );

            document.body.appendChild(scriptElement);
        });
    }
});
