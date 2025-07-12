import activitiesData from "@/services/mockData/activities.json";

class ActivityService {
  constructor() {
    this.activities = [...activitiesData];
    this._cache = new Map();
    this._cacheTimeout = 15000; // 15 seconds
  }

  async delay(ms = 150) {
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

    await this.delay(100);
    // Return activities sorted by timestamp (newest first)
    const result = [...this.activities].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    this._setCache(cacheKey, result);
    return result;
  }

  async getById(id) {
    await this.delay();
    const activity = this.activities.find(a => a.Id === parseInt(id));
    if (!activity) {
      throw new Error("Activity not found");
    }
    return { ...activity };
  }

async create(activityData) {
    await this.delay(80);
    
    const newActivity = {
      Id: Math.max(...this.activities.map(a => a.Id), 0) + 1,
      ...activityData,
      timestamp: new Date().toISOString()
    };

    this.activities.unshift(newActivity); // Add to beginning for chronological order
    this._cache.clear(); // Clear cache after mutation
    return { ...newActivity };
  }

  async getByCampaign(campaignId) {
    await this.delay();
    return this.activities
      .filter(a => a.campaignId === campaignId.toString())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

async getRecent(limit = 10) {
    const cacheKey = this._getCacheKey('getRecent', limit.toString());
    const cached = this._getCache(cacheKey);
    if (cached) return cached;

    await this.delay(80);
    const result = [...this.activities]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
    this._setCache(cacheKey, result);
    return result;
  }

  async logCampaignEvent(campaignId, type, message, severity = "info", metadata = {}) {
    return this.create({
      campaignId: campaignId.toString(),
      type,
      message,
      severity,
      metadata
    });
  }

  async logSystemEvent(type, message, severity = "info", metadata = {}) {
    return this.create({
      campaignId: "",
      type,
      message,
      severity,
      metadata
    });
  }
}

export default new ActivityService();