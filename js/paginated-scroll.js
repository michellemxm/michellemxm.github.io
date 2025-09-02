// Simple scroll management - no paginated scroll interference
class SimpleScrollManager {
    constructor() {
        this.init();
    }

    init() {
        this.updateWorkTabsVisibility();
        this.bindEvents();
    }

    bindEvents() {
        // Only handle work tabs visibility on scroll
        window.addEventListener('scroll', () => {
            this.updateWorkTabsVisibility();
        }, { passive: true });

        // Update on resize
        window.addEventListener('resize', () => {
            this.updateWorkTabsVisibility();
        }, { passive: true });
    }

    updateWorkTabsVisibility() {
        const workTabs = document.querySelector('.work-tabs-fixed');
        if (!workTabs) return;

        const kiroProject = document.querySelector('#project-kiro');
        const moreProject = document.querySelector('#project-more');
        
        if (!kiroProject || !moreProject) return;

        const workSectionStart = kiroProject.offsetTop - window.innerHeight * 0.3;
        const workSectionEnd = moreProject.offsetTop + moreProject.offsetHeight + window.innerHeight * 0.3;
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
    new SimpleScrollManager();
});

// Ensure we start at the top on page load
window.addEventListener('load', () => {
    if (window.location.hash === '') {
        window.scrollTo(0, 0);
    }
});