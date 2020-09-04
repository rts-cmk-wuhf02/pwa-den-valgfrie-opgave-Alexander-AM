document.addEventListener("DOMContentLoaded", async () => {
    const challengesContainerDOM = document.querySelector(
        ".challenges-container"
    );

    const challenges = await fetch("/.netlify/functions/challenges-get-all")
        .then((e) => e.text())
        .then((data) => {
            data = JSON.parse(data);
            return data.error ? null : data.data;
        });

    if (challenges) {
        challenges.forEach((challenge, i) => {
            challengesContainerDOM.innerHTML += `
            <article class="challenge-wrapper" style="animation-delay: 0.${i}s;">
                <a href="/challenge/?id=${challenge.id}">
                    <p>${challenge.title}</p>
                </a>
            </article>`;
        });
    }
});
