// Counter initialization
function initializeCounters() {
    const counterElements = document.querySelectorAll('.counter');
    
    counterElements.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const startValue = parseInt(counter.textContent) || 0;
        const increment = (target - startValue) / (duration / 16); // 60fps
        
        function updateCounter(currentValue) {
            const value = Math.ceil(currentValue + increment);
            if (value <= target) {
                counter.textContent = value;
                requestAnimationFrame(() => updateCounter(value));
            } else {
                counter.textContent = target;
            }
        }
        
        // Start the counter animation when element is in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter(startValue);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(counter);
    });
}

// Initialize counters when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeCounters); 