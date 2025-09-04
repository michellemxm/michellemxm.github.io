// Project Page JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all project page functionality
    initProjectDropdown();
    initTableOfContents();
    initScrollToTop();
    initNavbarScroll();
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

// Sticky TOC Functionality
function initStickyToc() {
    const tocContainer = document.getElementById('tocContainer');
    
    if (!tocContainer) return;
    
    function updateTocPosition() {
        const scrollY = window.scrollY;
        const navbarHeight = 92;
        const offset = 40;
        
        if (scrollY > navbarHeight + offset) {
            tocContainer.style.position = 'fixed';
            tocContainer.style.top = `${navbarHeight + offset}px`;
        } else {
            tocContainer.style.position = 'static';
        }
    }
    
    // Note: The sticky positioning is handled via CSS, but this function
    // can be used for more complex sticky behavior if needed
    
    window.addEventListener('scroll', updateTocPosition);
    updateTocPosition();
}