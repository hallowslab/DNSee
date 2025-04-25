
import { bindInfoTabListeners } from './infoTab.js';
import { loadTemplate } from './template.js';
import { resolveIPs } from './dns.js';

const ext = typeof browser !== 'undefined' ? browser : chrome;
const infoBtn = document.getElementById('tabInfo');
const stackBtn = document.getElementById('tabStack');

let domainVal = '', ipv4Val = '', ipv6Val = '';

ext.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    const url = new URL(tabs[0].url);
    const domain = url.hostname;
    domainVal = domain;

    loadTemplate('info-template'); // from template.js
    document.getElementById('domain').textContent = domainVal;

    resolveIPs(domainVal, function(addresses) {
        document.getElementById('ipv4').textContent = addresses["ipv4"];
        document.getElementById('ipv6').textContent = addresses["ipv6"];

        ipv4Val = addresses["ipv4"];
        ipv6Val = addresses["ipv6"];
    });

    bindInfoTabListeners(); // from infoTab.js
});

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