import campaignsData from "@/services/mockData/campaigns.json";

class CampaignService {
  constructor() {
    this.campaigns = [];
    this._cache = new Map();
    this._cacheTimeout = 20000; // 20 seconds
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
    const result = [...this.campaigns];
    this._setCache(cacheKey, result);
    return result;
  }

  async getById(id) {
    await this.delay();
    const campaign = this.campaigns.find(c => c.Id === parseInt(id));
    if (!campaign) {
      throw new Error("Campaign not found");
    }
    return { ...campaign };
  }

async create(campaignData) {
    await this.delay(350);
    
    const newCampaign = {
      Id: Math.max(...this.campaigns.map(c => c.Id), 0) + 1,
      ...campaignData,
      currentViews: 0,
      currentSubscribers: 0,
      status: "pending",
      createdAt: new Date().toISOString(),
      startedAt: null,
      videoTitle: this.extractVideoTitle(campaignData.videoUrl),
      thumbnailUrl: this.generateThumbnailUrl(campaignData.videoUrl)
    };

    this.campaigns.unshift(newCampaign); // Add to beginning for better UX
    this._cache.clear(); // Clear cache after mutation
    return { ...newCampaign };
  }

async update(id, updates) {
    await this.delay(100);
    
    const index = this.campaigns.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Campaign not found");
    }

    this.campaigns[index] = { ...this.campaigns[index], ...updates };
    this._cache.clear(); // Clear cache after mutation
    return { ...this.campaigns[index] };
  }

async delete(id) {
    await this.delay(100);
    
    const index = this.campaigns.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Campaign not found");
    }

    this.campaigns.splice(index, 1);
    this._cache.clear(); // Clear cache after mutation
    return true;
  }

async start(id) {
    await this.delay(100);
    return this.update(id, { 
      status: "running", 
      startedAt: new Date().toISOString() 
    });
  }

  async pause(id) {
    await this.delay(100);
    return this.update(id, { status: "paused" });
  }

  async stop(id) {
    await this.delay(100);
    return this.update(id, { status: "stopped" });
  }

  extractVideoTitle(url) {
    // Simple title extraction based on URL pattern
    const titles = [
      "Amazing Content Creation Tips",
      "How to Grow Your Channel Fast",
      "Ultimate YouTube Strategy Guide",
      "Content Creator Masterclass",
      "Viral Video Secrets Revealed"
    ];
    return titles[Math.floor(Math.random() * titles.length)];
  }

  generateThumbnailUrl(url) {
    const themes = ["tutorial", "guide", "tips", "masterclass", "secrets"];
    const theme = themes[Math.floor(Math.random() * themes.length)];
    return `https://via.placeholder.com/320x180/1a1a1a/ffffff?text=${encodeURIComponent(theme.toUpperCase())}`;
  }
}

export default new CampaignService();