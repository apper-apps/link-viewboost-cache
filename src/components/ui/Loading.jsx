import React from "react";
import { motion } from "framer-motion";

const Loading = ({ type = "default" }) => {
  if (type === "cards") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-surface border border-gray-700 rounded-xl p-6 animate-pulse">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="w-16 h-12 bg-gray-700 rounded-lg" />
                <div className="space-y-2">
                  <div className="h-4 w-32 bg-gray-700 rounded" />
                  <div className="h-3 w-24 bg-gray-700 rounded" />
                  <div className="h-3 w-20 bg-gray-700 rounded" />
                </div>
              </div>
              <div className="h-6 w-16 bg-gray-700 rounded-full" />
            </div>
            
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-gray-700 rounded-full" />
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="text-center space-y-2">
                <div className="h-6 w-16 bg-gray-700 rounded mx-auto" />
                <div className="h-3 w-12 bg-gray-700 rounded mx-auto" />
                <div className="h-2 w-full bg-gray-700 rounded" />
                <div className="h-3 w-20 bg-gray-700 rounded mx-auto" />
              </div>
              <div className="text-center space-y-2">
                <div className="h-6 w-16 bg-gray-700 rounded mx-auto" />
                <div className="h-3 w-12 bg-gray-700 rounded mx-auto" />
                <div className="h-2 w-full bg-gray-700 rounded" />
                <div className="h-3 w-20 bg-gray-700 rounded mx-auto" />
              </div>
            </div>
            
            <div className="flex gap-2">
              <div className="h-8 bg-gray-700 rounded flex-1" />
              <div className="h-8 w-8 bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "stats") {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="bg-surface border border-gray-700 rounded-xl p-6 animate-pulse">
            <div className="flex items-center justify-between mb-4">
              <div className="w-10 h-10 bg-gray-700 rounded-lg" />
              <div className="h-4 w-12 bg-gray-700 rounded" />
            </div>
            <div className="space-y-2">
              <div className="h-8 w-20 bg-gray-700 rounded" />
              <div className="h-4 w-16 bg-gray-700 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (type === "table") {
    return (
      <div className="bg-surface border border-gray-700 rounded-xl overflow-hidden">
        <div className="p-6 border-b border-gray-700">
          <div className="h-6 w-32 bg-gray-700 rounded animate-pulse" />
        </div>
        <div className="divide-y divide-gray-700">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="p-4 flex items-center gap-4 animate-pulse">
              <div className="h-4 w-32 bg-gray-700 rounded" />
              <div className="h-4 w-16 bg-gray-700 rounded" />
              <div className="h-4 w-20 bg-gray-700 rounded" />
              <div className="h-4 w-16 bg-gray-700 rounded" />
              <div className="h-6 w-16 bg-gray-700 rounded-full ml-auto" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        className="w-8 h-8 border-2 border-gray-600 border-t-accent rounded-full"
      />
    </div>
  );
};

export default Loading;