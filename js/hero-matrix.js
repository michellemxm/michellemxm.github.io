/**
 * Animated character-grid hero.
 *
 * Fills the hero with a grid of flipping monospace glyphs. Cells that sit on a
 * line of intro copy progressively "lock" into their real character, so the
 * text resolves out of the noise. Moving the pointer speeds up nearby glyphs
 * and tints them with the brand accent.
 *
 * The canvas is decorative (aria-hidden); the same copy lives in
 * .hero-matrix-content for assistive tech and search engines.
 */
(function () {
    'use strict';

    const canvas = document.getElementById('hero-matrix-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    /* ---------- Configuration ---------- */

    const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()[]{}<>/\\|=+-~;:.,?_';
    const REVEAL_MS = 5000; // window over which the body copy finishes locking
    const TITLE_REVEAL_MS = 2000; // the headline resolves first

    const rootStyles = getComputedStyle(document.documentElement);
    const readVar = (name, fallback) => (rootStyles.getPropertyValue(name) || '').trim() || fallback;

    const ACCENT = readVar('--primary-color', '#FB008B');
    const BG = readVar('--bg-primary', '#0A090B');
    const TEXT = '#FFFFFF';
    const NOISE_DIM = '#2C2F36';
    const NOISE_BRIGHT = '#4A4E56';
    const NOISE_HOVER = '#B8BDC6';

    // Cell geometry at the desktop scale; scaled down on narrow viewports.
    const CELL_W_DESKTOP = 15;
    const CELL_RATIO = 1.6; // cell height / cell width
    const FONT_RATIO = 0.87; // glyph size / cell width
    const HOVER_RADIUS = 80; // px

    const LINES = [
        {
            text: "Hi, I'm Michelle Ma",
            big: true,
            color: TEXT,
            accentFrom: 8, // "Michelle Ma" picks up the accent colour
            accentColor: ACCENT
        },
        { text: 'Design lead of Kiro Agentic IDE @ AWS based in Seattle WA USA', color: TEXT },
        { text: 'Previously worked with Amazon Alexa, Google, and Shimo.im', color: TEXT },
        { text: 'Georgia Tech alum (labs: Ubicomp, SonLab). Go Jackets!', color: TEXT },
        {
            text: 'What I do: Agentic Experience, Generative AI, Ubiquitous Computing, Multimodality UX',
            color: TEXT
        }
    ];

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    /* ---------- State ---------- */

    let cellW = CELL_W_DESKTOP;
    let cellH = Math.round(CELL_W_DESKTOP * CELL_RATIO);
    let fontSmall = 13;
    let fontBig = 34;
    let cols = 0;
    let rows = 0;
    let cells = [];
    let mouseX = -9999;
    let mouseY = -9999;
    let rafId = null;
    let visible = true;

    const t0 = performance.now();

    /* ---------- Helpers ---------- */

    const randomChar = () => CHARS[(Math.random() * CHARS.length) | 0];

    const noiseColor = () => (Math.random() < 0.06 ? NOISE_BRIGHT : NOISE_DIM);

    function wrap(text, max) {
        const out = [];
        let line = '';
        for (const word of text.split(' ')) {
            if (line && line.length + 1 + word.length > max) {
                out.push(line);
                line = word;
            } else {
                line = line ? line + ' ' + word : word;
            }
        }
        if (line) out.push(line);
        return out;
    }

    function lockDelay(isBig) {
        if (reduceMotion) return 0;
        return isBig
            ? 300 + Math.random() * (TITLE_REVEAL_MS - 300)
            : 500 + Math.random() * (REVEAL_MS - 500);
    }

    /**
     * Lay the headline out at 2x. One line when it fits, otherwise split at the
     * accent boundary so the break reads as intentional. Falls back to body
     * size only when even the longer half cannot fit.
     */
    function bigBlocks(line, maxBigChars) {
        const accentAt = line.accentFrom !== undefined ? line.accentFrom : line.text.length;

        const block = (text, offset, big) => ({
            height: big ? 2 : 1,
            big: big,
            chars: text.split(''),
            // accentFrom is relative to this block's own characters
            accentFrom: Math.max(0, accentAt - offset),
            accentColor: line.accentColor,
            color: line.color
        });

        if (line.text.length <= maxBigChars) {
            return [block(line.text, 0, true)];
        }

        const head = line.text.slice(0, accentAt).trim();
        const tail = line.text.slice(accentAt).trim();
        if (head && tail && head.length <= maxBigChars && tail.length <= maxBigChars) {
            return [block(head, 0, true), block(tail, accentAt, true)];
        }

        return [block(line.text, 0, false)];
    }

    /* ---------- Layout ---------- */

    function setup() {
        const width = canvas.clientWidth;
        const height = canvas.clientHeight;
        if (!width || !height) return;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = Math.round(width * dpr);
        canvas.height = Math.round(height * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        ctx.textBaseline = 'middle';
        ctx.textAlign = 'center';

        cellW = width < 640 ? 10 : CELL_W_DESKTOP;
        cellH = Math.round(cellW * CELL_RATIO);
        fontSmall = Math.max(8, Math.round(cellW * FONT_RATIO));
        fontBig = Math.round(cellW * 2 * 1.13);

        cols = Math.ceil(width / cellW);
        rows = Math.ceil(height / cellH);

        const now = performance.now();
        cells = new Array(rows * cols);
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                cells[r * cols + c] = {
                    c: c,
                    r: r,
                    glyph: randomChar(),
                    color: noiseColor(),
                    next: now + Math.random() * 1200,
                    target: null,
                    targetColor: TEXT,
                    big: false,
                    cover: null,
                    lockAt: 0,
                    locked: false
                };
            }
        }

        const at = (c, r) =>
            c >= 0 && c < cols && r >= 0 && r < rows ? cells[r * cols + c] : null;

        // A big glyph occupies 2x2 cells. Prefer the headline on one 2x line;
        // if the grid is too narrow, break it at the accent boundary
        // ("Hi, I'm" / "Michelle Ma") rather than dropping to body size.
        const maxLineChars = Math.max(20, Math.min(cols - 6, 88));
        const maxBigChars = Math.floor((cols - 4) / 2);

        const blocks = [];
        for (const line of LINES) {
            if (line.big) {
                blocks.push.apply(blocks, bigBlocks(line, maxBigChars));
            } else {
                for (const wrapped of wrap(line.text, maxLineChars)) {
                    blocks.push({ height: 1, big: false, chars: wrapped.split(''), color: line.color });
                }
            }
        }

        const totalRows =
            blocks.reduce((sum, b) => sum + b.height, 0) + (blocks.length - 1);
        let row = Math.max(1, Math.floor((rows - totalRows) / 2));

        for (const block of blocks) {
            const unit = block.big ? 2 : 1;
            const startCol = Math.max(0, Math.floor((cols - block.chars.length * unit) / 2));

            block.chars.forEach((glyph, i) => {
                const anchor = at(startCol + i * unit, row);
                if (!anchor) return;

                anchor.target = glyph === ' ' ? '' : glyph;
                anchor.big = block.big;
                anchor.targetColor =
                    block.accentFrom !== undefined && i >= block.accentFrom
                        ? block.accentColor
                        : block.color;
                anchor.lockAt = t0 + lockDelay(block.big);

                if (block.big) {
                    // Mark the three cells the 2x2 glyph paints over.
                    const offsets = [[1, 0], [0, 1], [1, 1]];
                    for (const [dc, dr] of offsets) {
                        const covered = at(startCol + i * unit + dc, row + dr);
                        if (covered) covered.cover = anchor;
                    }
                }
            });

            row += block.height + 1;
        }

        ctx.fillStyle = BG;
        ctx.fillRect(0, 0, width, height);

        if (reduceMotion) {
            // No flipping: paint the resolved copy over a static field of noise.
            for (const cell of cells) {
                if (cell.target !== null) cell.locked = true;
                else if (cell.cover) {
                    cell.locked = true;
                    cell.target = '';
                    cell.targetColor = BG;
                }
                drawCell(cell);
            }
        } else {
            for (const cell of cells) drawCell(cell);
        }
    }

    /* ---------- Painting ---------- */

    function drawCell(cell) {
        const w = cell.big && cell.locked ? cellW * 2 : cellW;
        const h = cell.big && cell.locked ? cellH * 2 : cellH;
        const x = cell.c * cellW;
        const y = cell.r * cellH;

        ctx.fillStyle = BG;
        ctx.fillRect(x, y, w, h);

        const glyph = cell.locked ? cell.target : cell.glyph;
        if (!glyph) return;

        ctx.font =
            (cell.big && cell.locked ? '600 ' + fontBig + 'px' : fontSmall + 'px') +
            " 'IBM Plex Mono', 'Courier New', monospace";
        ctx.fillStyle = cell.locked ? cell.targetColor : cell.color;
        ctx.fillText(glyph, x + w / 2, y + h / 2);
    }

    function frame(now) {
        rafId = requestAnimationFrame(frame);
        if (!visible) return;

        for (let i = 0; i < cells.length; i++) {
            const cell = cells[i];
            if (cell.locked) continue;

            if (cell.cover) {
                // Keep flipping noise until the owning big glyph locks, then clear.
                if (cell.cover.locked) {
                    cell.locked = true;
                    cell.target = '';
                    cell.targetColor = BG;
                    continue;
                }
            } else if (cell.target !== null && now >= cell.lockAt) {
                cell.locked = true;
                drawCell(cell);
                continue;
            }

            if (now >= cell.next) {
                const px = cell.c * cellW + cellW / 2;
                const py = cell.r * cellH + cellH / 2;
                const dx = px - mouseX;
                const dy = py - mouseY;
                const near = dx * dx + dy * dy < HOVER_RADIUS * HOVER_RADIUS;

                cell.glyph = randomChar();
                cell.color = near
                    ? Math.random() < 0.3
                        ? ACCENT
                        : NOISE_HOVER
                    : noiseColor();
                cell.next = now + (near ? 240 + Math.random() * 240 : 1200 + Math.random() * 5500);
                drawCell(cell);
            }
        }
    }

    /* ---------- Wiring ---------- */

    let resizeTimer = null;
    function onResize() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(setup, 150);
    }

    function onPointerMove(event) {
        const rect = canvas.getBoundingClientRect();
        mouseX = event.clientX - rect.left;
        mouseY = event.clientY - rect.top;
    }

    function onPointerLeave() {
        mouseX = -9999;
        mouseY = -9999;
    }

    window.addEventListener('resize', onResize);

    if (!reduceMotion) {
        canvas.addEventListener('pointermove', onPointerMove);
        canvas.addEventListener('pointerleave', onPointerLeave);
    }

    setup();

    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(setup);
    }

    if (!reduceMotion) {
        // Stop burning frames once the hero scrolls out of view.
        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver(
                (entries) => {
                    visible = entries[0].isIntersecting;
                },
                { threshold: 0 }
            );
            observer.observe(canvas);
        }
        rafId = requestAnimationFrame(frame);
    }

    document.addEventListener('visibilitychange', function () {
        if (reduceMotion) return;
        if (document.hidden) {
            if (rafId !== null) {
                cancelAnimationFrame(rafId);
                rafId = null;
            }
        } else if (rafId === null) {
            rafId = requestAnimationFrame(frame);
        }
    });
})();
