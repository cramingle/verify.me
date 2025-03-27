import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import TopNavigation from '../components/dashboard/TopNavigation';
import ChannelList from '../components/dashboard/ChannelList';
import AnalyticsPanel from '../components/dashboard/AnalyticsPanel';
import VerificationResults from '../components/dashboard/VerificationResults';
import StatCard from '../components/dashboard/StatCard';
import CsvUploadModal from '../components/dashboard/CsvUploadModal';
import AddCompanyChannelModal from '../components/dashboard/AddCompanyChannelModal';
import AddEmployeeChannelModal from '../components/dashboard/AddEmployeeChannelModal';

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

interface VerificationData {
  channel: string;
  type: string;
  description?: string;
  status: 'unverified' | 'verified' | 'failed';
}

const channelTypeLabels = {
  x: 'X (Twitter)',
  telegram: 'Telegram',
  website: 'Website',
  email: 'Email',
  phone: 'Phone',
};

const Dashboard: React.FC = () => {
  const [channels, setChannels] = useState<Channel[]>([
    // Company channels
    { id: '1', type: 'x', value: '@CompanyX', verified: true, verifiedAt: '2025-03-01', isEmployeeChannel: false },
    { id: '2', type: 'website', value: 'companyx.com', verified: true, verifiedAt: '2025-03-01', isEmployeeChannel: false },
    { id: '3', type: 'telegram', value: 't.me/CompanyX', verified: true, verifiedAt: '2025-03-01', isEmployeeChannel: false },
    // Employee channels
    { 
      id: '4', 
      type: 'telegram', 
      value: 't.me/JohnSupport', 
      verified: true, 
      verifiedAt: '2025-03-01', 
      isEmployeeChannel: true,
      employeeInfo: {
        name: 'John Doe',
        role: 'Customer Support',
        department: 'Support',
        verificationStatus: 'verified'
      }
    },
    { 
      id: '5', 
      type: 'x', 
      value: '@SarahMarketing', 
      verified: true, 
      verifiedAt: '2025-03-01', 
      isEmployeeChannel: true,
      employeeInfo: {
        name: 'Sarah Smith',
        role: 'Marketing Manager',
        department: 'Marketing',
        verificationStatus: 'verified'
      }
    }
  ]);
  const [showCompanyModal, setShowCompanyModal] = useState(false);
  const [showEmployeeModal, setShowEmployeeModal] = useState(false);
  const [showCsvModal, setShowCsvModal] = useState(false);

  // Enhanced statistics for better analytics
  const [stats, setStats] = useState({
    totalVerifications: 245,
    todayVerifications: 52,
    weekVerifications: 198,
    channelPerformance: [
      { id: '1', type: 'x', value: '@CompanyX', verifications: 120 },
      { id: '2', type: 'website', value: 'companyx.com', verifications: 85 },
      { id: '3', type: 'telegram', value: 't.me/CompanyX', verifications: 40 },
    ],
    verificationTrends: [
      { date: '2025-03-01', count: 32 },
      { date: '2025-03-02', count: 28 },
      { date: '2025-03-03', count: 41 },
      { date: '2025-03-04', count: 45 },
      { date: '2025-03-05', count: 52 },
      { date: '2025-03-06', count: 49 },
      { date: '2025-03-07', count: 58 },
    ]
  });

  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResults, setVerificationResults] = useState<VerificationData[]>([]);

  const handleRemoveChannel = (id: string) => {
    setChannels(channels.filter(channel => channel.id !== id));
  };

  const handleAddChannel = (newChannel: Channel) => {
    setChannels([...channels, newChannel]);
  };

  const handleDownloadBadge = () => {
    // In a real app, this would generate and download a PNG
    alert('Badge downloaded successfully!');
  };

  const handleUpload = async (data: any[]) => {
    try {
      setUploadError(null);
      
      // Format data for backend
      const formattedData = data.map(item => ({
        channel: item.channel,
        type: item.type,
        description: item.description || '',
        is_employee_channel: item.is_employee_channel,
        employee_info: item.is_employee_channel ? {
          name: item.employee_name,
          role: item.employee_role,
          department: item.employee_department || undefined
        } : undefined
      }));
      
      const response = await axios.post('/api/csv/upload', { channels: formattedData });
      setUploadSuccess(true);
      setVerificationResults(response.data.verifications);
      setShowCsvModal(false);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to upload CSV data');
    }
  };

  const handleVerify = async () => {
    try {
      setIsVerifying(true);
      setUploadError(null);
      const verificationIds = verificationResults.map((v: any) => v.id);
      const response = await axios.post('/api/csv/verify', { verificationIds });
      setVerificationResults(response.data.results);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Failed to verify data');
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      className="flex flex-col min-h-screen bg-gray-50"
    >
      <TopNavigation username="John Smith" />
      
      <div className="flex-1 p-6">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gradient-start" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Total Verifications"
              value={stats.totalVerifications}
              trend={{ value: 12, isPositive: true }}
            />
            
            <StatCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gradient-end" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              }
              title="Today"
              value={stats.todayVerifications}
              delay={0.1}
              trend={{ value: 24, isPositive: true }}
            />
            
            <StatCard
              icon={
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gradient-start" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              }
              title="This Week"
              value={stats.weekVerifications}
              delay={0.2}
              trend={{ value: 8, isPositive: false }}
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Channels section */}
          <ChannelList 
            channels={channels}
            channelPerformance={stats.channelPerformance.map(cp => ({ id: cp.id, verifications: cp.verifications }))}
            channelTypeLabels={channelTypeLabels}
            onShowCompanyModal={() => setShowCompanyModal(true)}
            onShowEmployeeModal={() => setShowEmployeeModal(true)}
            onShowCsvModal={() => setShowCsvModal(true)}
            onRemoveChannel={handleRemoveChannel}
          />
          
          {/* Analytics section */}
          <AnalyticsPanel
            channelPerformance={stats.channelPerformance.map(cp => ({
              id: cp.id,
              type: cp.type,
              value: cp.value,
              verifications: cp.verifications
            }))}
            verificationTrends={stats.verificationTrends}
            onDownloadBadge={handleDownloadBadge}
          />
        </div>
        
        {/* Verification Results */}
        {verificationResults.length > 0 && (
          <VerificationResults
            results={verificationResults}
            isVerifying={isVerifying}
            error={uploadError}
            onVerify={handleVerify}
          />
        )}
      </div>

      {/* Modals */}
      <AddCompanyChannelModal
        isOpen={showCompanyModal}
        onClose={() => setShowCompanyModal(false)}
        onAddChannel={handleAddChannel}
      />

      <AddEmployeeChannelModal
        isOpen={showEmployeeModal}
        onClose={() => setShowEmployeeModal(false)}
        onAddChannel={handleAddChannel}
      />

      <CsvUploadModal
        isOpen={showCsvModal}
        onClose={() => setShowCsvModal(false)}
        onUpload={handleUpload}
      />
    </motion.div>
  );
};

export default Dashboard; 