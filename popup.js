const ext = typeof browser !== 'undefined' ? browser : chrome;
const contentArea = document.getElementById('tabContent');
const infoBtn = document.getElementById('tabInfo');
const stackBtn = document.getElementById('tabStack');

const presets = {
    ping: "ping %d",
    trace4: "traceroute %i4",
    trace6: "traceroute %i6",
    dig: "dig +short %d"
};

let domainVal = '', ipv4Val = '', ipv6Val = '';

ext.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const url = new URL(tabs[0].url);
    const domain = url.hostname;
    domainVal = domain
    loadTemplate('info-template')
    // Update domain element
    document.getElementById('domain').textContent = domainVal;
    
    resolveIPs(domainVal, function(addresses) {
        console.log("Addr 4:", addresses["ipv4"]);
        
        document.getElementById('ipv4').textContent = addresses["ipv4"];
        document.getElementById('ipv6').textContent = addresses["ipv6"];
        
        ipv4Val = addresses["ipv4"];
        ipv6Val = addresses["ipv6"];
    });
});

// Functions

// Loads the apropriate template into tab-content
function loadTemplate(templateId) {
    contentArea.innerHTML = ''; // Clear old content
    const tpl = document.getElementById(templateId);
    contentArea.appendChild(tpl.content.cloneNode(true));
}

// Replaces the placeholders with real values for formatted strings
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

// Gets either an IPV4 or IPV6 trough google's DNS, passed trough a callback
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

// Resolves both addresses and returns them in an array
function resolveIPs(domain, callback) {
    let addrArray = {};
    
    let completed = 0;
    
    getIP(domain, "ipv4", function(ipv4) {
        addrArray["ipv4"] = ipv4;
        completed++;
        if (completed === 2) callback(addrArray);
    });
    
    getIP(domain, "ipv6", function(ipv6) {
        addrArray["ipv6"] = ipv6;
        completed++;
        if (completed === 2) callback(addrArray);
    });
}

// For reloading all the event listeners
function bindInfoTabListeners() {
    // For copying the formatted strings
    document.getElementById('copyFormatted').addEventListener('click', formatAndCopy);
    
    // For toggling the formatted string "menu"
    document.getElementById('toggleFormat').addEventListener('click', () => {
        const section = document.getElementById('formatSection');
        const toggle = document.getElementById('toggleFormat');
        const isOpen = section.style.display === 'block';
        
        section.style.display = isOpen ? 'none' : 'block';
        toggle.textContent = isOpen ? 'Customize Format String' : 'Hide Format String';
    });
    // For the preset selection
    let presetSelect = document.getElementById('preset');
    let formatInput = document.getElementById('format');
    presetSelect.addEventListener('change', () => {
        const currentValue = presetSelect.value;
        let presetValue = presets[currentValue]
        console.log("PresetValue: ", presetValue)
        if (presetValue) {
            formatInput.value = presetValue
            .replace(/%d/g, domainVal)
            .replace(/%i4/g, ipv4Val)
            .replace(/%i6/g, ipv6Val);
        }
    });
    
    // For reloading data
    document.getElementById('reloadBtn').addEventListener("click", ()=>{
        document.getElementById("updatedMSG").style = "display: inline-block";
        document.getElementById('ipv4').textContent = "...";
        document.getElementById('ipv6').textContent = "...";
        resolveIPs(domainVal, function(addresses) {
            
            document.getElementById('ipv4').textContent = addresses["ipv4"];
            document.getElementById('ipv6').textContent = addresses["ipv6"];
            
            ipv4Val = addresses["ipv4"];
            ipv6Val = addresses["ipv6"];
        });
        setTimeout(()=>{
            document.getElementById("updatedMSG").style = "display: none";
        }, 1500)
    })
}

// Event Listeners

// For the info tab
infoBtn.addEventListener('click', () => {
    loadTemplate('info-template');
    infoBtn.classList.add('active');
    stackBtn.classList.remove('active');
    
    // Update domain element
    document.getElementById('domain').textContent = domainVal;
    
    resolveIPs(domainVal, function(addresses) {
        console.log("Addr 4:", addresses["ipv4"]);
        
        document.getElementById('ipv4').textContent = addresses["ipv4"];
        document.getElementById('ipv6').textContent = addresses["ipv6"];
        
        ipv4Val = addresses["ipv4"];
        ipv6Val = addresses["ipv6"];
    });
    // Re-bind reloadBtn after DOM is reloaded
    setTimeout(() => {
        bindInfoTabListeners()
    }, 0);
});

// For the stack tab
stackBtn.addEventListener('click', () => {
    loadTemplate('stack-template');
    infoBtn.classList.remove('active');
    stackBtn.classList.add('active');
  
    // Fetch headers when loading this tab
    // fetch(`https://${domainVal}`, { method: 'HEAD', mode: 'no-cors' })
    //   .then(response => {
    //     document.getElementById('server-header').textContent = response.headers.get('Server') || 'Unknown';
    //     document.getElementById('powered-header').textContent = response.headers.get('X-Powered-By') || 'Unknown';
    //   })
    //   .catch(err => {
    //     document.getElementById('server-header').textContent = 'Unavailable';
    //     document.getElementById('powered-header').textContent = 'Unavailable';
    //   });
  });

// For the individual copy buttons of each property
// We don't rebind this since it's attached to document
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

