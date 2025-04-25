const ext = typeof browser !== 'undefined' ? browser : chrome;
const formatInput = document.getElementById('format');
const presetSelect = document.getElementById('preset');

const presets = {
    ping: "ping %d",
    traceroute: "traceroute %d",
    dig: "dig +short %d"
};

let domainVal = '', ipv4Val = '', ipv6Val = '';

ext.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const url = new URL(tabs[0].url);
    const domain = url.hostname;
    document.getElementById('domain').textContent = domain;
    domainVal = domain
    
    getIP(domain, "ipv4", function(ipv4) {
        document.getElementById('ipv4').textContent = ipv4;
        ipv4Val = ipv4
    });
    
    getIP(domain, "ipv6", function(ipv6) {
        document.getElementById('ipv6').textContent = ipv6;
        ipv4Val = ipv6
    });
});

// Functions
function formatAndCopy() {
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

function getIP(domain, type, callback) {
    // Record | Type #
    // A      | 1
    // AAAA   | 28
    // CNAME  | 5
    // MX     | 15
    // TXT    | 16
    const recordType = type === "ipv6" ? "AAAA" : "A";
    fetch(`https://dns.google/resolve?name=${domain}&type=${recordType}`)
    .then(response => response.json())
    .then(data => {
        const answer = data.Answer?.find(a => a.type === (type === "ipv6" ? 28 : 1)); // 1 For IPV6
        callback(answer ? answer.data : 'Not found');
    })
    .catch(err => {
        console.error(`Error fetching ${type}:`, err);
        callback('Error');
    });
}

// Event Listeners

document.getElementById('copyFormatted').addEventListener('click', formatAndCopy);

document.getElementById('toggleFormat').addEventListener('click', () => {
    const section = document.getElementById('formatSection');
    const toggle = document.getElementById('toggleFormat');
    const isOpen = section.style.display === 'block';
  
    section.style.display = isOpen ? 'none' : 'block';
    toggle.textContent = isOpen ? 'Customize Format String' : 'Hide Format String';
});

document.addEventListener('click', function (e) {
    if (e.target.closest('.copy-btn')) {
        const btn = e.target.closest('.copy-btn');
        const id = btn.getAttribute('data-copy-id');
        const text = document.getElementById(id).textContent;
        
        navigator.clipboard.writeText(text).then(() => {
            // Swap to checkmark icon
            btn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
            <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg>
        `;
            
            // Revert after delay
            setTimeout(() => {
                btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
            </svg>
          `;
            }, 1500);
        });
    }
});

presetSelect.addEventListener('change', () => {
    const value = presetSelect.value;
    if (presets[value]) {
      formatInput.value = presets[value];
    }
  });