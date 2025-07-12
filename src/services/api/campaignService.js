import campaignsData from "@/services/mockData/campaigns.json";

class CampaignService {
  constructor() {
    this.campaigns = [];
  }
  async delay(ms = 300) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAll() {
    await this.delay();
    return [...this.campaigns];
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
    await this.delay(500);
    
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

    this.campaigns.push(newCampaign);
    return { ...newCampaign };
  }

  async update(id, updates) {
    await this.delay();
    
    const index = this.campaigns.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Campaign not found");
    }

    this.campaigns[index] = { ...this.campaigns[index], ...updates };
    return { ...this.campaigns[index] };
  }

  async delete(id) {
    await this.delay();
    
    const index = this.campaigns.findIndex(c => c.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Campaign not found");
    }

    this.campaigns.splice(index, 1);
    return true;
  }

  async start(id) {
    await this.delay();
    return this.update(id, { 
      status: "running", 
      startedAt: new Date().toISOString() 
    });
  }

  async pause(id) {
    await this.delay();
    return this.update(id, { status: "paused" });
  }

  async stop(id) {
    await this.delay();
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