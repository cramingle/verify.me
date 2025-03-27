import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Channel {
  id: string;
  type: 'x' | 'telegram' | 'website' | 'email' | 'phone';
  value: string;
  verified: boolean;
  verifiedAt: string;
  isEmployeeChannel: boolean;
  employeeInfo: {
    name: string;
    role: string;
    department?: string;
    verificationStatus: 'pending' | 'verified' | 'rejected';
  };
}

interface AddEmployeeChannelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddChannel: (channel: Channel) => void;
}

const channelTypeLabels = {
  x: 'X (Twitter)',
  telegram: 'Telegram',
  website: 'Website',
  email: 'Email',
  phone: 'Phone',
};

const departments = [
  'Executive',
  'Marketing',
  'Sales',
  'Engineering',
  'Product',
  'Support',
  'Customer Success',
  'Human Resources',
  'Finance',
  'Legal',
  'Operations',
  'Research',
  'Other'
];

const AddEmployeeChannelModal: React.FC<AddEmployeeChannelModalProps> = ({ isOpen, onClose, onAddChannel }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [channelType, setChannelType] = useState<Channel['type']>('x');
  const [channelValue, setChannelValue] = useState('');
  const [employeeName, setEmployeeName] = useState('');
  const [employeeRole, setEmployeeRole] = useState('');
  const [employeeDepartment, setEmployeeDepartment] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState<{[key: string]: string}>({});

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    
    if (!channelValue.trim()) {
      newErrors.channelValue = 'Channel value is required';
    } else {
      // Validate based on type
      if (channelType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(channelValue)) {
        newErrors.channelValue = 'Enter a valid email address';
      } else if (channelType === 'website' && !/^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z0-9-]+)+([/?].*)?$/.test(channelValue)) {
        newErrors.channelValue = 'Enter a valid website URL';
      } else if (channelType === 'phone' && !/^\+?[0-9]{10,15}$/.test(channelValue)) {
        newErrors.channelValue = 'Enter a valid phone number';
      }
    }
    
    if (!employeeName.trim()) {
      newErrors.employeeName = 'Employee name is required';
    }
    
    if (!employeeRole.trim()) {
      newErrors.employeeRole = 'Employee role is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const resetForm = () => {
    setChannelType('x');
    setChannelValue('');
    setEmployeeName('');
    setEmployeeRole('');
    setEmployeeDepartment('');
    setDescription('');
    setErrors({});
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newChannel: Channel = {
        id: Date.now().toString(),
        type: channelType,
        value: channelValue,
        verified: false,
        verifiedAt: new Date().toISOString(),
        isEmployeeChannel: true,
        employeeInfo: {
          name: employeeName,
          role: employeeRole,
          department: employeeDepartment || undefined,
          verificationStatus: 'pending'
        }
      };
      
      onAddChannel(newChannel);
      setIsLoading(false);
      handleClose();
    }, 500);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 z-40"
          onClick={onClose}
        />
        <motion.div
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed inset-0 z-50 overflow-auto flex items-center justify-center p-4 sm:p-8"
        >
          <div 
            className="bg-white rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 sm:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add Employee Channel</h2>
                <button 
                  onClick={handleClose}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-6">
                  <div className="flex items-start">
                    <svg className="h-5 w-5 text-blue-500 mt-0.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                    <p className="ml-2 text-sm text-blue-700">
                      Adding a verified employee channel helps customers confirm they're communicating with authorized representatives.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Employee Name
                    </label>
                    <input
                      type="text"
                      value={employeeName}
                      onChange={(e) => setEmployeeName(e.target.value)}
                      placeholder="Jane Smith"
                      className={`w-full px-4 py-3 border ${errors.employeeName ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gradient-start focus:border-transparent transition`}
                    />
                    {errors.employeeName && (
                      <p className="mt-1 text-sm text-red-600">{errors.employeeName}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Role
                    </label>
                    <input
                      type="text"
                      value={employeeRole}
                      onChange={(e) => setEmployeeRole(e.target.value)}
                      placeholder="Marketing Manager"
                      className={`w-full px-4 py-3 border ${errors.employeeRole ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gradient-start focus:border-transparent transition`}
                    />
                    {errors.employeeRole && (
                      <p className="mt-1 text-sm text-red-600">{errors.employeeRole}</p>
                    )}
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Department (Optional)
                    </label>
                    <select
                      value={employeeDepartment}
                      onChange={(e) => setEmployeeDepartment(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gradient-start focus:border-transparent transition"
                    >
                      <option value="">Select a department</option>
                      {departments.map((dept) => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="h-px bg-gray-200 w-full my-2"></div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Channel Type
                  </label>
                  <select
                    value={channelType}
                    onChange={(e) => setChannelType(e.target.value as Channel['type'])}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gradient-start focus:border-transparent transition"
                  >
                    {Object.entries(channelTypeLabels).map(([value, label]) => (
                      <option key={value} value={value}>{label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Channel Value
                  </label>
                  <input
                    type="text"
                    value={channelValue}
                    onChange={(e) => setChannelValue(e.target.value)}
                    placeholder={channelType === 'x' ? '@username' : 
                               channelType === 'telegram' ? 't.me/username' :
                               channelType === 'website' ? 'example.com' :
                               channelType === 'email' ? 'email@example.com' :
                               '+1234567890'}
                    className={`w-full px-4 py-3 border ${errors.channelValue ? 'border-red-300 bg-red-50' : 'border-gray-300'} rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gradient-start focus:border-transparent transition`}
                  />
                  {errors.channelValue && (
                    <p className="mt-1 text-sm text-red-600">{errors.channelValue}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Description (Optional)
                  </label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Employee's official support account"
                    rows={2}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-gradient-start focus:border-transparent transition"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={handleClose}
                    className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-gradient-start to-gradient-end rounded-lg hover:opacity-90 transition-colors flex items-center"
                  >
                    {isLoading ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Add Employee Channel'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
};

export default AddEmployeeChannelModal; 