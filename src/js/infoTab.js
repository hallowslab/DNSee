import { resolveIPs } from './dns.js';
import { formatAndCopy } from './utils.js'
// For reloading all the event listeners
export function bindInfoTabListeners() {
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
    document.getElementById('reloadBtn').addEventListener("click", () => {
        document.getElementById("updatedMSG").style = "display: inline-block";
        document.getElementById('ipv4').textContent = "...";
        document.getElementById('ipv6').textContent = "...";
        resolveIPs(domainVal, function (addresses) {

            document.getElementById('ipv4').textContent = addresses["ipv4"];
            document.getElementById('ipv6').textContent = addresses["ipv6"];

            ipv4Val = addresses["ipv4"];
            ipv6Val = addresses["ipv6"];
        });
        setTimeout(() => {
            document.getElementById("updatedMSG").style = "display: none";
        }, 1500)
    })
}