import React, { useState } from "react";
import { motion } from "framer-motion";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import { toast } from "react-toastify";

const Settings = () => {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    general: {
      maxConcurrentCampaigns: "5",
      defaultTimeframe: "30",
      autoStart: false,
      pauseOnError: true
    },
    notifications: {
      emailNotifications: true,
      milestoneAlerts: true,
      errorAlerts: true,
      completionNotifications: true,
      email: "user@example.com"
    },
    api: {
      youtubeApiKey: "",
      webhookUrl: "",
      rateLimitPerMinute: "60"
    },
    proxy: {
      rotationInterval: "300",
      maxRetries: "3",
      timeoutSeconds: "30",
      healthCheckInterval: "600"
    }
  });

  const tabs = [
    { id: "general", label: "General", icon: "Settings" },
    { id: "notifications", label: "Notifications", icon: "Bell" },
    { id: "api", label: "API & Integrations", icon: "Code" },
    { id: "proxy", label: "Proxy Settings", icon: "Shield" }
  ];

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    // In a real app, this would save to backend
    toast.success("Settings saved successfully!");
  };

  const handleExportSettings = () => {
    const dataStr = JSON.stringify(settings, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "viewboost-settings.json";
    link.click();
    toast.success("Settings exported successfully!");
  };

  const handleImportSettings = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedSettings = JSON.parse(e.target.result);
          setSettings(importedSettings);
          toast.success("Settings imported successfully!");
        } catch (error) {
          toast.error("Invalid settings file format");
        }
      };
      reader.readAsText(file);
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Max Concurrent Campaigns">
          <Input
            type="number"
            value={settings.general.maxConcurrentCampaigns}
            onChange={(e) => handleSettingChange("general", "maxConcurrentCampaigns", e.target.value)}
            min="1"
            max="20"
          />
        </FormField>
        
        <FormField label="Default Timeframe (days)">
          <Input
            type="number"
            value={settings.general.defaultTimeframe}
            onChange={(e) => handleSettingChange("general", "defaultTimeframe", e.target.value)}
            min="1"
            max="365"
          />
        </FormField>
      </div>

      <div className="space-y-4">
        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.general.autoStart}
            onChange={(e) => handleSettingChange("general", "autoStart", e.target.checked)}
            className="w-4 h-4 text-primary bg-surface border-gray-600 rounded focus:ring-primary focus:ring-2"
          />
          <span className="text-white">Auto-start campaigns after creation</span>
        </label>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={settings.general.pauseOnError}
            onChange={(e) => handleSettingChange("general", "pauseOnError", e.target.checked)}
            className="w-4 h-4 text-primary bg-surface border-gray-600 rounded focus:ring-primary focus:ring-2"
          />
          <span className="text-white">Pause campaigns on proxy errors</span>
        </label>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <FormField label="Email Address">
        <Input
          type="email"
          value={settings.notifications.email}
          onChange={(e) => handleSettingChange("notifications", "email", e.target.value)}
          placeholder="user@example.com"
        />
      </FormField>

      <div className="space-y-4">
        <h4 className="text-lg font-medium text-white">Notification Types</h4>
        
        {[
          { key: "emailNotifications", label: "Email Notifications", description: "Receive notifications via email" },
          { key: "milestoneAlerts", label: "Milestone Alerts", description: "Get notified when campaigns reach milestones" },
          { key: "errorAlerts", label: "Error Alerts", description: "Immediate notifications for errors" },
          { key: "completionNotifications", label: "Completion Notifications", description: "Notify when campaigns complete" }
        ].map((item) => (
          <div key={item.key} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-lg">
            <div>
              <p className="text-white font-medium">{item.label}</p>
              <p className="text-sm text-gray-400">{item.description}</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.notifications[item.key]}
                onChange={(e) => handleSettingChange("notifications", item.key, e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderApiSettings = () => (
    <div className="space-y-6">
      <FormField label="YouTube API Key">
        <Input
          type="password"
          value={settings.api.youtubeApiKey}
          onChange={(e) => handleSettingChange("api", "youtubeApiKey", e.target.value)}
          placeholder="Enter your YouTube API key"
        />
      </FormField>

      <FormField label="Webhook URL (Optional)">
        <Input
          type="url"
          value={settings.api.webhookUrl}
          onChange={(e) => handleSettingChange("api", "webhookUrl", e.target.value)}
          placeholder="https://your-webhook.com/endpoint"
        />
      </FormField>

      <FormField label="Rate Limit (requests/minute)">
        <Input
          type="number"
          value={settings.api.rateLimitPerMinute}
          onChange={(e) => handleSettingChange("api", "rateLimitPerMinute", e.target.value)}
          min="1"
          max="300"
        />
      </FormField>

      <div className="bg-info/10 border border-info/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <ApperIcon name="Info" className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-info font-medium">API Configuration</p>
            <p className="text-sm text-info/80 mt-1">
              Configure your YouTube API credentials and webhook endpoints for advanced integrations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProxySettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="Rotation Interval (seconds)">
          <Input
            type="number"
            value={settings.proxy.rotationInterval}
            onChange={(e) => handleSettingChange("proxy", "rotationInterval", e.target.value)}
            min="60"
            max="3600"
          />
        </FormField>

        <FormField label="Max Retries">
          <Input
            type="number"
            value={settings.proxy.maxRetries}
            onChange={(e) => handleSettingChange("proxy", "maxRetries", e.target.value)}
            min="1"
            max="10"
          />
        </FormField>

        <FormField label="Timeout (seconds)">
          <Input
            type="number"
            value={settings.proxy.timeoutSeconds}
            onChange={(e) => handleSettingChange("proxy", "timeoutSeconds", e.target.value)}
            min="5"
            max="120"
          />
        </FormField>

        <FormField label="Health Check Interval (seconds)">
          <Input
            type="number"
            value={settings.proxy.healthCheckInterval}
            onChange={(e) => handleSettingChange("proxy", "healthCheckInterval", e.target.value)}
            min="60"
            max="3600"
          />
        </FormField>
      </div>

      <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <ApperIcon name="AlertTriangle" className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-warning font-medium">Proxy Configuration</p>
            <p className="text-sm text-warning/80 mt-1">
              Optimize these settings based on your proxy provider's specifications and campaign requirements.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-display text-white">Settings</h1>
          <p className="text-gray-400 mt-1">Configure your application preferences</p>
        </div>
        <div className="flex gap-3">
          <label className="cursor-pointer">
            <input
              type="file"
              accept=".json"
              onChange={handleImportSettings}
              className="hidden"
            />
            <Button variant="secondary">
              <ApperIcon name="Upload" className="w-5 h-5 mr-2" />
              Import
            </Button>
          </label>
          <Button variant="secondary" onClick={handleExportSettings}>
            <ApperIcon name="Download" className="w-5 h-5 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-surface border border-gray-700 rounded-xl p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-primary text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
                >
                  <ApperIcon name={tab.icon} className="w-5 h-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-surface border border-gray-700 rounded-xl p-8"
          >
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white">
                {tabs.find(tab => tab.id === activeTab)?.label}
              </h2>
              <p className="text-gray-400 mt-1">
                {activeTab === "general" && "Configure general application settings"}
                {activeTab === "notifications" && "Manage notification preferences"}
                {activeTab === "api" && "Set up API keys and integrations"}
                {activeTab === "proxy" && "Configure proxy management settings"}
              </p>
            </div>

            {activeTab === "general" && renderGeneralSettings()}
            {activeTab === "notifications" && renderNotificationSettings()}
            {activeTab === "api" && renderApiSettings()}
            {activeTab === "proxy" && renderProxySettings()}

            <div className="flex justify-end pt-8 border-t border-gray-700 mt-8">
              <Button onClick={handleSaveSettings}>
                <ApperIcon name="Save" className="w-5 h-5 mr-2" />
                Save Settings
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Settings;