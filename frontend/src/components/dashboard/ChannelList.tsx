import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ChannelItem from './ChannelItem';

interface Channel {
  id: string;
  type: 'x' | 'telegram' | 'website' | 'email' | 'phone';
  value: string;
  verified: boolean;
  verifiedAt: string;
  isEmployeeChannel: boolean;
  employeeInfo?: {
    name: string;
    role: string;
    department?: string;
    verificationStatus: 'pending' | 'verified' | 'rejected';
  };
}

interface ChannelListProps {
  channels: Channel[];
  channelPerformance: Array<{ id: string; verifications: number }>;
  channelTypeLabels: Record<string, string>;
  onShowCompanyModal: () => void;
  onShowEmployeeModal: () => void;
  onShowCsvModal: () => void;
  onRemoveChannel: (id: string) => void;
}

const ChannelList: React.FC<ChannelListProps> = ({
  channels,
  channelPerformance,
  channelTypeLabels,
  onShowCompanyModal,
  onShowEmployeeModal,
  onShowCsvModal,
  onRemoveChannel
}) => {
  const companyChannels = channels.filter(channel => !channel.isEmployeeChannel);
  const employeeChannels = channels.filter(channel => channel.isEmployeeChannel);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
    >
      <div className="border-b border-gray-100 px-6 py-4 bg-gray-50 flex justify-between items-center">
        <h3 className="text-lg font-medium text-gray-900">Your Channels</h3>
        <div className="flex space-x-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={onShowCompanyModal}
            className="bg-gradient-to-r from-gradient-start to-gradient-end text-white px-4 py-2 rounded-md text-sm font-medium shadow-sm"
          >
            Add Company Channel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={onShowEmployeeModal}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium shadow-sm hover:bg-gray-50"
          >
            Add Employee Channel
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
            onClick={onShowCsvModal}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md text-sm font-medium shadow-sm hover:bg-gray-50"
          >
            Upload CSV
          </motion.button>
        </div>
      </div>
      
      <div className="px-6 py-5">
        {channels.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No channels added yet. Add your first channel to start building trust.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Company Channels Section */}
            <div>
              <h4 className="text-sm font-medium text-gray-500 mb-3">Company Channels</h4>
              <div className="space-y-3">
                <AnimatePresence>
                  {companyChannels.map(channel => (
                    <ChannelItem
                      key={channel.id}
                      channel={channel}
                      verifications={channelPerformance.find(c => c.id === channel.id)?.verifications || 0}
                      onRemove={onRemoveChannel}
                      channelTypeLabels={channelTypeLabels}
                    />
                  ))}
                </AnimatePresence>
              </div>
            </div>

            {/* Employee Channels Section */}
            {employeeChannels.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-3">Employee Channels</h4>
                <div className="space-y-3">
                  <AnimatePresence>
                    {employeeChannels.map(channel => (
                      <ChannelItem
                        key={channel.id}
                        channel={channel}
                        verifications={channelPerformance.find(c => c.id === channel.id)?.verifications || 0}
                        onRemove={onRemoveChannel}
                        channelTypeLabels={channelTypeLabels}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ChannelList; 