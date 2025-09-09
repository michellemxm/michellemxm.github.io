// Project Page JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all project page functionality
    initProjectDropdown();
    initTableOfContents();
    initScrollToTop();
    initNavbarScroll();
    initStickyToc();
});

// Also initialize after window load to handle cached scroll positions
window.addEventListener('load', function () {
    // Re-trigger TOC positioning after all resources are loaded
    // This will be handled by the scroll event in initStickyToc
    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
    }, 100);
});

// Project Dropdown Functionality
function initProjectDropdown() {
    const dropdownBtn = document.getElementById('projectDropdownBtn');
    const dropdownMenu = document.getElementById('projectDropdownMenu');

    if (!dropdownBtn || !dropdownMenu) return;

    // Toggle dropdown on button click
    dropdownBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleDropdown();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
        if (!dropdownBtn.contains(e.target) && !dropdownMenu.contains(e.target)) {
            closeDropdown();
        }
    });

    // Handle dropdown item clicks
    const dropdownItems = dropdownMenu.querySelectorAll('.dropdown-item');
    dropdownItems.forEach(item => {
        item.addEventListener('click', function (e) {
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
        link.addEventListener('click', function (e) {
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
    window.addEventListener('scroll', function () {
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
    scrollToTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Throttled scroll listener
    let scrollTimeout;
    window.addEventListener('scroll', function () {
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
    window.addEventListener('scroll', function () {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateNavbarOnScroll, 10);
    });

    // Initial call
    updateNavbarOnScroll();
}

// Sticky TOC Functionality - JavaScript implementation
function initStickyToc() {
    const tocContainer = document.getElementById('tocContainer');
    const tocContent = tocContainer?.querySelector('.toc-content');
    const projectContentSection = document.querySelector('.project-content');

    if (!tocContainer || !tocContent || !projectContentSection) return;

    const stickyTop = 108; // Distance from top when sticky
    let projectContentTop = null;
    let isSticky = false;

    function updateTocPosition() {
        const isMobile = window.innerWidth <= 768;
        
        if (isMobile) {
            // On mobile, reset to static positioning
            tocContent.style.position = 'static';
            tocContent.style.top = 'auto';
            tocContent.style.width = 'auto';
            tocContent.classList.add('visible');
            return;
        }

        // Get the position of the project-content section
        if (projectContentTop === null) {
            projectContentTop = projectContentSection.offsetTop;
        }

        const scrollY = window.scrollY;
        // Only show TOC when we reach the project-content section
        const shouldShowToc = scrollY >= (projectContentTop - stickyTop - 50);

        if (shouldShowToc && !isSticky) {
            // Make it sticky and visible
            tocContent.style.position = 'fixed';
            tocContent.style.top = `${stickyTop}px`;
            tocContent.style.width = '200px';
            tocContent.style.zIndex = '10';
            tocContent.classList.add('visible');
            isSticky = true;
        } else if (!shouldShowToc && isSticky) {
            // Hide and return to normal position
            tocContent.style.position = 'static';
            tocContent.style.top = 'auto';
            tocContent.style.width = 'auto';
            tocContent.classList.remove('visible');
            isSticky = false;
        } else if (shouldShowToc) {
            // Already sticky, just ensure visibility
            tocContent.classList.add('visible');
        } else {
            // Not at project content yet, ensure hidden
            tocContent.classList.remove('visible');
        }
    }

    // Initial check
    updateTocPosition();

    // Update on scroll
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(updateTocPosition, 5);
    });

    // Update on resize
    let resizeTimeout;
    window.addEventListener('resize', function() {
        if (resizeTimeout) {
            clearTimeout(resizeTimeout);
        }
        resizeTimeout = setTimeout(() => {
            // Reset project content position on resize
            projectContentTop = null;
            isSticky = false;
            updateTocPosition();
        }, 100);
    });
}