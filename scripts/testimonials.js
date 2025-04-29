const testimonials = document.querySelectorAll('.testimonial');
    let currentIndex = 0;

    function rotateTestimonials() {
        testimonials.forEach((testimonial, index) => {
            testimonial.classList.remove('active');
            if (index === currentIndex) {
                testimonial.classList.add('active');
            }
        });

        currentIndex = (currentIndex + 1) % testimonials.length;
    }

    if (testimonials.length > 1) {
        testimonials[0].classList.add('active');
        setInterval(rotateTestimonials, 5000); // Rotate every 5 seconds
    }
