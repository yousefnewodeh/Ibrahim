
// DOM Elements
const pages = document.querySelectorAll('.page');
const celebrateBtn = document.getElementById('celebrateBtn');
const signLine = document.getElementById('signLine');
const signedText = document.getElementById('signedText');
const floatingContainer = document.getElementById('bg');

// State
let currentPage = 0;
const totalPages = pages.length;

// Initialize Z-Indexes
// Stack order: Page 1 (Top) -> Page N (Bottom)
pages.forEach((page, index) => {
    page.style.zIndex = totalPages - index;
});

// Flip Logic
pages.forEach((page, index) => {
    page.addEventListener('click', () => {
        if (currentPage === index) {
            // Flip Forward
            page.classList.add('flipped');
            currentPage++;
        } else if (currentPage === index + 1) {
            // Flip Backward (Clicked the "back" of the previous page)
            // Wait, dealing with correct "face" clicks
            // Since we stack them, usually you click the top-most visible element.
            // If I click the right side (front of next page?), I want to flip forward?
            // This simple logic assumes we click the page to flip it. 
            // If it's flipped, we click it to flip back.

            page.classList.remove('flipped');
            currentPage--;
        }
    });
});

// Improved Logic:
// The click event bubbles. We need to know if we clicked the "Front" or "Back".
// If "Front", we flip Next.
// If "Back", we flip Prev.

pages.forEach((page, index) => {
    // Remove old listeners (if any, though this is fresh)
    const newPage = page.cloneNode(true);
    page.parentNode.replaceChild(newPage, page);
});

// Re-select fresh nodes
const freshPages = document.querySelectorAll('.page');

freshPages.forEach((page, index) => {
    page.style.zIndex = totalPages - index;

    page.addEventListener('click', function () {
        if (this.classList.contains('flipped')) {
            // Closing (Left -> Right)
            this.classList.remove('flipped');

            // Logic: When going back, z-index needs to be high again for it to be on top of right stack?
            // Actually, CSS 3D handles a lot, but z-index ensures correct layering.
            setTimeout(() => {
                this.style.zIndex = totalPages - index;
            }, 500); // Delay to let it cross the spine

        } else {
            // Opening (Right -> Left)
            this.classList.add('flipped');

            // Logic: It becomes the top of the left stack.
            // Page 1 is bottom of left stack, Page 2 is on top of it.
            this.style.zIndex = index + 1;
        }
    });
});

// Floating Atmosphere (Matches "Mother" vibe)
const emojis = ['⚽', '🏆', '⭐', '🔴', '🔵', '🥇', '🏟️'];
function createFloatingElement() {
    const el = document.createElement('div');
    el.classList.add('floater');
    el.innerText = emojis[Math.floor(Math.random() * emojis.length)];
    el.style.left = Math.random() * 100 + 'vw';
    el.style.fontSize = (Math.random() * 2 + 1) + 'rem';
    el.style.animationDuration = (Math.random() * 10 + 5) + 's';
    floatingContainer.appendChild(el);
    setTimeout(() => el.remove(), 15000);
}
setInterval(createFloatingElement, 500);

// Interaction: Signature
if (signLine) {
    signLine.addEventListener('click', (e) => {
        e.stopPropagation(); // Don't flip page
        signLine.style.display = 'none';
        signedText.classList.remove('hidden');
        confetti({
            particleCount: 50,
            spread: 50,
            origin: { y: 0.7 }
        });
    });
}

// Interaction: Celebration
if (celebrateBtn) {
    celebrateBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        e.preventDefault();
        launchConfetti();
    });
}

function launchConfetti() {
    // JUMPSCARE LOGIC
    const jumpScareDiv = document.getElementById('jumpscare');
    const audio = new Audio('https://www.myinstants.com/media/sounds/screaming-girl-horror.mp3');

    // Play sound immediately
    audio.play().catch(e => console.log('Audio play failed:', e));

    // Vibrate if on mobile
    if (navigator.vibrate) {
        navigator.vibrate([1000, 50, 1000, 50, 1000]);
    }

    // Show Overlay
    if (jumpScareDiv) {
        jumpScareDiv.classList.remove('hidden');

        // Go full screen if possible for maximum effect
        if (document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(e => { });
        }

        // Hide after 3 seconds (The duration of the scare)
        setTimeout(() => {
            jumpScareDiv.classList.add('hidden');

            // Exit fullscreen
            if (document.fullscreenElement) {
                document.exitFullscreen().catch(e => { });
            }

            // Restore/Change Button
            const btn = document.getElementById('celebrateBtn');
            if (btn) {
                btn.innerText = "GOTCHA! 🤣 Happy Birthday!";
                btn.style.background = "#28a745";
            }
        }, 3000);
    }
}
