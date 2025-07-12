import activitiesData from "@/services/mockData/activities.json";

class ActivityService {
  constructor() {
    this.activities = [...activitiesData];
  }

  async delay(ms = 200) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    // Return activities sorted by timestamp (newest first)
    return [...this.activities].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
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
    await this.delay();
    
    const newActivity = {
      Id: Math.max(...this.activities.map(a => a.Id), 0) + 1,
      ...activityData,
      timestamp: new Date().toISOString()
    };

    this.activities.push(newActivity);
    return { ...newActivity };
  }

  async getByCampaign(campaignId) {
    await this.delay();
    return this.activities
      .filter(a => a.campaignId === campaignId.toString())
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  }

  async getRecent(limit = 10) {
    await this.delay();
    return [...this.activities]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
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