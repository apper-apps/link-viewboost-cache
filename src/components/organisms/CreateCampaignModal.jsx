import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";

const CreateCampaignModal = ({ isOpen, onClose, onSubmit, proxies = [] }) => {
  const [formData, setFormData] = useState({
    videoUrl: "",
    targetViews: "",
    targetSubscribers: "",
    timeframe: "",
    proxyPoolId: ""
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setFormData({
        videoUrl: "",
        targetViews: "",
        targetSubscribers: "",
        timeframe: "",
        proxyPoolId: ""
      });
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.videoUrl) {
      newErrors.videoUrl = "Video URL is required";
    } else if (!formData.videoUrl.includes("youtube.com") && !formData.videoUrl.includes("youtu.be")) {
      newErrors.videoUrl = "Please enter a valid YouTube URL";
    }

    if (!formData.targetViews) {
      newErrors.targetViews = "Target views is required";
    } else if (parseInt(formData.targetViews) < 1) {
      newErrors.targetViews = "Target views must be at least 1";
    }

    if (!formData.targetSubscribers) {
      newErrors.targetSubscribers = "Target subscribers is required";
    } else if (parseInt(formData.targetSubscribers) < 1) {
      newErrors.targetSubscribers = "Target subscribers must be at least 1";
    }

    if (!formData.timeframe) {
      newErrors.timeframe = "Timeframe is required";
    } else if (parseInt(formData.timeframe) < 1) {
      newErrors.timeframe = "Timeframe must be at least 1 day";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsSubmitting(true);
    
    try {
      await onSubmit({
        ...formData,
        targetViews: parseInt(formData.targetViews),
        targetSubscribers: parseInt(formData.targetSubscribers),
        timeframe: parseInt(formData.timeframe)
      });
      onClose();
    } catch (error) {
      console.error("Failed to create campaign:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-lg bg-surface border border-gray-700 rounded-xl shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary/20 to-accent/20 rounded-lg flex items-center justify-center">
                <ApperIcon name="Plus" className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h2 className="text-xl font-bold font-display text-white">Create Campaign</h2>
                <p className="text-sm text-gray-400">Set up a new YouTube growth campaign</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5 text-gray-400" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <FormField
              label="YouTube Video URL"
              required
              error={errors.videoUrl}
            >
              <Input
                type="url"
                value={formData.videoUrl}
                onChange={(e) => handleChange("videoUrl", e.target.value)}
                placeholder="https://youtube.com/watch?v=..."
              />
            </FormField>

            <div className="grid grid-cols-2 gap-4">
              <FormField
                label="Target Views"
                required
                error={errors.targetViews}
              >
                <Input
                  type="number"
                  value={formData.targetViews}
                  onChange={(e) => handleChange("targetViews", e.target.value)}
                  placeholder="10000"
                  min="1"
                />
              </FormField>

              <FormField
                label="Target Subscribers"
                required
                error={errors.targetSubscribers}
              >
                <Input
                  type="number"
                  value={formData.targetSubscribers}
                  onChange={(e) => handleChange("targetSubscribers", e.target.value)}
                  placeholder="500"
                  min="1"
                />
              </FormField>
            </div>

            <FormField
              label="Timeframe (days)"
              required
              error={errors.timeframe}
            >
              <Input
                type="number"
                value={formData.timeframe}
                onChange={(e) => handleChange("timeframe", e.target.value)}
                placeholder="30"
                min="1"
              />
            </FormField>

            <FormField label="Proxy Pool (Optional)">
              <select
                value={formData.proxyPoolId}
                onChange={(e) => handleChange("proxyPoolId", e.target.value)}
                className="w-full px-4 py-3 bg-surface border border-gray-600 rounded-lg text-white focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
              >
                <option value="">Select proxy pool (optional)</option>
                {proxies.map((proxy) => (
                  <option key={proxy.Id} value={proxy.Id}>
                    {proxy.address}:{proxy.port} ({proxy.status})
                  </option>
                ))}
              </select>
            </FormField>

            {/* Actions */}
            <div className="flex items-center gap-3 pt-4">
              <Button
                type="button"
                variant="secondary"
                onClick={onClose}
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <ApperIcon name="Loader2" className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <ApperIcon name="Rocket" className="w-4 h-4 mr-2" />
                    Create Campaign
                  </>
                )}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default CreateCampaignModal;