import React from "react";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const Header = ({ onMenuClick, title = "Dashboard" }) => {
  return (
    <header className="bg-secondary border-b border-gray-700 sticky top-0 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left side */}
          <div className="flex items-center gap-4">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2 rounded-lg hover:bg-surface/50 transition-colors"
            >
              <ApperIcon name="Menu" className="w-5 h-5 text-gray-400" />
            </button>
            
            <div>
              <h1 className="text-xl font-bold font-display text-white">{title}</h1>
              <p className="text-sm text-gray-400">Manage your YouTube growth campaigns</p>
            </div>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            {/* Status indicator */}
            <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-success/10 border border-success/30 rounded-full">
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-2 h-2 bg-success rounded-full"
              />
              <span className="text-sm text-success font-medium">System Online</span>
            </div>

            {/* Quick actions */}
            <Button variant="ghost" size="sm">
              <ApperIcon name="Bell" className="w-5 h-5" />
            </Button>
            
            <Button variant="ghost" size="sm">
              <ApperIcon name="Help" className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;