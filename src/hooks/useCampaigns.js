import { useState, useEffect } from "react";
import campaignService from "@/services/api/campaignService";

const useCampaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCampaigns = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await campaignService.getAll();
      setCampaigns(data);
    } catch (err) {
      setError(err.message || "Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  const createCampaign = async (campaignData) => {
    try {
      const newCampaign = await campaignService.create(campaignData);
      setCampaigns(prev => [newCampaign, ...prev]);
      return newCampaign;
    } catch (err) {
      throw new Error(err.message || "Failed to create campaign");
    }
  };

  const startCampaign = async (id) => {
    try {
      const updatedCampaign = await campaignService.start(id);
      setCampaigns(prev => 
        prev.map(campaign => 
          campaign.Id === id ? updatedCampaign : campaign
        )
      );
      return updatedCampaign;
    } catch (err) {
      throw new Error(err.message || "Failed to start campaign");
    }
  };

  const pauseCampaign = async (id) => {
    try {
      const updatedCampaign = await campaignService.pause(id);
      setCampaigns(prev => 
        prev.map(campaign => 
          campaign.Id === id ? updatedCampaign : campaign
        )
      );
      return updatedCampaign;
    } catch (err) {
      throw new Error(err.message || "Failed to pause campaign");
    }
  };

  const stopCampaign = async (id) => {
    try {
      const updatedCampaign = await campaignService.stop(id);
      setCampaigns(prev => 
        prev.map(campaign => 
          campaign.Id === id ? updatedCampaign : campaign
        )
      );
      return updatedCampaign;
    } catch (err) {
      throw new Error(err.message || "Failed to stop campaign");
    }
  };

  const deleteCampaign = async (id) => {
    try {
      await campaignService.delete(id);
      setCampaigns(prev => prev.filter(campaign => campaign.Id !== id));
    } catch (err) {
      throw new Error(err.message || "Failed to delete campaign");
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  return {
    campaigns,
    loading,
    error,
    loadCampaigns,
    createCampaign,
    startCampaign,
    pauseCampaign,
    stopCampaign,
    deleteCampaign
  };
};

export default useCampaigns;