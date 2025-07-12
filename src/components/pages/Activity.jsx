import React, { useState } from "react";
import { motion } from "framer-motion";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import Badge from "@/components/atoms/Badge";
import SearchBar from "@/components/molecules/SearchBar";
import ApperIcon from "@/components/ApperIcon";
import useActivities from "@/hooks/useActivities";
import { formatDistanceToNow, format } from "date-fns";

const Activity = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [severityFilter, setSeverityFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  const {
    activities,
    loading,
    error,
    loadActivities
  } = useActivities();

  // Filter activities
  const filteredActivities = React.useMemo(() => {
    return activities.filter(activity => {
      const matchesSearch = activity.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          (activity.campaignId && activity.campaignId.includes(searchTerm));
      const matchesSeverity = severityFilter === "all" || activity.severity === severityFilter;
      const matchesType = typeFilter === "all" || activity.type === typeFilter;
      return matchesSearch && matchesSeverity && matchesType;
    });
  }, [activities, searchTerm, severityFilter, typeFilter]);

  const severityCounts = React.useMemo(() => {
    const counts = { all: activities.length };
    activities.forEach(activity => {
      counts[activity.severity] = (counts[activity.severity] || 0) + 1;
    });
    return counts;
  }, [activities]);

  const typeCounts = React.useMemo(() => {
    const counts = { all: activities.length };
    activities.forEach(activity => {
      const mainType = activity.type.split("_")[0];
      counts[mainType] = (counts[mainType] || 0) + 1;
    });
    return counts;
  }, [activities]);

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

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <Error 
        message={error} 
        onRetry={loadActivities}
      />
    );
  }

  const severityOptions = [
    { value: "all", label: "All", count: severityCounts.all },
    { value: "success", label: "Success", count: severityCounts.success || 0 },
    { value: "info", label: "Info", count: severityCounts.info || 0 },
    { value: "warning", label: "Warning", count: severityCounts.warning || 0 },
    { value: "error", label: "Error", count: severityCounts.error || 0 }
  ];

  const typeOptions = [
    { value: "all", label: "All Types", count: typeCounts.all },
    { value: "campaign", label: "Campaign", count: typeCounts.campaign || 0 },
    { value: "proxy", label: "Proxy", count: typeCounts.proxy || 0 },
    { value: "views", label: "Views", count: typeCounts.views || 0 },
    { value: "subscribers", label: "Subscribers", count: typeCounts.subscribers || 0 }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold font-display text-white">Activity Log</h1>
        <p className="text-gray-400 mt-1">Monitor system events and campaign activity</p>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <SearchBar
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search activities..."
          className="max-w-md"
        />
        
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-400 py-2">Severity:</span>
            {severityOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setSeverityFilter(option.value)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                  severityFilter === option.value
                    ? "bg-primary text-white"
                    : "bg-surface text-gray-300 hover:bg-gray-700"
                }`}
              >
                <span>{option.label}</span>
                <Badge variant={severityFilter === option.value ? "default" : "default"}>
                  {option.count}
                </Badge>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-gray-400 py-2">Type:</span>
            {typeOptions.map((option) => (
              <button
                key={option.value}
                onClick={() => setTypeFilter(option.value)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-all duration-200 ${
                  typeFilter === option.value
                    ? "bg-accent text-black"
                    : "bg-surface text-gray-300 hover:bg-gray-700"
                }`}
              >
                <span>{option.label}</span>
                <Badge variant={typeFilter === option.value ? "default" : "default"}>
                  {option.count}
                </Badge>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Activity List */}
      {filteredActivities.length === 0 ? (
        <Empty
          title={searchTerm || severityFilter !== "all" || typeFilter !== "all" ? "No activities found" : "No activity yet"}
          description={
            searchTerm || severityFilter !== "all" || typeFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "Activity will appear here as you use the application"
          }
          icon="Activity"
        />
      ) : (
        <div className="bg-surface border border-gray-700 rounded-xl overflow-hidden">
          <div className="divide-y divide-gray-700 max-h-[800px] overflow-y-auto">
            {filteredActivities.map((activity, index) => (
              <motion.div
                key={activity.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-6 hover:bg-gray-800/30 transition-colors"
              >
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg bg-gray-800 ${getActivityColor(activity.severity)}`}>
                    <ApperIcon name={getActivityIcon(activity.type)} className="w-5 h-5" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-medium">{activity.message}</h3>
                      <Badge variant={getBadgeVariant(activity.severity)}>
                        {activity.severity}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-6 text-sm text-gray-400 mb-2">
                      <span>
                        {formatDistanceToNow(new Date(activity.timestamp), { addSuffix: true })}
                      </span>
                      <span>
                        {format(new Date(activity.timestamp), "MMM d, yyyy 'at' h:mm a")}
                      </span>
                      {activity.campaignId && (
                        <span>Campaign #{activity.campaignId}</span>
                      )}
                    </div>
                    
                    {activity.metadata && Object.keys(activity.metadata).length > 0 && (
                      <div className="bg-gray-800/50 rounded-lg p-3 mt-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                          {Object.entries(activity.metadata).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-gray-400 capitalize">{key.replace(/([A-Z])/g, " $1")}:</span>
                              <span className="text-white font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Activity;