// Dot Pattern Interactive Functionality

// Generate interactive dot pattern
function generateDotPattern() {
    const dotPattern = document.querySelector('.dot-pattern');
    if (!dotPattern) return;
    
    // Clear existing dots and event listeners
    dotPattern.innerHTML = '';
    dotPattern.replaceWith(dotPattern.cloneNode(false));
    const newDotPattern = document.querySelector('.dot-pattern');
    
    const containerWidth = 600; // Fixed width for dot pattern
    const heroContainer = document.querySelector('.hero .container');
    const containerHeight = heroContainer ? heroContainer.offsetHeight : parseInt(newDotPattern.parentElement.offsetHeight);
    
    const dotSpacing = 16; // 8px dot + 8px spacing
    const dotsPerRow = Math.floor(containerWidth / dotSpacing);
    const dotsPerColumn = Math.floor(containerHeight / dotSpacing);
    
    const dots = [];
    
    for (let row = 0; row < dotsPerColumn; row++) {
        for (let col = 0; col < dotsPerRow; col++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            const x = col * dotSpacing + 4; // 4px offset to center the 8px dot
            const y = row * dotSpacing + 4;
            dot.style.left = `${x}px`;
            dot.style.top = `${y}px`;
            
            // Store position data for distance calculations
            dot.dataset.x = x + 4; // Center of dot (4px radius)
            dot.dataset.y = y + 4;
            
            dots.push(dot);
            newDotPattern.appendChild(dot);
        }
    }
    
    // Add mouse move listener to the dot pattern container
    newDotPattern.addEventListener('mousemove', (e) => handleMouseMove(e, dots));
    newDotPattern.addEventListener('mouseleave', () => handleMouseLeave(dots));
}

// Handle mouse movement over dot pattern
function handleMouseMove(event, allDots) {
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    const radius = 60;
    
    allDots.forEach(dot => {
        const dotX = parseFloat(dot.dataset.x);
        const dotY = parseFloat(dot.dataset.y);
        
        // Calculate distance between mouse cursor and dot center
        const distance = Math.sqrt(Math.pow(dotX - mouseX, 2) + Math.pow(dotY - mouseY, 2));
        
        if (distance <= radius) {
            if (!dot.classList.contains('dot-highlighted')) {
                // Remove fading class and add highlighting transition
                dot.classList.remove('dot-fading');
                dot.classList.add('dot-highlighting');
                dot.classList.add('dot-highlighted');
            }
        } else {
            if (dot.classList.contains('dot-highlighted')) {
                // Remove highlighting class and add fading transition
                dot.classList.remove('dot-highlighting');
                dot.classList.add('dot-fading');
                dot.classList.remove('dot-highlighted');
            }
        }
    });
}

// Handle mouse leaving the dot pattern area
function handleMouseLeave(allDots) {
    allDots.forEach(dot => {
        if (dot.classList.contains('dot-highlighted')) {
            // Remove highlighting class and add fading transition
            dot.classList.remove('dot-highlighting');
            dot.classList.add('dot-fading');
            dot.classList.remove('dot-highlighted');
        }
    });
}

// Responsive dot pattern height calculation
function updateDotPatternHeight() {
    const heroContainer = document.querySelector('.hero .container');
    if (heroContainer) {
        const viewportHeight = window.innerHeight;
        const availableHeight = viewportHeight - 160; // Account for padding
        const maxHeight = 808;
        
        // Calculate height as multiple of 16px
        let targetHeight = Math.min(availableHeight, maxHeight);
        targetHeight = Math.floor(targetHeight / 16) * 16;
        
        // Ensure minimum height of 320px (20 * 16px)
        targetHeight = Math.max(targetHeight, 320);
        
        heroContainer.style.height = `${targetHeight}px`;
        
        // Regenerate dots after height change
        setTimeout(generateDotPattern, 50);
    }
}

// Debounce function for resize events
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Initialize dot pattern on load and resize
document.addEventListener('DOMContentLoaded', () => {
    updateDotPatternHeight();
    generateDotPattern();
});

// Use debounced resize handler for better performance
window.addEventListener('resize', debounce(() => {
    updateDotPatternHeight();
}, 100));