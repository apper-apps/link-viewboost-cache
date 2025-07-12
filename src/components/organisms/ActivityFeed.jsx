import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { formatDistanceToNow } from "date-fns";

const ActivityFeed = ({ activities = [] }) => {
  const getActivityIcon = (type) => {
    const icons = {
      campaign_created: "Plus",
      campaign_started: "Play",
      campaign_paused: "Pause",
      campaign_stopped: "Square",
      campaign_completed: "CheckCircle",
      proxy_added: "Shield",
      proxy_failed: "AlertTriangle",
      views_milestone: "Eye",
      subscribers_milestone: "Users",
      error: "AlertCircle"
    };
    return icons[type] || "Activity";
  };

  const getActivityColor = (severity) => {
    const colors = {
      info: "text-info",
      success: "text-success",
      warning: "text-warning",
      error: "text-error"
    };
    return colors[severity] || "text-gray-400";
  };

  const getBadgeVariant = (severity) => {
    const variants = {
      info: "info",
      success: "success",
      warning: "warning",
      error: "error"
    };
    return variants[severity] || "default";
  };

  return (
    <div className="bg-surface border border-gray-700 rounded-xl">
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-info/20 to-accent/20 rounded-lg flex items-center justify-center">
            <ApperIcon name="Activity" className="w-5 h-5 text-info" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            <p className="text-sm text-gray-400">Latest system events and updates</p>
          </div>
        </div>
      </div>

      <div className="p-6">
        {activities.length === 0 ? (
          <div className="text-center py-8">
            <ApperIcon name="Clock" className="w-12 h-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No recent activity</p>
            <p className="text-sm text-gray-500">Activity will appear here as campaigns run</p>
          </div>
        ) : (
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {activities.map((activity, index) => (
              <motion.div
                key={activity.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-800/50 transition-colors"
              >
                <div className={`p-2 rounded-lg bg-gray-800 ${getActivityColor(activity.severity)}`}>
                  <ApperIcon name={getActivityIcon(activity.type)} className="w-4 h-4" />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="text-sm font-medium text-white truncate">
                      {activity.message}
                    </p>
                    <Badge variant={getBadgeVariant(activity.severity)} className="flex-shrink-0">
                      {activity.severity}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center gap-4 text-xs text-gray-500">
                    <span>
                      {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                    </span>
                    {activity.campaignId && (
                      <span>Campaign #{activity.campaignId}</span>
                    )}
                  </div>
                  
                  {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                    <div className="mt-2 text-xs text-gray-400">
                      {Object.entries(activity.metadata).map(([key, value]) => (
                        <span key={key} className="mr-3">
                          {key}: {value}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ActivityFeed;