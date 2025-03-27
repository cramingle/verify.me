import React from 'react';
import { motion } from 'framer-motion';

interface ChannelPerformance {
  id: string;
  type: string;
  value: string;
  verifications: number;
}

interface VerificationTrend {
  date: string;
  count: number;
}

interface AnalyticsPanelProps {
  channelPerformance: ChannelPerformance[];
  verificationTrends: VerificationTrend[];
  onDownloadBadge: () => void;
}

const AnalyticsPanel: React.FC<AnalyticsPanelProps> = ({
  channelPerformance,
  verificationTrends,
  onDownloadBadge
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="border-b border-gray-100 px-6 py-4 bg-gray-50">
        <h3 className="text-lg font-medium text-gray-900">Analytics</h3>
      </div>
      
      <div className="px-6 py-5">
        <h4 className="font-medium text-gray-900 mb-4">Channel Performance</h4>
        <div className="space-y-3">
          {channelPerformance.sort((a, b) => b.verifications - a.verifications).map((channel, index) => (
            <div key={channel.id} className="relative pt-1">
              <div className="flex items-center justify-between mb-1">
                <div>
                  <span className="text-sm font-medium text-gray-900">{channel.value}</span>
                </div>
                <div>
                  <span className="text-sm font-semibold text-gray-900">{channel.verifications}</span>
                  <span className="text-sm text-gray-500"> verifications</span>
                </div>
              </div>
              <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(channel.verifications / Math.max(...channelPerformance.map(c => c.verifications))) * 100}%` }}
                  transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                  className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gradient-to-r from-gradient-start to-gradient-end"
                ></motion.div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-8">
          <h4 className="font-medium text-gray-900 mb-4">Verification Trends</h4>
          <div className="h-48 relative">
            <div className="absolute inset-0 flex items-end">
              {verificationTrends.map((day, index) => (
                <div key={day.date} className="flex-1 flex flex-col items-center">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${(day.count / Math.max(...verificationTrends.map(d => d.count))) * 100}%` }}
                    transition={{ duration: 1, delay: 0.3 + index * 0.1 }}
                    className="w-5 bg-gradient-to-t from-gradient-start to-gradient-end rounded-t-sm opacity-80"
                  ></motion.div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short' })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        
        <div className="mt-8">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={onDownloadBadge}
            className="w-full bg-gradient-to-r from-gradient-start to-gradient-end text-white py-2 rounded-md text-sm font-medium shadow-sm"
          >
            Download Verification Badge
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default AnalyticsPanel; 