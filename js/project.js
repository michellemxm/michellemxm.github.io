// Project Page JavaScript

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all project page functionality
    initProjectDropdown();
    initTableOfContents();
    initScrollToTop();
    initNavbarScroll();
    initStickyToc();
    initCarousel();
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
            const href = this.getAttribute('href');
            
            // Only prevent default for placeholder links (# or empty)
            if (!href || href === '#' || href === '') {
                e.preventDefault();
                selectProject(this);
            } else {
                // For real links, just update the active state and let navigation happen
                selectProject(this);
            }
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

    if (!tocLinks.length || !sections.length) {
        console.warn('TOC: Missing elements', { tocLinks: tocLinks.length, sections: sections.length });
        return;
    }
    
    console.log('TOC initialized with', tocLinks.length, 'links and', sections.length, 'sections');
    
    // Debug function - call window.enableTocDebug() in console to debug
    window.enableTocDebug = () => { window.tocDebug = true; };
    window.disableTocDebug = () => { window.tocDebug = false; };
    
    // Log section positions for debugging
    sections.forEach(section => {
        const h3 = section.querySelector('h3');
        if (h3) {
            console.log(`Section ${section.id}: h3 at ${h3.offsetTop}px`);
        }
    });

    // Handle TOC link clicks
    tocLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);

            if (targetSection) {
                // Get the absolute position of the section
                const rect = targetSection.getBoundingClientRect();
                const absoluteTop = rect.top + window.scrollY;
                
                // Position section just below the navbar with buffer
                const navbarHeight = 132;
                const buffer = 100; // Same buffer as trigger point
                const targetScrollY = absoluteTop - navbarHeight - buffer;
                
                window.scrollTo({
                    top: Math.max(0, targetScrollY),
                    behavior: 'smooth'
                });

                // Update active state immediately
                tocLinks.forEach(l => l.classList.remove('active'));
                this.classList.add('active');
            }
        });
    });

    // Update active TOC link on scroll
    function updateActiveTocLink() {
        const scrollY = window.scrollY;
        const navbarHeight = 132;
        
        // Get the start position of the project-content section
        const projectContentSection = document.querySelector('.project-content');
        const contentStartY = projectContentSection ? projectContentSection.offsetTop : 0;
        
        // Calculate trigger point relative to viewport
        const viewportTrigger = scrollY + navbarHeight + 100; // 100px buffer below navbar
        
        let activeSection = null;
        
        // Find all sections and their positions
        const sectionData = [];
        sections.forEach(section => {
            // Get absolute position of the section element
            const rect = section.getBoundingClientRect();
            const absoluteTop = rect.top + window.scrollY;
            
            sectionData.push({
                section: section,
                top: absoluteTop,
                bottom: absoluteTop + section.offsetHeight,
                id: section.id
            });
        });
        
        // Sort sections by position
        sectionData.sort((a, b) => a.top - b.top);
        
        // Find which section should be active
        for (let i = 0; i < sectionData.length; i++) {
            const current = sectionData[i];
            const next = sectionData[i + 1];
            
            // If we're past this section's top position
            if (viewportTrigger >= current.top) {
                // If there's no next section, or we haven't reached the next one yet
                if (!next || viewportTrigger < next.top) {
                    activeSection = current.section;
                    break;
                }
            }
        }
        
        // Only activate sections if we're actually in the content area
        if (scrollY < contentStartY - 200) {
            activeSection = null;
        }

        // Update TOC active states
        tocLinks.forEach(link => {
            link.classList.remove('active');
        });
        
        if (activeSection) {
            const targetId = activeSection.getAttribute('id');
            const activeLink = document.querySelector(`.toc-link[href="#${targetId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
        
        // Debug logging
        if (window.tocDebug) {
            console.log('ScrollY:', scrollY, 'ContentStart:', contentStartY, 'ViewportTrigger:', viewportTrigger, 'Active:', activeSection?.id || 'none');
            sectionData.forEach(s => {
                console.log(`  ${s.id}: ${s.top}px - ${s.bottom}px`);
            });
        }
    }

    // Scroll listener for TOC updates
    function handleScroll() {
        updateActiveTocLink();
    }
    
    // Use requestAnimationFrame for better performance
    let ticking = false;
    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(function() {
                handleScroll();
                ticking = false;
            });
            ticking = true;
        }
    });

    // Initial call
    setTimeout(updateActiveTocLink, 100);
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
            tocContent.style.width = '240px';
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

// Carousel Functionality
function initCarousel() {
    const carouselContainers = document.querySelectorAll('.carousel-container');
    
    if (!carouselContainers.length) return;
    
    // Initialize each carousel separately
    carouselContainers.forEach(carouselContainer => {
        const slides = carouselContainer.querySelectorAll('.carousel-slide');
        const descriptions = carouselContainer.querySelectorAll('.carousel-description');
        const buttons = carouselContainer.querySelectorAll('.carousel-btn');
        
        if (!slides.length || !buttons.length) return;
        
        let currentSlide = 0;
        
        function showSlide(index) {
            // Remove active class from all elements in this carousel
            slides.forEach(slide => slide.classList.remove('active'));
            descriptions.forEach(desc => desc.classList.remove('active'));
            buttons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to current elements
            if (slides[index]) slides[index].classList.add('active');
            if (descriptions[index]) descriptions[index].classList.add('active');
            if (buttons[index]) buttons[index].classList.add('active');
            
            currentSlide = index;
        }
        
        // Handle button clicks
        buttons.forEach((button, index) => {
            button.addEventListener('click', function() {
                showSlide(index);
            });
        });
        
        // Initialize first slide
        showSlide(0);
    });
}