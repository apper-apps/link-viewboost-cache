import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import CampaignCard from "@/components/organisms/CampaignCard";
import CreateCampaignModal from "@/components/organisms/CreateCampaignModal";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import useCampaigns from "@/hooks/useCampaigns";
import useProxies from "@/hooks/useProxies";
import { toast } from "react-toastify";

const Campaigns = () => {
  const navigate = useNavigate();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  
  const {
    campaigns,
    loading,
    error,
    loadCampaigns,
    createCampaign,
    startCampaign,
    pauseCampaign,
    stopCampaign,
    deleteCampaign
  } = useCampaigns();

  const { proxies } = useProxies();

  // Filter campaigns
  const filteredCampaigns = React.useMemo(() => {
    return campaigns.filter(campaign => {
      const matchesSearch = campaign.videoTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          campaign.videoUrl.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [campaigns, searchTerm, statusFilter]);

  const statusCounts = React.useMemo(() => {
    const counts = { all: campaigns.length };
    campaigns.forEach(campaign => {
      counts[campaign.status] = (counts[campaign.status] || 0) + 1;
    });
    return counts;
  }, [campaigns]);

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

  const handleDeleteCampaign = async (id) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      try {
        await deleteCampaign(id);
        toast.success("Campaign deleted");
      } catch (error) {
        toast.error(error.message);
      }
    }
  };

  const handleViewCampaign = (id) => {
    navigate(`/campaigns/${id}`);
  };

  if (loading) {
    return <Loading type="cards" />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadCampaigns}
      />
    );
  }

  const statusOptions = [
    { value: "all", label: "All Campaigns", count: statusCounts.all },
    { value: "running", label: "Running", count: statusCounts.running || 0 },
    { value: "paused", label: "Paused", count: statusCounts.paused || 0 },
    { value: "pending", label: "Pending", count: statusCounts.pending || 0 },
    { value: "completed", label: "Completed", count: statusCounts.completed || 0 },
    { value: "stopped", label: "Stopped", count: statusCounts.stopped || 0 }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-white">Campaigns</h1>
          <p className="text-gray-400 mt-1">Manage your YouTube growth campaigns</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)}>
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search campaigns..."
          className="lg:max-w-md"
        />
        
        <div className="flex flex-wrap gap-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                statusFilter === option.value
                  ? "bg-primary text-white"
                  : "bg-surface text-gray-300 hover:bg-gray-700"
              }`}
            >
              <span>{option.label}</span>
              <Badge variant={statusFilter === option.value ? "default" : "default"}>
                {option.count}
              </Badge>
            </button>
          ))}
        </div>
      </div>

      {/* Campaigns Grid */}
      {filteredCampaigns.length === 0 ? (
        <Empty
          title={searchTerm || statusFilter !== "all" ? "No campaigns found" : "No campaigns yet"}
          description={
            searchTerm || statusFilter !== "all" 
              ? "Try adjusting your search or filter criteria"
              : "Create your first campaign to start growing your YouTube channel"
          }
          actionLabel="Create Campaign"
          onAction={() => setShowCreateModal(true)}
          icon="Target"
        />
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
        >
          {filteredCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <CampaignCard
                campaign={campaign}
                onStart={handleStartCampaign}
                onPause={handlePauseCampaign}
                onStop={handleStopCampaign}
                onView={handleViewCampaign}
                onDelete={handleDeleteCampaign}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

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

export default Campaigns;