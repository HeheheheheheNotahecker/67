// Advanced proxy configuration utilities

function configureBrowserProxy(proxyUrl) {
    if (!proxyUrl) return null;
    
    const proxyType = proxyUrl.startsWith('socks5') ? 'socks5' : 
                    proxyUrl.startsWith('socks4') ? 'socks4' : 'http';
    
    const host = proxyUrl.split('://')[1].split(':')[0];
    const port = parseInt(proxyUrl.split(':').pop());
    
    const config = {
        mode: "fixed_servers",
        rules: {
            singleProxy: {
                scheme: proxyType,
                host: host,
                port: port
            },
            bypassList: ["localhost", "127.0.0.1", "*.local"]
        }
    };
    
    return config;
}

function generatePACScript(proxies) {
    const pacScript = `
        function FindProxyForURL(url, host) {
            // Bypass proxy for local addresses
            if (isPlainHostName(host) || 
                shExpMatch(host, "*.local") || 
                isInNet(host, "10.0.0.0", "255.0.0.0") ||
                isInNet(host, "172.16.0.0", "255.240.0.0") ||
                isInNet(host, "192.168.0.0", "255.255.0.0") ||
                isInNet(host, "127.0.0.0", "255.0.0.0")) {
                return "DIRECT";
            }
            
            // School domains to bypass
            var schoolDomains = [
                "goguardian.com",
                "securly.com",
                "lightspeedsystems.com",
                "*.school",
                "*.k12"
            ];
            
            for (var i = 0; i < schoolDomains.length; i++) {
                if (shExpMatch(host, schoolDomains[i])) {
                    return "DIRECT";
                }
            }
            
            // Rotate through proxies
            var proxies = ${JSON.stringify(proxies)};
            var randomProxy = proxies[Math.floor(Math.random() * proxies.length)];
            
            if (randomProxy.startsWith('socks5')) {
                return "SOCKS5 " + randomProxy.replace('socks5://', '');
            } else if (randomProxy.startsWith('socks4')) {
                return "SOCKS " + randomProxy.replace('socks4://', '');
            } else {
                return "PROXY " + randomProxy.replace('http://', '');
            }
        }
    `;
    
    return pacScript;
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { configureBrowserProxy, generatePACScript };
}
