import React from 'react';
import { motion } from 'framer-motion';

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

interface ChannelItemProps {
  channel: Channel;
  verifications?: number;
  onRemove: (id: string) => void;
  channelTypeLabels: Record<string, string>;
}

const ChannelItem: React.FC<ChannelItemProps> = ({ 
  channel, 
  verifications = 0, 
  onRemove,
  channelTypeLabels
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-gray-50 rounded-md p-4 flex items-center justify-between border border-gray-100"
    >
      <div className="flex items-center">
        <div className={`w-10 h-10 flex items-center justify-center rounded-full 
          ${channel.type === 'x' ? 'bg-black text-white' : 
            channel.type === 'telegram' ? 'bg-blue-500 text-white' : 
            channel.type === 'website' ? 'bg-purple-500 text-white' : 
            channel.type === 'email' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'}`}>
          {channel.type === 'x' && 'X'}
          {channel.type === 'telegram' && 'T'}
          {channel.type === 'website' && 'W'}
          {channel.type === 'email' && 'E'}
          {channel.type === 'phone' && 'P'}
        </div>
        <div className="ml-4">
          <span className="text-gray-900 font-medium block">
            {channel.value}
          </span>
          {channel.isEmployeeChannel && channel.employeeInfo ? (
            <div className="text-gray-500 text-sm space-y-1">
              <div>{channel.employeeInfo.name} • {channel.employeeInfo.role}</div>
              <div>{channelTypeLabels[channel.type]} • Added on {new Date(channel.verifiedAt).toLocaleDateString()}</div>
              <div className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium
                ${channel.employeeInfo.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
                  channel.employeeInfo.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'}`}>
                {channel.employeeInfo.verificationStatus ? 
                  channel.employeeInfo.verificationStatus.charAt(0).toUpperCase() + channel.employeeInfo.verificationStatus.slice(1) 
                  : 'Unknown'}
              </div>
            </div>
          ) : (
            <span className="text-gray-500 text-sm">
              {channelTypeLabels[channel.type]} • Added on {new Date(channel.verifiedAt).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="text-sm text-gray-500 mr-4">
          <span className="font-semibold text-gray-900">{verifications}</span> verifications
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
          onClick={() => onRemove(channel.id)}
          className="text-gray-400 hover:text-red-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ChannelItem; 