import React, { useState, useMemo, useCallback } from "react";
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

// Debounced search and optimized filtering
  const filteredCampaigns = useMemo(() => {
    return campaigns.filter(campaign => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        campaign.videoTitle.toLowerCase().includes(searchLower) ||
        campaign.videoUrl.toLowerCase().includes(searchLower);
      const matchesStatus = statusFilter === "all" || campaign.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [campaigns, searchTerm, statusFilter]);

  const statusCounts = useMemo(() => {
    const counts = { all: campaigns.length };
    campaigns.forEach(campaign => {
      counts[campaign.status] = (counts[campaign.status] || 0) + 1;
    });
    return counts;
  }, [campaigns]);

const handleCreateCampaign = useCallback(async (campaignData) => {
    try {
      await createCampaign(campaignData);
      toast.success("Campaign created successfully!");
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  }, [createCampaign]);

  const handleStartCampaign = useCallback(async (id) => {
    try {
      await startCampaign(id);
      toast.success("Campaign started successfully!");
    } catch (error) {
      toast.error(error.message);
    }
  }, [startCampaign]);

  const handlePauseCampaign = useCallback(async (id) => {
    try {
      await pauseCampaign(id);
      toast.warning("Campaign paused");
    } catch (error) {
      toast.error(error.message);
    }
  }, [pauseCampaign]);

  const handleStopCampaign = useCallback(async (id) => {
    try {
      await stopCampaign(id);
      toast.info("Campaign stopped");
    } catch (error) {
      toast.error(error.message);
    }
  }, [stopCampaign]);

  const handleDeleteCampaign = useCallback(async (id) => {
    if (window.confirm("Are you sure you want to delete this campaign?")) {
      try {
        await deleteCampaign(id);
        toast.success("Campaign deleted");
      } catch (error) {
        toast.error(error.message);
      }
    }
  }, [deleteCampaign]);

  const handleViewCampaign = useCallback((id) => {
    navigate(`/campaigns/${id}`);
  }, [navigate]);

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
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-white">Campaigns</h1>
          <p className="text-gray-400 mt-1">Manage your YouTube growth campaigns</p>
        </div>
        <Button onClick={() => setShowCreateModal(true)} className="min-h-[44px]">
          <ApperIcon name="Plus" className="w-5 h-5 mr-2" />
          New Campaign
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col xl:flex-row gap-4">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search campaigns..."
          className="w-full xl:max-w-md"
        />
        
        <div className="flex flex-wrap gap-2 overflow-x-auto pb-2">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setStatusFilter(option.value)}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 whitespace-nowrap min-h-[44px] ${
                statusFilter === option.value
                  ? "bg-primary text-white"
                  : "bg-surface text-gray-300 hover:bg-gray-700"
              }`}
            >
              <span className="text-sm sm:text-base">{option.label}</span>
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
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6"
        >
          {filteredCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign.Id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(index * 0.03, 0.5) }}
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