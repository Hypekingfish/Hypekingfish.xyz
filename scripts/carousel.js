let currentIndex = Math.floor(Math.random() * 3); // Start at random image
const slides = document.querySelectorAll(".carousel-item");
const totalSlides = slides.length;
const dotsContainer = document.querySelector(".carousel-dots");
const progressBar = document.querySelector(".progress-bar");

let autoRotate;

// Create dots dynamically
for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement("span");
    dot.classList.add("dot");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
}

const dots = document.querySelectorAll(".dot");

function moveSlide(direction) {
    currentIndex = (currentIndex + direction + totalSlides) % totalSlides;
    updateCarousel();
}

function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
}

function updateCarousel() {
    slides.forEach((slide, index) => {
        slide.classList.toggle("active", index === currentIndex);
    });

    dots.forEach((dot, index) => {
        dot.classList.toggle("active", index === currentIndex);
    });

    document.querySelector(".carousel-slide").style.transform = `translateX(-${currentIndex * 100}%)`;

    resetProgressBar();
}

// Auto-rotate images every 5 seconds
function startAutoRotate() {
    autoRotate = setInterval(() => moveSlide(1), 5000);
    resetProgressBar();
}

function resetProgressBar() {
    progressBar.style.transition = "opacity 0.3s ease-out, width 0.3s ease-in"; // Cool shrink & fade
    progressBar.style.opacity = "0";  
    progressBar.style.width = "0%";  

    setTimeout(() => {
        progressBar.style.transition = "width 5s linear, opacity 0.5s ease-in"; // Smooth grow effect
        progressBar.style.opacity = "1";  
        progressBar.style.width = "100%";
    }, 300); // Tiny delay for smooth effect
}

// Pause on hover
document.querySelector(".carousel-container").addEventListener("mouseenter", () => clearInterval(autoRotate));
document.querySelector(".carousel-container").addEventListener("mouseleave", startAutoRotate);

// Keyboard Navigation
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") moveSlide(-1);
    if (e.key === "ArrowRight") moveSlide(1);
});

// Touch Swipe Support
let startX = 0;
document.querySelector(".carousel-container").addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
});
document.querySelector(".carousel-container").addEventListener("touchend", (e) => {
    let endX = e.changedTouches[0].clientX;
    if (startX - endX > 50) moveSlide(1); // Swipe Left
    if (startX - endX < -50) moveSlide(-1); // Swipe Right
});

updateCarousel();
startAutoRotate();