import React from 'react';
import { motion } from 'framer-motion';

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
  delay?: number;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

const StatCard: React.FC<StatCardProps> = ({ 
  icon, 
  title, 
  value, 
  delay = 0,
  trend 
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden relative border border-white/40"
    >
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-white/90 to-white/70 z-0"></div>
      
      {/* Light border accent on top */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-gradient-start to-gradient-end"></div>
      
      {/* Content */}
      <div className="relative z-10 p-5">
        <div className="flex items-start justify-between">
          <div className="mb-3">
            <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
            <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-gradient-start to-gradient-end">{value}</h3>
            
            {trend && (
              <div className="flex items-center mt-1">
                <span className={`text-xs font-medium ${trend.isPositive ? 'text-green-500' : 'text-red-500'} flex items-center`}>
                  {trend.isPositive ? (
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
                    </svg>
                  ) : (
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                  )}
                  {trend.value}%
                </span>
                <span className="text-xs text-gray-400 ml-1">vs last period</span>
              </div>
            )}
          </div>
          
          <div className="p-3 rounded-full bg-gradient-to-r from-gradient-start/10 to-gradient-end/10 text-gradient-start">
            {icon}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default StatCard; 