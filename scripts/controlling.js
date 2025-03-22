// Animated Counter Effect for Controller Hours
document.addEventListener("DOMContentLoaded", function() {
    const counters = document.querySelectorAll(".counter");
    counters.forEach(counter => {
        let target = +counter.getAttribute("data-target");
        let count = 0;
        let step = Math.ceil(target / 100);

        function updateCounter() {
            if (count < target) {
                count += step;
                counter.innerText = count > target ? target : count;
                setTimeout(updateCounter, 20);
            }
        }
        updateCounter();
    });
});

// Lightbox Functionality
document.querySelectorAll('.lightbox-trigger').forEach(img => {
    img.addEventListener('click', function() {
        document.getElementById("lightbox").classList.remove("hidden");
        document.getElementById("lightbox-img").src = this.src;
    });
});

document.querySelector('.close-lightbox').addEventListener('click', function() {
    document.getElementById("lightbox").classList.add("hidden");
});

document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll(".star-rating").forEach((ratingElement) => {
        let rating = parseInt(ratingElement.getAttribute("data-rating"));
        ratingElement.innerHTML = generateStars(rating);
    });
});

// Function to generate star symbols dynamically
function generateStars(rating) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        stars += i <= rating ? "&#9733;" : "&#9734;"; // ★ = filled star, ☆ = empty star
    }
    return stars;
}

// Rotating Testimonials
const testimonials = [
    "Very good work for what seemed like the first few sessions on ground. Keep it up and keep practicing. Would Fly Again: Yes",
    "Smooth instructions and top-tier ATC skills. - PilotNate98",
    "Helped me through my first ever VATSIM IFR approach! - NewbiePilot23",
    "Always a pleasure flying with this controller online. - ZSEPilot"
];

let testimonialIndex = 0;
setInterval(() => {
    document.getElementById("testimonial-text").innerText = testimonials[testimonialIndex];
    testimonialIndex = (testimonialIndex + 1) % testimonials.length;
}, 5000);