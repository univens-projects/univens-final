const AdaptiveContrast = require('./adaptive-contrast');

describe('AdaptiveContrast', () => {
    let ac;

    beforeEach(() => {
        // Set up DOM
        document.body.innerHTML = '<div id="bg" style="background-color: rgb(250, 249, 246);"> <div id="target" data-adaptive></div> </div>';
        
        // Mock getComputedStyle for JSDOM (it's limited)
        window.getComputedStyle = (el) => {
            return {
                backgroundColor: el.style.backgroundColor || 'rgba(0, 0, 0, 0)',
                position: el.style.position || 'static'
            };
        };

        // Mock getBoundingClientRect
        Element.prototype.getBoundingClientRect = () => ({
            left: 0, top: 0, width: 10, height: 10
        });

        // Mock elementFromPoint
        document.elementFromPoint = () => null;

        ac = new AdaptiveContrast();
    });

    test('calculateLuminance should return correct value', () => {
        expect(ac.calculateLuminance(255, 255, 255)).toBeCloseTo(1, 2);
        expect(ac.calculateLuminance(0, 0, 0)).toBeCloseTo(0, 2);
    });

    test('getOptimalColor should return dark for light background', () => {
        expect(ac.getOptimalColor(0.8, 'primary')).toBe('var(--adaptive-fg-primary-dark)');
    });

    test('getOptimalColor should return light for dark background', () => {
        expect(ac.getOptimalColor(0.2, 'primary')).toBe('var(--adaptive-fg-primary-light)');
    });

    test('sampleBackground should find parent background color', () => {
        const target = document.getElementById('target');
        const bg = document.getElementById('bg');
        bg.style.backgroundColor = 'rgb(250, 249, 246)';
        
        const color = ac.sampleBackground(target);
        expect(color).toEqual({ r: 250, g: 249, b: 246 });
    });

    test('update should apply correct CSS variables', () => {
        const target = document.getElementById('target');
        ac.adaptiveElements.add(target);
        
        const bg = document.getElementById('bg');
        bg.style.backgroundColor = 'rgb(250, 249, 246)'; // Light
        
        ac.update();
        
        expect(target.style.getPropertyValue('--fg-adaptive-primary')).toBe('var(--adaptive-fg-primary-dark)');
    });
});
