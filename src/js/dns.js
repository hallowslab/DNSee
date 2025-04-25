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
export function resolveIPs(domain, callback) {
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
