/**
 * Univens Smart Cursor System - Consultant Persona Edition
 */

class CursorPhysics {
    constructor(config = {}) {
        this.config = {
            mass: 0.8,
            damping: 18,
            stiffness: 140,
            ...config
        };
        
        this.position = { x: 0, y: 0 };
        this.velocity = { x: 0, y: 0 };
        this.target = { x: 0, y: 0 };
    }

    update(dt) {
        const fx = -this.config.stiffness * (this.position.x - this.target.x) - this.config.damping * this.velocity.x;
        const fy = -this.config.stiffness * (this.position.y - this.target.y) - this.config.damping * this.velocity.y;
        
        const ax = fx / this.config.mass;
        const ay = fy / this.config.mass;
        
        this.velocity.x += ax * dt;
        this.velocity.y += ay * dt;
        
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
        
        return this.position;
    }

    setTarget(x, y) {
        this.target.x = x;
        this.target.y = y;
    }
}

class ContrastEngine {
    constructor(controller) {
        this.controller = controller;
        this.lastLuminance = 0;
        this.threshold = 0.5;
        this.hysteresis = 0.05;
        this.palette = {
            light: { main: '#000000', ring: 'rgba(0, 0, 0, 0.3)' },
            dark: { main: '#FFFFFF', ring: 'rgba(255, 255, 255, 0.3)' }
        };
    }

    update(pos) {
        const el = document.elementFromPoint(pos.x, pos.y);
        if (!el) return;
        const color = this.getRecursiveBackgroundColor(el);
        const luminance = this.calculateLuminance(color);
        let targetTheme = this.lastLuminance > this.threshold ? 'dark' : 'light';
        if (luminance > this.threshold + this.hysteresis) targetTheme = 'light';
        else if (luminance < this.threshold - this.hysteresis) targetTheme = 'dark';
        this.lastLuminance = luminance;
        this.applyTheme(targetTheme);
    }

    getRecursiveBackgroundColor(el) {
        while (el) {
            const style = window.getComputedStyle(el);
            const color = style.backgroundColor;
            if (color && color !== 'rgba(0, 0, 0, 0)' && color !== 'transparent') return color;
            el = el.parentElement;
        }
        return 'rgb(0, 0, 0)';
    }

    calculateLuminance(rgbString) {
        const match = rgbString.match(/\d+/g);
        if (!match) return 0;
        const [r, g, b] = match.map(Number);
        return (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    }

    applyTheme(theme) {
        const colors = this.palette[theme];
        this.controller.container.style.setProperty('--cursor-color', colors.main);
        this.controller.container.style.setProperty('--cursor-ring-color', colors.ring);
    }
}

class CursorController {
    constructor() {
        this.physics = new CursorPhysics();
        this.contrast = new ContrastEngine(this);
        this.lastTime = performance.now();
        this.state = 'IDLE';
        this.lastMoveTime = Date.now();
        
        this.readTimer = null;
        this.inspectTimer = null;
        this.decisionTimer = null;
        
        this.currentSection = null;
        this.promptsSeen = new Set();
        
        // Consultant Persona: Progressive Conversation Map
        this.journeyMap = {
            'hero': { 
                entry: "You're Here", 
                suggest: "Start Here", 
                decision: "Let's Build" 
            },
            'understanding': { 
                entry: "You Know This Feeling", 
                suggest: "See How", 
                decision: "Let's Fix This" 
            },
            'capabilities': { 
                entry: "Find Your Fit", 
                suggest: "Explore", 
                decision: "Build Your Edge" 
            },
            'framework': { 
                entry: "Here's Why", 
                suggest: "Discover", 
                decision: "Trust the Process" 
            },
            'proof': { 
                entry: "See the Results", 
                suggest: "Take a Look", 
                decision: "See the Outcome" 
            },
            'industries': { 
                entry: "See What's Possible", 
                suggest: "Explore", 
                decision: "Find Your Sector" 
            },
            'trust': { 
                entry: "Meet the Team", 
                suggest: "Continue", 
                decision: "Experience Seniority" 
            },
            'action': { 
                entry: "Your Next Step", 
                suggest: "Connect Now", 
                decision: "Let's Talk" 
            }
        };
        
        this.magnetDistance = 80;
        this.magnetStrength = 0.4;

        this.initDOM();
        this.initListeners();
        this.initSectionObserver();
        this.animate();
    }

    initDOM() {
        this.container = document.createElement('div');
        this.container.className = 'cursor-system';
        this.dot = document.createElement('div');
        this.dot.className = 'cursor-dot';
        this.ring = document.createElement('div');
        this.ring.className = 'cursor-ring';
        this.label = document.createElement('div');
        this.label.className = 'cursor-label';
        this.container.appendChild(this.dot);
        this.container.appendChild(this.ring);
        this.container.appendChild(this.label);
        document.body.appendChild(this.container);
    }

    initListeners() {
        window.addEventListener('mousemove', (e) => {
            this.physics.setTarget(e.clientX, e.clientY);
            this.lastMoveTime = Date.now();
            this.resetTimers();
        });
        document.addEventListener('mouseover', (e) => this.handleMouseOver(e));
        document.addEventListener('mouseout', (e) => this.handleMouseOut(e));
        if (window.matchMedia('(pointer: coarse)').matches) this.disable();
    }

    initSectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.currentSection = entry.target.id;
                    this.triggerEntryPrompt(this.currentSection);
                }
            });
        }, { threshold: 0.5 });
        document.querySelectorAll('section').forEach(section => observer.observe(section));
    }

    triggerEntryPrompt(sectionId) {
        const data = this.journeyMap[sectionId];
        if (data && !this.promptsSeen.has(sectionId)) {
            this.setState('IDLE', data.entry);
            this.promptsSeen.add(sectionId);
            setTimeout(() => {
                if (this.state === 'IDLE') this.setState('IDLE');
            }, 2500);
        }
    }

    handleMouseOver(e) {
        const target = e.target;
        const sectionData = this.journeyMap[this.currentSection] || this.journeyMap['hero'];

        // Decision State
        if (target.closest('.btn-protocol') || target.closest('a[href^="mailto"]')) {
            this.setState('DECISION', sectionData.decision);
            this.startDecisionTimer();
            return;
        }

        // Suggest State
        if (target.closest('a') || target.closest('.nav-link')) {
            this.setState('SUGGEST', sectionData.suggest);
            return;
        }

        // Inspect/Observe
        if (target.closest('img')) {
            this.setState('OBSERVE');
            this.startInspectTimer(target.closest('img'));
            return;
        }

        if (target.closest('p') || target.closest('h1, h2, h3, h4')) {
            this.setState('OBSERVE');
            this.startReadTimer();
            return;
        }
    }

    handleMouseOut() {
        this.setState('IDLE');
        this.resetTimers();
    }

    setState(newState, label = '') {
        if (this.state === newState && this.currentLabel === label) return;
        this.state = newState;
        this.currentLabel = label;

        this.container.classList.remove('state-observe', 'state-suggest', 'state-decision');
        if (newState === 'OBSERVE') this.container.classList.add('state-observe');
        if (newState === 'SUGGEST') this.container.classList.add('state-suggest');
        if (newState === 'DECISION') this.container.classList.add('state-decision');

        if (label) {
            this.label.textContent = label;
            this.label.classList.add('visible');
        } else {
            this.label.classList.remove('visible');
        }
    }

    startReadTimer() {
        this.readTimer = setTimeout(() => {
            if (this.state === 'OBSERVE') this.setState('OBSERVE', "Worth Exploring");
        }, 800);
    }

    startInspectTimer(img) {
        this.inspectTimer = setTimeout(() => {
            if (this.state === 'OBSERVE') {
                this.setState('OBSERVE', "See the Outcome");
                img.style.transition = 'transform 300ms ease';
                img.style.transform = 'scale(1.03)';
            }
        }, 600);
    }

    startDecisionTimer() {
        this.decisionTimer = setTimeout(() => {
            if (this.state === 'DECISION') this.setState('DECISION', "Let's Build");
        }, 1000);
    }

    resetTimers() {
        clearTimeout(this.readTimer);
        clearTimeout(this.inspectTimer);
        clearTimeout(this.decisionTimer);
        document.querySelectorAll('img').forEach(img => img.style.transform = '');
    }

    animate() {
        const now = performance.now();
        const dt = (now - this.lastTime) / 1000;
        this.lastTime = now;
        const clampedDt = Math.min(dt, 0.1);
        this.applyMagnetism();
        const pos = this.physics.update(clampedDt);
        if (Date.now() - this.lastMoveTime > 2000) pos.y += 0.15;
        this.contrast.update(pos);
        this.updateDOM(pos);
        requestAnimationFrame(() => this.animate());
    }

    applyMagnetism() {
        const elements = document.querySelectorAll('a, .btn-protocol');
        let closest = null;
        let minDist = this.magnetDistance;
        elements.forEach(el => {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const dist = Math.hypot(centerX - this.physics.target.x, centerY - this.physics.target.y);
            if (dist < minDist) {
                minDist = dist;
                closest = { centerX, centerY };
            }
        });
        if (closest) {
            const pullX = (closest.centerX - this.physics.target.x) * this.magnetStrength;
            const pullY = (closest.centerY - this.physics.target.y) * this.magnetStrength;
            this.physics.target.x += pullX * 0.1;
            this.physics.target.y += pullY * 0.1;
        }
    }

    updateDOM(pos) {
        this.dot.style.transform = `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`;
        this.ring.style.transform = `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`;
        this.label.style.transform = `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y - 20}px))`;
    }

    disable() {
        document.body.style.cursor = 'auto';
        this.container.style.display = 'none';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.univensCursor = new CursorController();
});
