document.addEventListener("DOMContentLoaded", function() {
    const cards = document.querySelectorAll('.aircraft-card');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const infoDisplay = document.querySelector('.aircraft-info');

    let currentIndex = 0;

    function updateCarousel() {
        cards.forEach((card, index) => {
            card.classList.remove('active');
            card.style.transform = `translateX(${(index - currentIndex) * 100}%) scale(${index === currentIndex ? 1 : 0.8})`;
            card.style.opacity = index === currentIndex ? "1" : "0";
        });

        infoDisplay.textContent = cards[currentIndex].dataset.name;
    }

    prevBtn.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + cards.length) % cards.length;
        updateCarousel();
    });

    nextBtn.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % cards.length;
        updateCarousel();
    });

    updateCarousel();
});
