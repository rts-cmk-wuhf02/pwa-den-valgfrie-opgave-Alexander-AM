let dialogTextDOM;
let dialogResolveFunc;

const dialog = (text) => {
    dialogTextDOM.innerText = text;

    document.body.classList.add("body-dialog");

    return new Promise((resolve, reject) => {
        dialogResolveFunc = resolve;
    });
}

document.addEventListener("DOMContentLoaded", () => {
    dialogTextDOM = document.querySelector(".dialog-wrapper .dialog-text");
    
    document.querySelector(".dialog-button").addEventListener("click", (e) => {
        e.preventDefault();

        document.body.classList.remove("body-dialog");

        if(dialogResolveFunc) {
            dialogResolveFunc();

            dialogResolveFunc = null;
        }
    });
});