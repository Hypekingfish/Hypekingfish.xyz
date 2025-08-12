document.addEventListener("DOMContentLoaded", () => {
  const starContainers = document.querySelectorAll(".star-rating");

  starContainers.forEach(container => {
    const rating = parseInt(container.getAttribute("data-rating"), 10) || 0;
    container.innerHTML = "";

    for (let i = 1; i <= 5; i++) {
      const star = document.createElement("span");
      if (i <= rating) {
        star.textContent = "★";
      } else {
        star.textContent = "☆";
        star.classList.add("empty");
      }
      container.appendChild(star);
    }
  });
});
