const pwaInstallDOM = document.querySelector(".pwa-install");
const pwaInstallButtonDOM = document.querySelector(".pwa-install-button");
const pwaDismissButtonDOM = document.querySelector(".pwa-dismiss-button");

let deferredPrompt;

if('serviceWorker' in navigator) {
    window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").then((reg) => {
            console.log("Registration successful with scope: ", reg.scope);
        }, (err) => {
            console.log("Registration failed: ", err);
        });
    });

    window.addEventListener('beforeinstallprompt', (e) => {
        e.preventDefault();
        deferredPrompt = e;
        pwaInstallDOM.classList.add("visible");
    });


    const dismissInstall = () => {
        pwaInstallDOM.classList.remove("visible");
        pwaInstallDOM.classList.add("dismissed");
    };
    
    pwaInstallButtonDOM.addEventListener("click", () => {
        pwaInstallDOM.classList.remove("visible");

        deferredPrompt.prompt();

        deferredPrompt.userChoice.then((res) => {
            if(res.outcome !== "accepted") {
                dismissInstall();
            }
        });
    });

    pwaDismissButtonDOM.addEventListener("click", dismissInstall);
}