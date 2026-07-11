/**
 * Univens Adaptive Contrast System (v1.0)
 * Dynamically adapts foreground colors based on background luminance.
 */
class AdaptiveContrast {
    constructor() {
        this.adaptiveElements = new Set();
        this.init();
    }

    init() {
        this.observeElements();
        this.startLoop();
        
        if (typeof window !== 'undefined') {
            window.addEventListener('resize', () => this.refreshElements());
        }
    }

    observeElements() {
        if (typeof document !== 'undefined') {
            document.querySelectorAll('[data-adaptive]').forEach(el => {
                this.adaptiveElements.add(el);
            });
        }
    }

    refreshElements() {
        this.adaptiveElements.clear();
        this.observeElements();
    }

    /**
     * Calculates relative luminance using WCAG formula
     * L = 0.2126 * R + 0.7152 * G + 0.0722 * B
     */
    calculateLuminance(r, g, b) {
        return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    }

    /**
     * Determines the optimal foreground color based on luminance threshold
     */
    getOptimalColor(luminance, type = 'primary') {
        const isLightBackground = luminance > 0.5;
        
        const map = {
            primary: {
                light: 'var(--adaptive-fg-primary-dark)',
                dark: 'var(--adaptive-fg-primary-light)'
            },
            secondary: {
                light: 'var(--adaptive-fg-secondary-dark)',
                dark: 'var(--adaptive-fg-secondary-light)'
            },
            accent: {
                light: 'var(--adaptive-fg-accent-dark)',
                dark: 'var(--adaptive-fg-accent-light)'
            }
        };

        const choice = map[type] || map.primary;
        return isLightBackground ? choice.light : choice.dark;
    }

    /**
     * Samples the background color.
     * For fixed/absolute elements, it samples the element beneath it in the viewport.
     * Otherwise, it traverses up the DOM.
     */
    sampleBackground(el) {
        if (typeof window === 'undefined' || !el) return { r: 250, g: 249, b: 246 };

        const rect = el.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const style = window.getComputedStyle(el);
        if (style.position === 'fixed' || style.position === 'absolute') {
            if (typeof document.elementFromPoint === 'function') {
                const elementBelow = document.elementFromPoint(centerX, centerY);
                if (elementBelow && elementBelow !== el) {
                    const belowStyle = window.getComputedStyle(elementBelow);
                    const bg = belowStyle.backgroundColor;
                    if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
                        const match = bg.match(/\d+/g);
                        if (match && match.length >= 3) {
                            return {
                                r: parseInt(match[0]),
                                g: parseInt(match[1]),
                                b: parseInt(match[2])
                            };
                        }
                    }
                }
            }
        }

        let parent = el.parentElement;
        while (parent) {
            const pStyle = window.getComputedStyle(parent);
            const bg = pStyle.backgroundColor;
            if (bg !== 'rgba(0, 0, 0, 0)' && bg !== 'transparent') {
                const match = bg.match(/\d+/g);
                if (match && match.length >= 3) {
                    return {
                        r: parseInt(match[0]),
                        g: parseInt(match[1]),
                        b: parseInt(match[2])
                    };
                }
            }
            parent = parent.parentElement;
        }
        
        return { r: 250, g: 249, b: 246 }; // Fallback to Layer 0 (Ivory)
    }

    update() {
        this.adaptiveElements.forEach(el => {
            const color = this.sampleBackground(el);
            const luminance = this.calculateLuminance(color.r, color.g, color.b);
            
            el.style.setProperty('--fg-adaptive-primary', this.getOptimalColor(luminance, 'primary'));
            el.style.setProperty('--fg-adaptive-secondary', this.getOptimalColor(luminance, 'secondary'));
            el.style.setProperty('--fg-adaptive-accent', this.getOptimalColor(luminance, 'accent'));
            
            const isLight = luminance > 0.5;
            el.style.setProperty('--fg-adaptive-inverse', isLight ? 'var(--color-ivory)' : 'var(--color-graphite)');

            if (el.tagName === 'NAV') {
                const isLight = luminance > 0.5;
                el.style.setProperty('--nav-bg-adaptive', isLight ? 'rgba(18, 20, 23, 0.85)' : 'rgba(250, 249, 246, 0.85)');
                el.style.setProperty('--nav-border-adaptive', isLight ? 'rgba(18, 20, 23, 0.1)' : 'var(--text-l5)');
            }
        });
    }

    startLoop() {
        if (typeof window !== 'undefined' && typeof window.requestAnimationFrame === 'function') {
            const loop = () => {
                this.update();
                window.requestAnimationFrame(loop);
            };
            window.requestAnimationFrame(loop);
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdaptiveContrast;
}

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        window.univensContrast = new AdaptiveContrast();
    });
}
