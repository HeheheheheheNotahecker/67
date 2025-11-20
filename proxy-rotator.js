class ProxyRotator {
    constructor() {
        this.proxies = [
            // SOCKS5 Proxies
            "socks5://72.195.34.42:4145",
            "socks5://192.111.137.34:18765",
            "socks5://192.111.135.17:18302",
            "socks5://192.252.211.197:14921",
            "socks5://98.178.72.21:10919",
            "socks5://184.178.172.18:15280",
            "socks5://184.178.172.5:15303",
            "socks5://208.65.90.3:4145",
            "socks5://104.37.135.145:4145",
            "socks5://67.201.33.10:25283",
            "socks5://72.211.46.99:4145",
            "socks5://8.212.161.91:1080",
            
            // SOCKS4 Proxies
            "socks4://174.77.111.196:4145",
            "socks4://174.77.111.197:4145",
            "socks4://184.178.172.14:4145",
            "socks4://98.188.47.132:4145",
            "socks4://184.178.172.3:4145",
            "socks4://184.178.172.11:4145",
            "socks4://184.178.172.17:4145",
            "socks4://192.252.208.67:14287",
            "socks4://192.111.130.2:4145",
            
            // HTTP Proxies
            "http://84.17.47.150:9002",
            "http://84.17.47.149:9002",
            "http://84.17.47.148:9002",
            "http://84.17.47.147:9002",
            "http://84.17.47.146:9002",
            "http://141.147.9.254:443",
            "http://193.176.84.16:9002",
            "http://193.176.84.19:9002",
            "http://65.108.150.56:8443",
            "http://185.236.200.18:9443"
            // Add more proxies from your list as needed
        ];
        
        this.currentIndex = 0;
        this.failedProxies = new Set();
        this.workingProxies = new Set();
    }
    
    getNextProxy() {
        if (this.workingProxies.size > 0) {
            const workingArray = Array.from(this.workingProxies);
            return workingArray[Math.floor(Math.random() * workingArray.length)];
        }
        
        let proxy = this.proxies[this.currentIndex];
        this.currentIndex = (this.currentIndex + 1) % this.proxies.length;
        
        if (this.failedProxies.has(proxy)) {
            return this.getNextProxy();
        }
        
        return proxy;
    }
    
    getRandomProxy() {
        const availableProxies = this.proxies.filter(p => !this.failedProxies.has(p));
        
        if (availableProxies.length === 0) {
            this.failedProxies.clear();
            return this.proxies[Math.floor(Math.random() * this.proxies.length)];
        }
        
        return availableProxies[Math.floor(Math.random() * availableProxies.length)];
    }
    
    markProxyFailed(proxy) {
        this.failedProxies.add(proxy);
        this.workingProxies.delete(proxy);
    }
    
    markProxyWorking(proxy) {
        this.workingProxies.add(proxy);
        this.failedProxies.delete(proxy);
    }
    
    getProxyStats() {
        return {
            total: this.proxies.length,
            working: this.workingProxies.size,
            failed: this.failedProxies.size
        };
    }
}

// Global instance
window.proxyRotator = new ProxyRotator();
