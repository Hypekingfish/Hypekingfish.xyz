// Get the button once
const myBtn = document.getElementById("myBtn");

// Scroll event: show/hide button
window.addEventListener("scroll", () => {
  if (window.scrollY > 20) {
    myBtn.style.display = "block";
    myBtn.classList.add("show");
  } else {
    myBtn.style.display = "none";
    myBtn.classList.remove("show");
  }
});

// Click event: smooth scroll + ripple effect
myBtn.addEventListener("click", (e) => {
  // Smooth scroll
  window.scrollTo({ top: 0, behavior: "smooth" });

  // Ripple effect (optional)
  const ripple = myBtn.querySelector(".ripple");
  if (ripple) {
    ripple.classList.remove("clicked");
    void ripple.offsetWidth; // Trigger reflow
    ripple.classList.add("clicked");
  }
});
