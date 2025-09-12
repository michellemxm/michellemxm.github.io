/**
 * Lightbox JavaScript Module
 * Automatically adds lightbox functionality to images with 'lightbox-image' class
 */

class Lightbox {
    constructor() {
        this.overlay = null;
        this.modalImage = null;
        this.closeButton = null;
        this.init();
    }

    init() {
        // Create lightbox overlay structure
        this.createOverlay();
        
        // Add event listeners to all lightbox images
        this.bindEvents();
        
        // Handle dynamic content (images added after page load)
        this.observeNewImages();
    }

    createOverlay() {
        // Create overlay container
        this.overlay = document.createElement('div');
        this.overlay.className = 'lightbox-overlay';
        
        // Create close button
        this.closeButton = document.createElement('span');
        this.closeButton.className = 'lightbox-close';
        this.closeButton.innerHTML = '&times;';
        
        // Create modal image
        this.modalImage = document.createElement('img');
        this.modalImage.className = 'lightbox-modal-image';
        this.modalImage.alt = 'Lightbox image';
        
        // Append elements
        this.overlay.appendChild(this.closeButton);
        this.overlay.appendChild(this.modalImage);
        document.body.appendChild(this.overlay);
        
        // Add overlay event listeners
        this.overlay.addEventListener('click', (e) => {
            if (e.target === this.overlay || e.target === this.closeButton) {
                this.close();
            }
        });
        
        // Prevent modal image clicks from closing lightbox
        this.modalImage.addEventListener('click', (e) => {
            e.stopPropagation();
        });
        
        // ESC key listener
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay.classList.contains('active')) {
                this.close();
            }
        });
    }

    bindEvents() {
        // Add click listeners to existing lightbox images
        const lightboxImages = document.querySelectorAll('.lightbox-image');
        lightboxImages.forEach(img => {
            this.addImageListener(img);
        });
    }

    addImageListener(img) {
        // Avoid duplicate listeners
        if (img.dataset.lightboxBound) return;
        
        img.addEventListener('click', (e) => {
            e.preventDefault();
            this.open(img);
        });
        
        img.dataset.lightboxBound = 'true';
    }

    observeNewImages() {
        // Watch for dynamically added images with lightbox-image class
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) { // Element node
                        // Check if the added node is a lightbox image
                        if (node.classList && node.classList.contains('lightbox-image')) {
                            this.addImageListener(node);
                        }
                        
                        // Check for lightbox images within added nodes
                        const lightboxImages = node.querySelectorAll && node.querySelectorAll('.lightbox-image');
                        if (lightboxImages) {
                            lightboxImages.forEach(img => this.addImageListener(img));
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    open(triggerImage) {
        // Set modal image source and alt text
        this.modalImage.src = triggerImage.src;
        this.modalImage.alt = triggerImage.alt || 'Lightbox image';
        
        // Show overlay
        this.overlay.classList.add('active');
        
        // Prevent body scroll
        document.body.style.overflow = 'hidden';
    }

    close() {
        // Hide overlay
        this.overlay.classList.remove('active');
        
        // Restore body scroll
        document.body.style.overflow = '';
        
        // Clear image source after transition
        setTimeout(() => {
            if (!this.overlay.classList.contains('active')) {
                this.modalImage.src = '';
            }
        }, 300);
    }
}

// Initialize lightbox when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new Lightbox();
});

// Also initialize if script loads after DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new Lightbox();
    });
} else {
    new Lightbox();
}