document.addEventListener('DOMContentLoaded', function() {
    const track = document.querySelector('.testimonial-track');
    const slides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.testimonial-prev');
    const nextBtn = document.querySelector('.testimonial-next');
    const dots = document.querySelectorAll('.testimonial-dot');

    if (!track || slides.length === 0) return;

    // State variables
    let currentIndex = 0;
    let startPos = 0;
    let currentTranslate = 0;
    let prevTranslate = 0;
    let isDragging = false;
    let animationID = 0;
    let autoplayTimer = null;

    // Set track width and slide widths
    track.style.width = `${slides.length * 100}%`;
    track.style.transform = 'translateX(0)';
    track.style.transition = 'transform 0.3s ease-out';
    
    slides.forEach(slide => {
        slide.style.width = `${100 / slides.length}%`;
    });

    // Update dots
    function updateDots() {
        dots.forEach((dot, index) => {
            if (index === currentIndex) {
                dot.classList.remove('bg-gray-600');
                dot.classList.add('bg-blue-500');
            } else {
                dot.classList.remove('bg-blue-500');
                dot.classList.add('bg-gray-600');
            }
        });
    }

    // Move to slide
    function moveToSlide(index) {
        currentIndex = index;
        currentTranslate = currentIndex * -(100 / slides.length);
        prevTranslate = currentTranslate;
        track.style.transform = `translateX(${currentTranslate}%)`;
        updateDots();
    }

    // Next slide
    function moveToNextSlide() {
        if (currentIndex >= slides.length - 1) {
            moveToSlide(0);
        } else {
            moveToSlide(currentIndex + 1);
        }
    }

    // Previous slide
    function moveToPrevSlide() {
        if (currentIndex <= 0) {
            moveToSlide(slides.length - 1);
        } else {
            moveToSlide(currentIndex - 1);
        }
    }

    // Start autoplay
    function startAutoplay() {
        stopAutoplay();
        autoplayTimer = setInterval(moveToNextSlide, 5000);
    }

    // Stop autoplay
    function stopAutoplay() {
        if (autoplayTimer) {
            clearInterval(autoplayTimer);
            autoplayTimer = null;
        }
    }

    // Touch events
    function touchStart(event) {
        stopAutoplay();
        startPos = getPositionX(event);
        isDragging = true;
        animationID = requestAnimationFrame(animation);
        track.style.transition = 'none';
        track.classList.add('cursor-grabbing');
    }

    function touchMove(event) {
        if (isDragging) {
            const currentPosition = getPositionX(event);
            const moveBy = (currentPosition - startPos) / track.offsetWidth * 100;
            currentTranslate = prevTranslate + moveBy;
            track.style.transform = `translateX(${currentTranslate}%)`;
        }
    }

    function touchEnd() {
        isDragging = false;
        cancelAnimationFrame(animationID);
        track.classList.remove('cursor-grabbing');
        track.style.transition = 'transform 0.3s ease-out';

        const movedBy = currentTranslate - prevTranslate;
        
        if (Math.abs(movedBy) > 20) {
            if (movedBy < 0) {
                moveToNextSlide();
            } else {
                moveToPrevSlide();
            }
        } else {
            moveToSlide(currentIndex);
        }

        startAutoplay();
    }

    function animation() {
        if (isDragging) {
            requestAnimationFrame(animation);
        }
    }

    function getPositionX(event) {
        return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
    }

    // Event Listeners
    prevBtn.addEventListener('click', () => {
        stopAutoplay();
        moveToPrevSlide();
        startAutoplay();
    });

    nextBtn.addEventListener('click', () => {
        stopAutoplay();
        moveToNextSlide();
        startAutoplay();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            stopAutoplay();
            moveToSlide(index);
            startAutoplay();
        });
    });

    // Touch events
    track.addEventListener('mousedown', touchStart);
    track.addEventListener('touchstart', touchStart, { passive: true });

    track.addEventListener('mousemove', touchMove);
    track.addEventListener('touchmove', touchMove, { passive: true });

    track.addEventListener('mouseup', touchEnd);
    track.addEventListener('touchend', touchEnd);
    track.addEventListener('mouseleave', touchEnd);

    // Initialize
    updateDots();
    startAutoplay();

    // Pause autoplay on hover
    track.addEventListener('mouseenter', stopAutoplay);
    track.addEventListener('mouseleave', startAutoplay);
}); 