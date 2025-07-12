import { useState, useEffect } from "react";
import activityService from "@/services/api/activityService";

const useActivities = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadActivities = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await activityService.getAll();
      setActivities(data);
    } catch (err) {
      setError(err.message || "Failed to load activities");
    } finally {
      setLoading(false);
    }
  };

  const loadRecentActivities = async (limit = 10) => {
    try {
      setLoading(true);
      setError("");
      const data = await activityService.getRecent(limit);
      setActivities(data);
    } catch (err) {
      setError(err.message || "Failed to load recent activities");
    } finally {
      setLoading(false);
    }
  };

  const loadCampaignActivities = async (campaignId) => {
    try {
      setLoading(true);
      setError("");
      const data = await activityService.getByCampaign(campaignId);
      setActivities(data);
    } catch (err) {
      setError(err.message || "Failed to load campaign activities");
    } finally {
      setLoading(false);
    }
  };

  const addActivity = async (activityData) => {
    try {
      const newActivity = await activityService.create(activityData);
      setActivities(prev => [newActivity, ...prev]);
      return newActivity;
    } catch (err) {
      throw new Error(err.message || "Failed to add activity");
    }
  };

  useEffect(() => {
    loadRecentActivities();
  }, []);

  return {
    activities,
    loading,
    error,
    loadActivities,
    loadRecentActivities,
    loadCampaignActivities,
    addActivity
  };
};

export default useActivities;