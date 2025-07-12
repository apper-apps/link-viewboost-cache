import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();

  const navigation = [
    { name: "Dashboard", href: "/", icon: "LayoutDashboard" },
    { name: "Campaigns", href: "/campaigns", icon: "Target" },
    { name: "Proxies", href: "/proxies", icon: "Shield" },
    { name: "Settings", href: "/settings", icon: "Settings" },
    { name: "Activity Log", href: "/activity", icon: "Activity" }
  ];

  const NavItem = ({ item }) => {
    const isActive = location.pathname === item.href;
    
    return (
      <NavLink
        to={item.href}
        onClick={onClose}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
          isActive
            ? "bg-gradient-to-r from-primary/20 to-accent/20 text-white border border-primary/30"
            : "text-gray-400 hover:text-white hover:bg-surface/50"
        }`}
      >
        <ApperIcon
          name={item.icon}
          className={`w-5 h-5 transition-colors duration-200 ${
            isActive ? "text-accent" : "group-hover:text-accent"
          }`}
        />
        <span className="font-medium">{item.name}</span>
        {isActive && (
          <motion.div
            layoutId="activeIndicator"
            className="w-1 h-6 bg-gradient-to-b from-primary to-accent rounded-full ml-auto"
          />
        )}
      </NavLink>
    );
  };

  // Desktop Sidebar
  const DesktopSidebar = () => (
    <div className="hidden lg:flex lg:flex-col lg:w-64 lg:bg-secondary lg:border-r lg:border-gray-700">
      <div className="flex flex-col h-full">
        {/* Logo */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <ApperIcon name="Play" className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold font-display text-white">ViewBoost</h1>
              <p className="text-sm text-gray-400">Pro</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {navigation.map((item) => (
            <NavItem key={item.name} item={item} />
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-700">
          <div className="flex items-center gap-3 p-3 bg-surface/50 rounded-lg">
            <div className="w-8 h-8 bg-gradient-to-br from-success to-accent rounded-full flex items-center justify-center">
              <ApperIcon name="Zap" className="w-4 h-4 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">Pro Plan</p>
              <p className="text-xs text-gray-400">Active</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Mobile Sidebar
  const MobileSidebar = () => (
    <>
      {/* Overlay */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <motion.div
        initial={{ x: "-100%" }}
        animate={{ x: isOpen ? 0 : "-100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="lg:hidden fixed left-0 top-0 h-full w-64 bg-secondary border-r border-gray-700 z-50"
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
                <ApperIcon name="Play" className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold font-display text-white">ViewBoost</h1>
                <p className="text-sm text-gray-400">Pro</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-surface/50 transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2">
            {navigation.map((item) => (
              <NavItem key={item.name} item={item} />
            ))}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-700">
            <div className="flex items-center gap-3 p-3 bg-surface/50 rounded-lg">
              <div className="w-8 h-8 bg-gradient-to-br from-success to-accent rounded-full flex items-center justify-center">
                <ApperIcon name="Zap" className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Pro Plan</p>
                <p className="text-xs text-gray-400">Active</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );

  return (
    <>
      <DesktopSidebar />
      <MobileSidebar />
    </>
  );
};

export default Sidebar;