import proxiesData from "@/services/mockData/proxies.json";

class ProxyService {
  constructor() {
    this.proxies = [...proxiesData];
  }

  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.proxies];
  }

  async getById(id) {
    await this.delay();
    const proxy = this.proxies.find(p => p.Id === parseInt(id));
    if (!proxy) {
      throw new Error("Proxy not found");
    }
    return { ...proxy };
  }

  async create(proxyData) {
    await this.delay(400);
    
    const newProxy = {
      Id: Math.max(...this.proxies.map(p => p.Id), 0) + 1,
      ...proxyData,
      status: "checking",
      lastChecked: new Date().toISOString(),
      responseTime: 0,
      successRate: 0
    };

    this.proxies.push(newProxy);
    
    // Simulate status check after creation
    setTimeout(() => {
      this.update(newProxy.Id, {
        status: Math.random() > 0.2 ? "online" : "offline",
        responseTime: Math.floor(Math.random() * 200) + 50,
        successRate: Math.random() * 20 + 80
      });
    }, 2000);

    return { ...newProxy };
  }

  async update(id, updates) {
    await this.delay();
    
    const index = this.proxies.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Proxy not found");
    }

    this.proxies[index] = { 
      ...this.proxies[index], 
      ...updates,
      lastChecked: new Date().toISOString()
    };
    return { ...this.proxies[index] };
  }

  async delete(id) {
    await this.delay();
    
    const index = this.proxies.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Proxy not found");
    }

    this.proxies.splice(index, 1);
    return true;
  }

  async bulkImport(proxyList) {
    await this.delay(800);
    
    const newProxies = [];
    let currentMaxId = Math.max(...this.proxies.map(p => p.Id), 0);

    for (const proxyString of proxyList) {
      try {
        const proxy = this.parseProxyString(proxyString);
        const newProxy = {
          Id: ++currentMaxId,
          ...proxy,
          status: "checking",
          lastChecked: new Date().toISOString(),
          responseTime: 0,
          successRate: 0
        };
        
        this.proxies.push(newProxy);
        newProxies.push(newProxy);
      } catch (error) {
        console.warn(`Failed to parse proxy: ${proxyString}`);
      }
    }

    return newProxies;
  }

  async checkStatus(id) {
    await this.delay(1000);
    
    const proxy = this.proxies.find(p => p.Id === parseInt(id));
    if (!proxy) {
      throw new Error("Proxy not found");
    }

    const isOnline = Math.random() > 0.15; // 85% chance of being online
    const responseTime = isOnline ? Math.floor(Math.random() * 200) + 50 : 0;
    const successRate = isOnline ? Math.random() * 15 + 85 : proxy.successRate;

    return this.update(id, {
      status: isOnline ? "online" : "offline",
      responseTime,
      successRate
    });
  }

  parseProxyString(proxyString) {
    // Support formats: ip:port:username:password or ip:port
    const parts = proxyString.trim().split(":");
    
    if (parts.length < 2) {
      throw new Error("Invalid proxy format");
    }

    return {
      address: parts[0],
      port: parseInt(parts[1]),
      username: parts[2] || "",
      password: parts[3] || ""
    };
  }
}

export default new ProxyService();