

// Contact form handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Simple validation
        if (!name || !email || !subject || !message) {
            alert('Please fill in all fields');
            return;
        }
        
        // Here you would typically send the form data to a server
        // For now, we'll just show a success message
        alert('Thank you for your message! I\'ll get back to you soon.');
        contactForm.reset();
    });
}



// Smooth reveal animations on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for animation
document.addEventListener('DOMContentLoaded', () => {
    const animateElements = document.querySelectorAll('.project-item, .stat-item, .contact-item');
    
    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
});

// Scroll to top button functionality
document.addEventListener('DOMContentLoaded', () => {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    const heroSection = document.getElementById('home');
    
    if (scrollToTopBtn && heroSection) {
        // Show/hide button based on scroll position
        window.addEventListener('scroll', () => {
            const heroHeight = heroSection.offsetHeight;
            
            if (window.scrollY > heroHeight) {
                scrollToTopBtn.classList.add('visible');
            } else {
                scrollToTopBtn.classList.remove('visible');
            }
        });
        
        // Scroll to top when button is clicked
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});

// Work section tab functionality and visibility
document.addEventListener('DOMContentLoaded', () => {
    const tabButtons = document.querySelectorAll('.tab-button');
    const workTabsFixed = document.querySelector('.work-tabs-fixed');
    const workSection = document.getElementById('work');
    const workProjects = document.querySelectorAll('.work-project');
    
    // Handle tab button clicks - scroll to respective project
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const tabName = button.getAttribute('data-tab');
            const targetProject = document.getElementById(`project-${tabName}`);
            
            if (targetProject) {
                targetProject.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Function to update active tab with project-specific colors
    function updateActiveTab(activeProjectName) {
        // Remove all active classes
        tabButtons.forEach(btn => {
            btn.classList.remove('active', 'kiro-active', 'alexa-active', 'more-active');
        });
        
        // Add active class to current tab with project-specific color
        const activeTab = document.querySelector(`[data-tab="${activeProjectName}"]`);
        if (activeTab) {
            activeTab.classList.add('active');
            activeTab.classList.add(`${activeProjectName}-active`);
        }
    }
    
    // Intersection Observer to detect which project is in view
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const projectName = entry.target.getAttribute('data-project');
                updateActiveTab(projectName);
            }
        });
    }, {
        root: null,
        rootMargin: '-20% 0px -20% 0px',
        threshold: 0.5
    });
    
    // Observe all work projects for highlighting
    workProjects.forEach(project => {
        projectObserver.observe(project);
    });
    
    // Show/hide tabs based on Work section visibility
    const workObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                workTabsFixed.style.opacity = '1';
                workTabsFixed.style.visibility = 'visible';
            } else {
                workTabsFixed.style.opacity = '0';
                workTabsFixed.style.visibility = 'hidden';
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px 0px 0px'
    });
    
    if (workSection && workTabsFixed) {
        // Set initial transition
        workTabsFixed.style.transition = 'opacity 0.3s ease, visibility 0.3s ease';
        
        // Check initial visibility on page load
        const workRect = workSection.getBoundingClientRect();
        const isWorkVisible = workRect.top < window.innerHeight && workRect.bottom > 0;
        
        if (isWorkVisible) {
            workTabsFixed.style.opacity = '1';
            workTabsFixed.style.visibility = 'visible';
        } else {
            workTabsFixed.style.opacity = '0';
            workTabsFixed.style.visibility = 'hidden';
        }
        
        // Observe work section
        workObserver.observe(workSection);
    }
    
    // Initialize with first project active
    updateActiveTab('kiro');
});