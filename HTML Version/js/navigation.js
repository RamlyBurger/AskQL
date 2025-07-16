// Get current page path
const currentPath = window.location.pathname;
const isRoot = currentPath.endsWith('index.html') || currentPath.endsWith('/');

// Adjust paths based on current location
const homeLink = isRoot ? 'index.html' : '../index.html';
const pagesPrefix = isRoot ? 'pages/' : '';

// Theme management
function getTheme() {
    return localStorage.getItem('theme') || 'light';
}

function setTheme(theme) {
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    // Add or remove dark class for Tailwind dark mode
    if (theme === 'dark') {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

// Navigation HTML template
const navHTML = `
<nav class="fixed top-0 left-0 right-0 bg-white dark:bg-gray-800 shadow-md z-50">
    <div class="container mx-auto px-6 py-4">
        <div class="flex justify-between items-center">
            <a href="${homeLink}" class="flex items-center space-x-3">
                <span class="text-2xl font-bold text-blue-600 dark:text-blue-400">AskQL</span>
            </a>
            
            <!-- Desktop Navigation -->
            <div class="hidden md:flex items-center space-x-8">
                <a href="${homeLink}" class="nav-link" data-page="index">Home</a>
                ${isRoot ? `
                <a href="#services" class="nav-link" data-page="services">Services</a>
                <a href="#testimonials" class="nav-link" data-page="testimonials">Testimonials</a>
                <a href="#why-askql" class="nav-link" data-page="why-askql">Why AskQL</a>
                ` : ''}
                <a href="${pagesPrefix}database.html" class="nav-link" data-page="database">Database</a>
                <a href="${pagesPrefix}erd.html" class="nav-link" data-page="erd">ERD</a>
                <a href="${pagesPrefix}insights.html" class="nav-link" data-page="insights">Insights</a>
                
                <!-- Theme Toggle Button -->
                <button id="theme-toggle" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" aria-label="Toggle theme">
                    <i class="fas fa-moon dark-icon hidden text-gray-600 dark:text-gray-300"></i>
                    <i class="fas fa-sun light-icon text-gray-600 dark:text-gray-300"></i>
                </button>
            </div>

            <!-- Mobile Menu Button -->
            <div class="md:hidden flex items-center space-x-4">
                <button id="theme-toggle-mobile" class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200" aria-label="Toggle theme">
                    <i class="fas fa-moon dark-icon hidden text-gray-600 dark:text-gray-300"></i>
                    <i class="fas fa-sun light-icon text-gray-600 dark:text-gray-300"></i>
                </button>
                <button class="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none" id="mobile-menu-button">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>
            </div>
        </div>

        <!-- Mobile Navigation -->
        <div class="md:hidden hidden" id="mobile-menu">
            <div class="flex flex-col space-y-4 mt-4 pb-4">
                <a href="${homeLink}" class="nav-link" data-page="index">Home</a>
                ${isRoot ? `
                <a href="#services" class="nav-link" data-page="services">Services</a>
                <a href="#testimonials" class="nav-link" data-page="testimonials">Testimonials</a>
                <a href="#why-askql" class="nav-link" data-page="why-askql">Why AskQL</a>
                ` : ''}
                <a href="${pagesPrefix}database.html" class="nav-link" data-page="database">Database</a>
                <a href="${pagesPrefix}erd.html" class="nav-link" data-page="erd">ERD</a>
                <a href="${pagesPrefix}insights.html" class="nav-link" data-page="insights">Insights</a>
            </div>
        </div>
    </div>
</nav>
`;

// Insert navigation into the page
document.getElementById('nav-placeholder').innerHTML = navHTML;

// Initialize theme
function initTheme() {
    const currentTheme = getTheme();
    setTheme(currentTheme);
    updateThemeIcons(currentTheme);
}

// Update theme icons
function updateThemeIcons(theme) {
    const darkIcons = document.querySelectorAll('.dark-icon');
    const lightIcons = document.querySelectorAll('.light-icon');
    
    if (theme === 'dark') {
        darkIcons.forEach(icon => icon.classList.remove('hidden'));
        lightIcons.forEach(icon => icon.classList.add('hidden'));
    } else {
        darkIcons.forEach(icon => icon.classList.add('hidden'));
        lightIcons.forEach(icon => icon.classList.remove('hidden'));
    }
}

// Theme toggle functionality
function initThemeToggle() {
    const toggleBtns = document.querySelectorAll('#theme-toggle, #theme-toggle-mobile');
    
    toggleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // If the user has explicitly chosen light or dark mode
            if (localStorage.theme === 'dark') {
                localStorage.theme = 'light';
                document.documentElement.classList.remove('dark');
            } else {
                localStorage.theme = 'dark';
                document.documentElement.classList.add('dark');
            }
            updateThemeIcons(localStorage.theme);
        });
    });
}

// Style for navigation links
const navLinkStyle = 'text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200';
const activeNavLinkStyle = 'text-blue-600 dark:text-blue-400 font-medium';

// Handle smooth scrolling for anchor links on the landing page
function initSmoothScroll() {
    if (isRoot) {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                    // Close mobile menu if open
                    const mobileMenu = document.getElementById('mobile-menu');
                    if (mobileMenu) {
                        mobileMenu.classList.add('hidden');
                    }
                }
            });
        });
    }
}

// Set active navigation link based on current page
function setActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.className = navLinkStyle;
        const page = link.getAttribute('data-page');
        if (currentPath.includes(page)) {
            link.className = `${navLinkStyle} ${activeNavLinkStyle}`;
        }
    });

    // Handle active state for landing page sections
    if (isRoot) {
        window.addEventListener('scroll', () => {
            const sections = ['services', 'testimonials', 'why-askql'];
            let currentSection = '';

            sections.forEach(section => {
                const element = document.getElementById(section);
                if (element) {
                    const rect = element.getBoundingClientRect();
                    if (rect.top <= 150 && rect.bottom >= 150) {
                        currentSection = section;
                    }
                }
            });

            navLinks.forEach(link => {
                const page = link.getAttribute('data-page');
                if (page === currentSection) {
                    link.className = `${navLinkStyle} ${activeNavLinkStyle}`;
                } else if (!currentPath.includes(page)) {
                    link.className = navLinkStyle;
                }
            });
        });
    }
}

// Mobile menu toggle
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!mobileMenuButton.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.add('hidden');
    }
});

// Initialize everything
setActiveNavLink();
initTheme();
initThemeToggle();
initSmoothScroll(); 