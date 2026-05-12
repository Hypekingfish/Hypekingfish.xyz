const launchDate = new Date("Jul 4, 2026 16:00:00").getTime();

const timer = setInterval(() => {

    const now = new Date().getTime();
    const distance = launchDate - now;

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) /
        (1000 * 60 * 60)
    );

    const minutes = Math.floor(
        (distance % (1000 * 60 * 60)) /
        (1000 * 60)
    );

    const seconds = Math.floor(
        (distance % (1000 * 60)) / 1000
    );

    document.getElementById("Timer").innerHTML =
        `${days}d ${hours}h ${minutes}m ${seconds}s`;

    if (distance < 0) {
        clearInterval(timer);

        document.getElementById("Timer").innerHTML =
            "NOW LIVE";
    }

}, 1000);