document.addEventListener("DOMContentLoaded", () => {
    const executeId = new URLSearchParams(location.search).get("id");

    if (window.indexedDB && executeId != undefined) {
        initDatabase(() => {
            // Get script
            request = db
                .transaction("exe-scripts")
                .objectStore("exe-scripts")
                .get(executeId);
            request.onsuccess = (ev) => {
                const userScript = ev.target.result.data
                    .replace(/\/\/[^\n]*/g, "")
                    //.replace(/\/\*[^]*\*\//g, "")
                    .replace(/\n/g, ";");

                getChallenges().then((data) => {
                    data.find((value) => value.id == executeId).tests.forEach(
                        (test) => {
                            const scriptElement = document.createElement(
                                "script"
                            );

                            scriptElement.innerText = `
                            parent.postMessage({ id: ${test.id}, data: (() => {
                                const dataset = (pos) => {
                                    return ${JSON.stringify(test.input)}[pos];
                                };
                                
                                ${userScript}
                            })()});
                            `;

                            scriptElement.async = true;
                            document.body.appendChild(scriptElement);
                            //document.body.removeChild(scriptElement);
                        }
                    );
                });
            };
            request.onerror = (ev) => {
                console.error("Request failed.");
            };
        });
    }
});
