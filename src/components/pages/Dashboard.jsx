import React from "react";
import { motion } from "framer-motion";
import StatCard from "@/components/molecules/StatCard";
import CampaignCard from "@/components/organisms/CampaignCard";
import ActivityFeed from "@/components/organisms/ActivityFeed";
import CreateCampaignModal from "@/components/organisms/CreateCampaignModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import useCampaigns from "@/hooks/useCampaigns";
import useProxies from "@/hooks/useProxies";
import useActivities from "@/hooks/useActivities";
import { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  
  const {
    campaigns,
    loading: campaignsLoading,
    error: campaignsError,
    loadCampaigns,
    createCampaign,
    startCampaign,
    pauseCampaign,
    stopCampaign
  } = useCampaigns();

  const { proxies } = useProxies();
  const { activities } = useActivities();

  // Calculate dashboard stats
  const stats = React.useMemo(() => {
    const totalViews = campaigns.reduce((sum, c) => sum + c.currentViews, 0);
    const totalSubscribers = campaigns.reduce((sum, c) => sum + c.currentSubscribers, 0);
    const activeCampaigns = campaigns.filter(c => c.status === "running").length;
    const onlineProxies = proxies.filter(p => p.status === "online").length;

    return {
      totalViews,
      totalSubscribers,
      activeCampaigns,
      onlineProxies
    };
  }, [campaigns, proxies]);

  const handleCreateCampaign = async (campaignData) => {
    try {
      await createCampaign(campaignData);
      toast.success("Campaign created successfully!");
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const handleStartCampaign = async (id) => {
    try {
      await startCampaign(id);
      toast.success("Campaign started successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handlePauseCampaign = async (id) => {
    try {
      await pauseCampaign(id);
      toast.warning("Campaign paused");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleStopCampaign = async (id) => {
    try {
      await stopCampaign(id);
      toast.info("Campaign stopped");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleViewCampaign = (id) => {
    navigate(`/campaigns/${id}`);
  };

  if (campaignsLoading) {
    return (
      <div className="space-y-8">
        <Loading type="stats" />
        <Loading type="cards" />
      </div>
    );
  }

  if (campaignsError) {
    return (
      <Error 
        message={campaignsError} 
        onRetry={loadCampaigns}
      />
    );
  }

  const activeCampaigns = campaigns.filter(c => ["running", "paused"].includes(c.status));

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold font-display text-white">Dashboard</h1>
          <p className="text-gray-400 mt-1">Monitor your YouTube growth campaigns</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <StatCard
          title="Total Views"
          value={stats.totalViews.toLocaleString()}
          change="+12.5%"
          changeType="positive"
          icon="Eye"
          gradient
        />
        <StatCard
          title="Total Subscribers"
          value={stats.totalSubscribers.toLocaleString()}
          change="+8.3%"
          changeType="positive"
          icon="Users"
          gradient
        />
        <StatCard
          title="Active Campaigns"
          value={stats.activeCampaigns}
          icon="Target"
        />
        <StatCard
          title="Online Proxies"
          value={`${stats.onlineProxies}/${proxies.length}`}
          change={stats.onlineProxies === proxies.length ? "100%" : `${Math.round((stats.onlineProxies / proxies.length) * 100)}%`}
          changeType={stats.onlineProxies === proxies.length ? "positive" : "neutral"}
          icon="Shield"
        />
      </motion.div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Active Campaigns */}
        <div className="xl:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Active Campaigns</h2>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => navigate("/campaigns")}
            >
              View All
              <ApperIcon name="ArrowRight" className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {activeCampaigns.length === 0 ? (
            <Empty
              title="No active campaigns"
              description="Create your first campaign to start growing your YouTube channel"
              actionLabel="Create Campaign"
              onAction={() => setShowCreateModal(true)}
              icon="Target"
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeCampaigns.slice(0, 4).map((campaign, index) => (
                <motion.div
                  key={campaign.Id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <CampaignCard
                    campaign={campaign}
                    onStart={handleStartCampaign}
                    onPause={handlePauseCampaign}
                    onStop={handleStopCampaign}
                    onView={handleViewCampaign}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div>
          <ActivityFeed activities={activities.slice(0, 8)} />
        </div>
      </div>

      {/* Create Campaign Modal */}
      <CreateCampaignModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateCampaign}
        proxies={proxies}
      />
    </div>
  );
};

export default Dashboard;