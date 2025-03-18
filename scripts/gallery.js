const images = [
    "img/Freedom_One.PNG",
    "img/Alaska_Honoring.PNG",
    "img/N915AK.png"
];

let currentIndex = 0;
const imgElement = document.getElementById("gallery-image");
const lightbox = document.getElementById("lightbox");
const lightboxImage = document.getElementById("lightbox-image");

// Auto-Rotate Images
setInterval(() => {
    currentIndex = (currentIndex + 1) % images.length;
    imgElement.src = images[currentIndex];
}, 3000);

// Open Lightbox
function openLightbox() {
    lightbox.style.display = "flex";
    lightboxImage.src = images[currentIndex];
}

// Close Lightbox on Click
function closeLightbox() {
    lightbox.style.display = "none";
}
