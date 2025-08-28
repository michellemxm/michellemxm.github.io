class PaginatedScroll {
    constructor() {
        this.sections = [];
        this.currentSection = 0;
        this.isScrolling = false;
        this.scrollThreshold = window.innerHeight * 0.5; // 50vh
        this.lastScrollTime = 0;
        this.scrollCooldown = 100; // Minimum time between scroll events
        
        // Store instance globally for debugging
        window.paginatedScrollInstance = this;
        
        this.init();
    }

    init() {
        this.setupSections();
        this.createScrollIndicator();
        this.bindEvents();
        this.updateActiveSection();
    }

    setupSections() {
        // Define all sections including work subsections
        const sectionSelectors = [
            '#home',
            '#project-kiro',
            '#project-alexa', 
            '#project-more',
            '#about',
            '#contact'
        ];

        this.sections = sectionSelectors.map(selector => {
            const element = document.querySelector(selector);
            if (element) {
                element.classList.add('snap-section');
                return {
                    element,
                    id: selector.replace('#', ''),
                    offsetTop: element.offsetTop
                };
            } else {
                console.warn(`Section ${selector} not found`);
                return null;
            }
        }).filter(Boolean);

        // Add debug function
        window.debugSections = () => {
            console.log('Current sections:', this.sections.map(s => ({
                id: s.id,
                offsetTop: s.offsetTop,
                element: s.element,
                height: s.element.offsetHeight
            })));
            console.log('Current scroll position:', window.pageYOffset);
            console.log('Current section index:', this.getCurrentSectionIndex());
        };
        
        // Log initial section positions
        setTimeout(() => {
            console.log('Initial section positions:', this.sections.map(s => ({
                id: s.id,
                offsetTop: s.offsetTop,
                height: s.element.offsetHeight
            })));
        }, 1000);

        // Update offsets on resize
        window.addEventListener('resize', () => {
            this.updateSectionOffsets();
        });
        
        // Update offsets after a short delay to ensure layout is complete
        setTimeout(() => {
            this.updateSectionOffsets();
        }, 500);
    }

    updateSectionOffsets() {
        this.sections.forEach((section, index) => {
            const actualOffsetTop = section.element.offsetTop;
            
            // For work sections, ensure they are properly spaced
            if (section.id.startsWith('project-')) {
                const homeSection = this.sections.find(s => s.id === 'home');
                const homeHeight = homeSection ? homeSection.element.offsetHeight : window.innerHeight;
                
                if (section.id === 'project-kiro') {
                    section.offsetTop = homeHeight;
                } else if (section.id === 'project-alexa') {
                    section.offsetTop = homeHeight + window.innerHeight;
                } else if (section.id === 'project-more') {
                    section.offsetTop = homeHeight + (window.innerHeight * 2);
                }
            } else {
                section.offsetTop = actualOffsetTop;
            }
            
            console.log(`Section ${section.id}: calculated=${section.offsetTop}, actual=${actualOffsetTop}`);
        });
        
        // Also update work tabs visibility when offsets change
        this.updateWorkTabsVisibility();
    }

    createScrollIndicator() {
        const indicator = document.createElement('div');
        indicator.className = 'scroll-indicator';
        
        this.sections.forEach((section, index) => {
            const dot = document.createElement('div');
            dot.className = 'scroll-dot';
            dot.dataset.section = index;
            dot.addEventListener('click', () => this.scrollToSection(index));
            indicator.appendChild(dot);
        });

        document.body.appendChild(indicator);
        this.scrollDots = indicator.querySelectorAll('.scroll-dot');
    }

    bindEvents() {
        let ticking = false;

        // Wheel event for desktop
        window.addEventListener('wheel', (e) => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.handleWheelScroll(e);
                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: false });

        // Touch events for mobile
        let touchStartY = 0;
        let touchEndY = 0;

        window.addEventListener('touchstart', (e) => {
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        window.addEventListener('touchend', (e) => {
            touchEndY = e.changedTouches[0].screenY;
            this.handleTouchScroll(touchStartY, touchEndY);
        }, { passive: true });

        // Scroll event for updating active section
        window.addEventListener('scroll', () => {
            if (!this.isScrolling) {
                this.updateActiveSection();
            }
        }, { passive: true });

        // Update work tabs visibility
        window.addEventListener('scroll', () => {
            this.updateWorkTabsVisibility();
        }, { passive: true });
    }

    handleWheelScroll(e) {
        const now = Date.now();
        if (now - this.lastScrollTime < this.scrollCooldown) {
            return;
        }

        if (Math.abs(e.deltaY) < 10) return; // Ignore small scroll movements

        e.preventDefault();
        
        const direction = e.deltaY > 0 ? 1 : -1;
        const currentScrollY = window.pageYOffset;
        
        // Force update section offsets before finding target
        this.updateSectionOffsets();
        
        const targetSection = this.findTargetSection(currentScrollY, direction);

        if (targetSection !== -1 && targetSection !== this.currentSection) {
            console.log('Scrolling to section:', targetSection, this.sections[targetSection]?.id);
            this.scrollToSection(targetSection);
            this.lastScrollTime = now;
        }
    }

    handleTouchScroll(startY, endY) {
        const deltaY = startY - endY;
        const threshold = 50; // Minimum swipe distance

        if (Math.abs(deltaY) < threshold) return;

        const direction = deltaY > 0 ? 1 : -1;
        const currentScrollY = window.pageYOffset;
        const targetSection = this.findTargetSection(currentScrollY, direction);

        if (targetSection !== -1 && targetSection !== this.currentSection) {
            this.scrollToSection(targetSection);
        }
    }

    findTargetSection(currentScrollY, direction) {
        const currentSectionIndex = this.getCurrentSectionIndex(currentScrollY);
        
        // Debug logging
        console.log('Current section:', currentSectionIndex, this.sections[currentSectionIndex]?.id);
        console.log('Direction:', direction > 0 ? 'down' : 'up');
        console.log('Current scroll Y:', currentScrollY);
        
        if (direction > 0) {
            // Scrolling down
            const nextIndex = Math.min(currentSectionIndex + 1, this.sections.length - 1);
            console.log('Target section:', nextIndex, this.sections[nextIndex]?.id);
            return nextIndex;
        } else {
            // Scrolling up
            const prevIndex = Math.max(currentSectionIndex - 1, 0);
            console.log('Target section:', prevIndex, this.sections[prevIndex]?.id);
            return prevIndex;
        }
    }

    getCurrentSectionIndex(scrollY = window.pageYOffset) {
        // Use a smaller threshold for more accurate detection
        const threshold = window.innerHeight * 0.3; // 30vh instead of 50vh
        
        for (let i = this.sections.length - 1; i >= 0; i--) {
            if (scrollY >= this.sections[i].offsetTop - threshold) {
                return i;
            }
        }
        return 0;
    }

    scrollToSection(index) {
        if (index < 0 || index >= this.sections.length || this.isScrolling) {
            return;
        }

        this.isScrolling = true;
        this.currentSection = index;
        
        const targetSection = this.sections[index];
        
        console.log(`Scrolling to ${targetSection.id} at offsetTop: ${targetSection.offsetTop}`);
        
        window.scrollTo({
            top: targetSection.offsetTop,
            behavior: 'smooth'
        });

        // Reset scrolling flag after animation
        setTimeout(() => {
            this.isScrolling = false;
            this.updateActiveSection();
            console.log(`Finished scrolling to ${targetSection.id}, current scroll: ${window.pageYOffset}`);
        }, 800);

        this.updateScrollIndicator();
    }

    updateActiveSection() {
        const currentIndex = this.getCurrentSectionIndex();
        if (currentIndex !== this.currentSection) {
            this.currentSection = currentIndex;
            this.updateScrollIndicator();
        }
    }

    updateScrollIndicator() {
        this.scrollDots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSection);
        });
    }

    updateWorkTabsVisibility() {
        const workTabs = document.querySelector('.work-tabs-fixed');
        if (!workTabs) return;

        const kiroProject = document.querySelector('#project-kiro');
        const moreProject = document.querySelector('#project-more');
        
        if (!kiroProject || !moreProject) return;

        const workSectionStart = kiroProject.offsetTop - window.innerHeight * 0.1;
        const workSectionEnd = moreProject.offsetTop + moreProject.offsetHeight + window.innerHeight * 0.1;
        const currentScroll = window.pageYOffset + window.innerHeight / 2;

        if (currentScroll >= workSectionStart && currentScroll <= workSectionEnd) {
            workTabs.classList.remove('hidden');
        } else {
            workTabs.classList.add('hidden');
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other scripts to initialize
    setTimeout(() => {
        new PaginatedScroll();
    }, 100);
});

// Handle page refresh/reload and reinitialize after full load
window.addEventListener('load', () => {
    // Ensure we start at the top
    if (window.location.hash === '') {
        window.scrollTo(0, 0);
    }
    
    // Reinitialize after everything is loaded to get correct offsets
    setTimeout(() => {
        if (window.paginatedScrollInstance) {
            window.paginatedScrollInstance.updateSectionOffsets();
            console.log('Sections reinitialized after load');
        }
    }, 200);
});