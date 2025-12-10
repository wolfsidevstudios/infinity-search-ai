
let audioCtx: AudioContext | null = null;

const getContext = () => {
    if (!audioCtx && typeof window !== 'undefined') {
        const Ctx = window.AudioContext || (window as any).webkitAudioContext;
        if (Ctx) {
            audioCtx = new Ctx();
        }
    }
    return audioCtx;
};

export const playSound = (type: 'click' | 'success' | 'on' | 'off' | 'hover' | 'error') => {
    try {
        const ctx = getContext();
        if (!ctx) return;

        // Resume context if suspended (browser policy requires user gesture first)
        if (ctx.state === 'suspended') {
            ctx.resume().catch(() => {});
        }

        const t = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        if (type === 'click') {
            // UI Click: Short, clean sine blip
            osc.type = 'sine';
            osc.frequency.setValueAtTime(600, t);
            osc.frequency.exponentialRampToValueAtTime(300, t + 0.08);
            gain.gain.setValueAtTime(0.15, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);
            osc.start(t);
            osc.stop(t + 0.08);
        } else if (type === 'success') {
            // Success: Pleasant major chord arpeggio
            // Note 1
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.connect(gain1);
            gain1.connect(ctx.destination);
            osc1.type = 'sine';
            osc1.frequency.setValueAtTime(523.25, t); // C5
            gain1.gain.setValueAtTime(0.05, t);
            gain1.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
            osc1.start(t);
            osc1.stop(t + 0.5);

            // Note 2
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.connect(gain2);
            gain2.connect(ctx.destination);
            osc2.type = 'sine';
            osc2.frequency.setValueAtTime(659.25, t + 0.1); // E5
            gain2.gain.setValueAtTime(0.05, t + 0.1);
            gain2.gain.exponentialRampToValueAtTime(0.001, t + 0.6);
            osc2.start(t + 0.1);
            osc2.stop(t + 0.6);
        } else if (type === 'on') {
            // Toggle On: Rising pitch
            osc.type = 'sine';
            osc.frequency.setValueAtTime(300, t);
            osc.frequency.linearRampToValueAtTime(500, t + 0.1);
            gain.gain.setValueAtTime(0.1, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
            osc.start(t);
            osc.stop(t + 0.1);
        } else if (type === 'off') {
            // Toggle Off: Falling pitch
            osc.type = 'sine';
            osc.frequency.setValueAtTime(500, t);
            osc.frequency.linearRampToValueAtTime(300, t + 0.1);
            gain.gain.setValueAtTime(0.1, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.1);
            osc.start(t);
            osc.stop(t + 0.1);
        } else if (type === 'hover') {
            // Hover: Very subtle high tick
            osc.type = 'sine';
            osc.frequency.setValueAtTime(800, t);
            gain.gain.setValueAtTime(0.01, t);
            gain.gain.exponentialRampToValueAtTime(0.001, t + 0.03);
            osc.start(t);
            osc.stop(t + 0.03);
        } else if (type === 'error') {
            // Error: Low buzz/dissonant sound
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(150, t);
            osc.frequency.exponentialRampToValueAtTime(100, t + 0.2);
            gain.gain.setValueAtTime(0.1, t);
            gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
            osc.start(t);
            osc.stop(t + 0.2);
        }
    } catch (e) {
        // Ignore audio errors gracefully
    }
};