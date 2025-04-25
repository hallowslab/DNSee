// Replaces the placeholders with real values for formatted strings
export function formatAndCopy() {
    const template = document.getElementById('format').value;
    const output = template
    .replace(/%d/g, domainVal)
    .replace(/%i4/g, ipv4Val)
    .replace(/%i6/g, ipv6Val);
    
    navigator.clipboard.writeText(output).then(() => {
        const btn = document.getElementById('copyFormatted');
        btn.textContent = 'Copied!';
        setTimeout(() => { btn.textContent = 'Copy'; }, 1500);
    });
}