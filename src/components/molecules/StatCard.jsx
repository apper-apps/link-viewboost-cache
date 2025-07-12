import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const StatCard = ({ 
  title, 
  value, 
  change, 
  changeType = "neutral", 
  icon, 
  gradient = false 
}) => {
  const changeColors = {
    positive: "text-success",
    negative: "text-error",
    neutral: "text-gray-400"
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -2 }}
      className="bg-surface border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all duration-200 hover:shadow-lg hover:shadow-black/20"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg">
          <ApperIcon name={icon} className="w-6 h-6 text-accent" />
        </div>
        {change && (
          <div className={`flex items-center gap-1 ${changeColors[changeType]}`}>
            <ApperIcon 
              name={changeType === "positive" ? "TrendingUp" : changeType === "negative" ? "TrendingDown" : "Minus"} 
              className="w-4 h-4" 
            />
            <span className="text-sm font-medium">{change}</span>
          </div>
        )}
      </div>
      
      <div>
        <p className="text-2xl font-bold font-display mb-1">
          {gradient ? (
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {value}
            </span>
          ) : (
            value
          )}
        </p>
        <p className="text-gray-400 text-sm">{title}</p>
      </div>
    </motion.div>
  );
};

export default StatCard;