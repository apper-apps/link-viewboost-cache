import proxiesData from "@/services/mockData/proxies.json";

class ProxyService {
  constructor() {
    this.proxies = [];
    this._cache = new Map();
    this._cacheTimeout = 30000; // 30 seconds
  }

  async delay(ms = 200) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  _getCacheKey(method, params = '') {
    return `${method}_${params}`;
  }

  _setCache(key, data) {
    this._cache.set(key, {
      data,
      timestamp: Date.now()
    });
  }

  _getCache(key) {
    const cached = this._cache.get(key);
    if (cached && (Date.now() - cached.timestamp) < this._cacheTimeout) {
      return cached.data;
    }
    this._cache.delete(key);
    return null;
  }

async getAll() {
    const cacheKey = this._getCacheKey('getAll');
    const cached = this._getCache(cacheKey);
    if (cached) return cached;

    await this.delay(150);
    const result = [...this.proxies];
    this._setCache(cacheKey, result);
    return result;
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
    await this.delay(300);
    
    const newProxy = {
      Id: Math.max(...this.proxies.map(p => p.Id), 0) + 1,
      ...proxyData,
      status: "checking",
      lastChecked: new Date().toISOString(),
      responseTime: 0,
      successRate: 0
    };

    this.proxies.unshift(newProxy); // Add to beginning for better UX
    this._cache.clear(); // Clear cache after mutation
    
    // Simulate status check after creation
    setTimeout(() => {
      this.update(newProxy.Id, {
        status: Math.random() > 0.2 ? "online" : "offline",
        responseTime: Math.floor(Math.random() * 200) + 50,
        successRate: Math.random() * 20 + 80
      });
    }, 1500);

    return { ...newProxy };
  }

async update(id, updates) {
    await this.delay(100);
    
    const index = this.proxies.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Proxy not found");
    }

    this.proxies[index] = { 
      ...this.proxies[index], 
      ...updates,
      lastChecked: new Date().toISOString()
    };
    this._cache.clear(); // Clear cache after mutation
    return { ...this.proxies[index] };
  }

async delete(id) {
    await this.delay(100);
    
    const index = this.proxies.findIndex(p => p.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Proxy not found");
    }

    this.proxies.splice(index, 1);
    this._cache.clear(); // Clear cache after mutation
    return true;
  }

async bulkImport(proxyList) {
    await this.delay(500);
    
    const newProxies = [];
    let currentMaxId = Math.max(...this.proxies.map(p => p.Id), 0);
    const batchSize = 50; // Process in batches for better performance

    for (let i = 0; i < proxyList.length; i += batchSize) {
      const batch = proxyList.slice(i, i + batchSize);
      
      for (const proxyString of batch) {
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
          
          this.proxies.unshift(newProxy); // Add to beginning
          newProxies.push(newProxy);
        } catch (error) {
          console.warn(`Failed to parse proxy: ${proxyString}`);
        }
      }
      
      // Small delay between batches to prevent blocking
      if (i + batchSize < proxyList.length) {
        await this.delay(50);
      }
    }

    this._cache.clear(); // Clear cache after bulk operation
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