import React, { useMemo } from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import ProgressRing from "@/components/molecules/ProgressRing";
import { format } from "date-fns";

const CampaignCard = React.memo(({ campaign, onStart, onPause, onStop, onView }) => {
  const viewsProgress = (campaign.currentViews / campaign.targetViews) * 100;
  const subscribersProgress = (campaign.currentSubscribers / campaign.targetSubscribers) * 100;
  const overallProgress = (viewsProgress + subscribersProgress) / 2;

  const getStatusBadge = (status) => {
    const statusConfig = {
      running: { variant: "success", icon: "Play" },
      paused: { variant: "warning", icon: "Pause" },
      stopped: { variant: "error", icon: "Square" },
      completed: { variant: "info", icon: "CheckCircle" },
      pending: { variant: "default", icon: "Clock" }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <ApperIcon name={config.icon} className="w-3 h-3" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toLocaleString();
  };

return (
    <motion.div
      whileHover={{ scale: 1.01, y: -2 }}
      className="bg-surface border border-gray-700 rounded-xl p-4 sm:p-6 hover:border-gray-600 transition-all duration-200 hover:shadow-xl hover:shadow-black/20 touch-manipulation"
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <div className="w-14 h-10 sm:w-16 sm:h-12 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
            {campaign.thumbnailUrl ? (
              <img
                src={campaign.thumbnailUrl}
                alt="Video thumbnail"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ApperIcon name="Play" className="w-5 h-5 sm:w-6 sm:h-6 text-gray-500" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-white truncate text-sm sm:text-base" title={campaign.videoTitle}>
              {campaign.videoTitle}
            </h3>
            <p className="text-xs sm:text-sm text-gray-400 truncate" title={campaign.videoUrl}>
              {campaign.videoUrl}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Created {format(new Date(campaign.createdAt), "MMM d, yyyy")}
            </p>
          </div>
        </div>
        <div className="flex-shrink-0">
          {getStatusBadge(campaign.status)}
        </div>
      </div>

      {/* Progress Overview */}
      <div className="flex items-center justify-center mb-4 sm:mb-6">
        <ProgressRing progress={overallProgress} size={80} strokeWidth={5} className="sm:w-[100px] sm:h-[100px]" />
      </div>

{/* Stats */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="text-center">
          <p className="text-lg sm:text-2xl font-bold font-display text-white">
            {formatNumber(campaign.currentViews)}
          </p>
          <p className="text-xs sm:text-sm text-gray-400">Views</p>
          <div className="w-full bg-gray-700 rounded-full h-1.5 sm:h-2 mt-2">
            <div
              className="bg-gradient-to-r from-primary to-red-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(viewsProgress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {formatNumber(campaign.targetViews)} target
          </p>
        </div>

        <div className="text-center">
          <p className="text-lg sm:text-2xl font-bold font-display text-white">
            {formatNumber(campaign.currentSubscribers)}
          </p>
          <p className="text-xs sm:text-sm text-gray-400">Subscribers</p>
          <div className="w-full bg-gray-700 rounded-full h-1.5 sm:h-2 mt-2">
            <div
              className="bg-gradient-to-r from-accent to-cyan-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(subscribersProgress, 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {formatNumber(campaign.targetSubscribers)} target
          </p>
        </div>
      </div>
{/* Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {campaign.status === "pending" && (
          <Button size="sm" onClick={() => onStart(campaign.Id)} className="flex-1 min-h-[44px]">
            <ApperIcon name="Play" className="w-4 h-4 mr-2" />
            Start
          </Button>
        )}
        
        {campaign.status === "running" && (
          <>
            <Button variant="secondary" size="sm" onClick={() => onPause(campaign.Id)} className="flex-1 min-h-[44px]">
              <ApperIcon name="Pause" className="w-4 h-4 mr-2" />
              Pause
            </Button>
            <Button variant="danger" size="sm" onClick={() => onStop(campaign.Id)} className="min-h-[44px]">
              <ApperIcon name="Square" className="w-4 h-4" />
            </Button>
          </>
        )}
        
        {campaign.status === "paused" && (
          <>
            <Button size="sm" onClick={() => onStart(campaign.Id)} className="flex-1 min-h-[44px]">
              <ApperIcon name="Play" className="w-4 h-4 mr-2" />
              Resume
            </Button>
            <Button variant="danger" size="sm" onClick={() => onStop(campaign.Id)} className="min-h-[44px]">
              <ApperIcon name="Square" className="w-4 h-4" />
            </Button>
          </>
        )}

        <Button variant="ghost" size="sm" onClick={() => onView(campaign.Id)} className="min-h-[44px]">
          <ApperIcon name="Eye" className="w-4 h-4" />
        </Button>
      </div>
    </motion.div>
);
});

CampaignCard.displayName = 'CampaignCard';

export default CampaignCard;