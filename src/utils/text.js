export function cleanText(htmlOrText) {
    return (htmlOrText || '')
    .replace(/\n+/g, '\n')
    .replace(/\s{2,}/g, ' ')
    .trim();
    }
    
    
    export function chunkText(text, maxLen = 900) {
    const words = text.split(' ');
    const chunks = [];
    let buf = [];
    for (const w of words) {
    if ([...buf, w].join(' ').length > maxLen) {
    chunks.push(buf.join(' '));
    buf = [w];
    } else {
    buf.push(w);
    }
    }
    if (buf.length) chunks.push(buf.join(' '));
    return chunks.filter(Boolean);
    }
    
    
    export function cosineSim(a, b) {
    const dot = a.reduce((s, x, i) => s + x * b[i], 0);
    const na = Math.sqrt(a.reduce((s, x) => s + x * x, 0));
    const nb = Math.sqrt(b.reduce((s, x) => s + x * x, 0));
    return dot / (na * nb + 1e-8);
    }