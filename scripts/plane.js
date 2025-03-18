const plane = document.querySelector(".plane");
let forward = true;

function animatePlane() {
    if (forward) {
        plane.style.transition = "left 15s linear";
        plane.style.transform = "scaleX(1)";
        plane.style.left = "calc(100% - 100px)"; // Ensures plane stops before going off-screen

        setTimeout(() => {
            setTimeout(() => {
                plane.style.transition = "transform 1s ease-in-out";
                plane.style.transform = "scaleX(-1)";
            }, 500);

            setTimeout(() => {
                plane.style.transition = "left 15s linear";
                plane.style.left = "0px"; // Moves back correctly
            }, 1500);
        }, 10000); // 20s wait at SEA
    } else {
        setTimeout(() => {
            setTimeout(() => {
                plane.style.transition = "transform 1s ease-in-out";
                plane.style.transform = "scaleX(1)";
            }, 500);

            setTimeout(() => {
                plane.style.transition = "left 15s linear";
                plane.style.left = "calc(100% - 60px)";
            }, 1500);
        }, 10000); // 20s wait at PDX
    }

    forward = !forward;
    setTimeout(animatePlane, 16000 + 20000);
}

plane.style.left = "0px"; // Ensure it starts correctly
animatePlane();
