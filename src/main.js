
import './styles.css'
import { state } from './js/state.js';
import { bindInfoTabListeners } from './js/infoTab.js';
import { loadTemplate } from './js/template.js';
import { resolveIPs } from './js/dns.js';

const ext = typeof browser !== 'undefined' ? browser : chrome;
const infoBtn = document.getElementById('tabInfo');
const stackBtn = document.getElementById('tabStack');

ext.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    const url = new URL(tabs[0].url);
    const domain = url.hostname;
    state.domainVal = domain;

    loadTemplate('info-template'); // from template.js
    document.getElementById('domain').textContent = state.domainVal;

    resolveIPs(state.domainVal, function (addresses) {
        document.getElementById('ipv4').textContent = addresses["ipv4"];
        document.getElementById('ipv6').textContent = addresses["ipv6"];

        state.ipv4Val = addresses["ipv4"];
        state.ipv6Val = addresses["ipv6"];
    });

    bindInfoTabListeners(); // from infoTab.js
});

// For the info tab
infoBtn.addEventListener('click', () => {
    loadTemplate('info-template');
    infoBtn.classList.add('active');
    stackBtn.classList.remove('active');

    // Update domain element
    document.getElementById('domain').textContent = state.domainVal;

    resolveIPs(state.domainVal, function (addresses) {
        console.log("Addr 4:", addresses["ipv4"]);

        document.getElementById('ipv4').textContent = addresses["ipv4"];
        document.getElementById('ipv6').textContent = addresses["ipv6"];

        state.ipv4Val = addresses["ipv4"];
        state.ipv6Val = addresses["ipv6"];
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
    // fetch(`https://${state.domainVal}`, { method: 'HEAD', mode: 'no-cors' })
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
    console.log("Clicked")
    console.log("Target: ", e.target)
    console.log("Closest: ", e.target.closest)
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