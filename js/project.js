// Project Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all project page functionality
    initProjectDropdown();
    initTableOfContents();
    initScrollToTop();
    initNavbarScroll();
    initStickyToc();
});

// Project Dropdown Functionality
function initProjectDropdown() {
    const dropdownBtn = document.getElementById('projectDropdownBtn');
    const dropdownMenu = document.getElementById('projectDropdownMenu');
    
    if (!dropdownBtn || !dropdownMenu) return;
    
    // Toggle dropdown on button click
    dropdownBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        toggleDropdown();
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', function(e) {
        if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
            closeDropdown();
        }
    });
    
    // Handle dropdown item clicks
    const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            selectProject(this);
            closeDropdown();
        });
    });
    
    function toggleDropdown() {
        const isActive = dropdownMenu.classList.contains('active');
        if (isActive) {
            closeDropdown();
        } else {
            openDropdown();
        }
    }
    
    function openDropdown() {
        dropdownBtn.classList.add('active');
        dropdownMenu.classList.add('active');
    }
    
    function closeDropdown() {
        dropdownBtn.classList.remove('active');
        dropdownMenu.classList.remove('active');
    }
    
    function selectProject(selectedItem) {
        // Remove active class from all items
        dropdownItems.forEach(item => item.classList.remove('active'));
        
        // Add active class to selected item
        selectedItem.classList.add('active');
        
        // Update button text
        const projectName = selectedItem.textContent;
        dropdownBtn.querySelector('span').textContent = projectName;
        
        // Update page title
        document.title = `${projectName} - Michelle Ma Design Portfolio`;
    }
}

// Table of Contents Functionality
function initTableOfContents() {
    const tocLinks = document.querySelectorAll('.toc-link');
    const sections = document.querySelectorAll('.content-section');
    
    if (!tocLinks.length || !sections.length) return;
    
    // Handle TOC link clicks
    tocLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 140; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Update active TOC link on scroll
    function updateActiveTocLink() {
        const scrollPosition = window.scrollY + 200; // Offset for better UX
        
        let activeSection = null;
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                activeSection = section;
            }
        });
        
        // Update TOC active states
        tocLinks.forEach(link => {
            link.classList.remove('active');
            if (activeSection) {
                const targetId = activeSection.getAttribute('id');
                if (link.getAttribute('href') === `#${targetId}`) {
                    link.classList.add('active');
                }
            }
        });
    }
    
    // Throttled scroll listener for performance
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateActiveTocLink, 10);
    });
    
    // Initial call
    updateActiveTocLink();
}

// Scroll to Top Button
function initScrollToTop() {
    const scrollToTopBtn = document.getElementById('scrollToTop');
    
    if (!scrollToTopBtn) return;
    
    // Show/hide scroll to top button
    function toggleScrollToTop() {
        if (window.scrollY > 300) {
            scrollToTopBtn.classList.add('visible');
        } else {
            scrollToTopBtn.classList.remove('visible');
        }
    }
    
    // Scroll to top functionality
    scrollToTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
    
    // Throttled scroll listener
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(toggleScrollToTop, 10);
    });
    
    // Initial call
    toggleScrollToTop();
}

// Navbar Scroll Effect
function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    
    if (!navbar) return;
    
    function updateNavbarOnScroll() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    // Throttled scroll listener
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateNavbarOnScroll, 10);
    });
    
    // Initial call
    updateNavbarOnScroll();
}

// Sticky TOC Functionality - Enhanced with visibility control
function initStickyToc() {
    const tocContainer = document.getElementById('tocContainer');
    const tocContent = tocContainer?.querySelector('.toc-content');
    const projectContentSection = document.querySelector('.project-content');
    
    if (!tocContainer || !tocContent || !projectContentSection) return;
    
    // Initialize visibility control
    initTocVisibility();
    
    // Check if sticky positioning is supported and working
    const testSticky = document.createElement('div');
    testSticky.style.position = 'sticky';
    const stickySupported = testSticky.style.position === 'sticky';
    
    if (!stickySupported) {
        // Fallback for browsers that don't support sticky positioning
        implementStickyFallback();
    } else {
        // Monitor if CSS sticky is actually working
        monitorStickyBehavior();
    }
    
    function initTocVisibility() {
        let observer;
        
        function setupVisibilityObserver() {
            // Clean up existing observer
            if (observer) {
                observer.disconnect();
            }
            
            // Check if we're on mobile (where TOC is always visible in project-content)
            const isMobile = window.innerWidth <= 768;
            
            if (isMobile) {
                // On mobile, TOC is always visible when in project-content section
                tocContent.classList.add('visible');
                return;
            }
            
            // Use Intersection Observer to detect when project-content section is in view
            observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Project content section is in view, show TOC
                        tocContent.classList.add('visible');
                    } else {
                        // Project content section is not in view, hide TOC
                        tocContent.classList.remove('visible');
                    }
                });
            }, {
                // Trigger when the top 20% of the project-content section is visible
                rootMargin: '-20% 0px -80% 0px',
                threshold: 0
            });
            
            observer.observe(projectContentSection);
        }
        
        // Initial setup
        setupVisibilityObserver();
        
        // Handle window resize to switch between mobile and desktop behavior
        let resizeTimeout;
        window.addEventListener('resize', function() {
            if (resizeTimeout) {
                clearTimeout(resizeTimeout);
            }
            resizeTimeout = setTimeout(setupVisibilityObserver, 100);
        });
    }
    
    function implementStickyFallback() {
        const navbarHeight = 92; // 16px top + 76px height
        const offset = 16;
        const stickyTop = navbarHeight + offset;
        
        function updateTocPosition() {
            const scrollY = window.scrollY;
            const projectContentTop = projectContentSection.offsetTop;
            const shouldStick = scrollY > (projectContentTop - stickyTop);
            
            // Only apply sticky behavior if TOC is visible
            if (tocContent.classList.contains('visible') && shouldStick) {
                tocContent.style.position = 'fixed';
                tocContent.style.top = `${stickyTop}px`;
                tocContent.style.width = '200px'; // Match original width
            } else {
                tocContent.style.position = 'static';
                tocContent.style.width = 'auto';
            }
        }
        
        let scrollTimeout;
        window.addEventListener('scroll', function() {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
            }
            scrollTimeout = setTimeout(updateTocPosition, 5);
        });
        
        updateTocPosition();
    }
    
    function monitorStickyBehavior() {
        // Test if sticky is actually working by checking position changes
        let stickyTestTimeout;
        
        function testStickyWorking() {
            const currentScrollY = window.scrollY;
            const tocRect = tocContent.getBoundingClientRect();
            const expectedTop = 108; // Our sticky top value
            const projectContentTop = projectContentSection.offsetTop;
            
            // Only test if TOC is visible and we've scrolled past the project content start
            if (tocContent.classList.contains('visible') && 
                currentScrollY > projectContentTop && 
                Math.abs(tocRect.top - expectedTop) > 10) {
                console.log('TOC: CSS sticky may not be working, falling back to JavaScript');
                implementStickyFallback();
                return;
            }
        }
        
        window.addEventListener('scroll', function() {
            if (stickyTestTimeout) {
                clearTimeout(stickyTestTimeout);
            }
            stickyTestTimeout = setTimeout(testStickyWorking, 100);
        });
    }
}