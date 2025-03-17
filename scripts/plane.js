const plane = document.querySelector(".plane");
let forward = true;

function animatePlane() {
    if (forward) {
        plane.style.transition = "left 15s linear"; // Move to SEA
        plane.style.transform = "scaleX(1)"; // Face right
        plane.style.left = "80vw";

        setTimeout(() => {
            setTimeout(() => {
                plane.style.transition = "transform 1s ease-in-out"; // Flip
                plane.style.transform = "scaleX(-1)";
            }, 500);

            setTimeout(() => {
                plane.style.transition = "left 15s linear"; // Move back to PDX
                plane.style.left = "0vw";
            }, 1500);
        }, 20000); // Wait 20s at SEA
    } else {
        setTimeout(() => {
            setTimeout(() => {
                plane.style.transition = "transform 1s ease-in-out"; // Flip
                plane.style.transform = "scaleX(1)";
            }, 500);

            setTimeout(() => {
                plane.style.transition = "left 15s linear"; // Move back to SEA
                plane.style.left = "80vw";
            }, 1500);
        }, 20000); // Wait 20s at PDX
    }

    forward = !forward;
    setTimeout(animatePlane, 16000 + 20000); // Sync with animation time + wait time
}

animatePlane();
