import {state} from './state.js'

// Replaces the placeholders with real values for formatted strings
export function formatAndCopy() {
    const template = document.getElementById('format').value;
    const output = template
    .replace(/%d/g, state.domainVal)
    .replace(/%i4/g, state.ipv4Val)
    .replace(/%i6/g, state.ipv6Val);
    
    navigator.clipboard.writeText(output).then(() => {
        const btn = document.getElementById('copyFormatted');
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 1500);
    });
}