import { useEffect } from 'react';

export function useVersionCheck() {
    useEffect(() => {
        if (!import.meta.env.PROD) return;

        const currentSrc = Array.from(document.querySelectorAll('script[src]'))
            .map(s => s.src)
            .find(s => s.includes('/assets/index'));

        if (!currentSrc) return;

        const check = async () => {
            try {
                const res = await fetch('/index.html', { cache: 'no-store' });
                const html = await res.text();
                const match = html.match(/src="(\/assets\/index[^"]+\.js)"/);
                const newSrc = match ? window.location.origin + match[1] : null;
                if (newSrc && newSrc !== currentSrc) {
                    window.location.reload();
                }
            } catch {}
        };

        const timer = setInterval(check, 60_000);
        return () => clearInterval(timer);
    }, []);
}
