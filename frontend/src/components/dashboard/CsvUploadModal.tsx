import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import Papa from 'papaparse';

interface CsvData {
  channel: string;
  type: string;
  description?: string;
  is_employee_channel: boolean;
  employee_name?: string;
  employee_role?: string;
  employee_department?: string;
  status: 'unverified' | 'verified' | 'failed';
}

interface CsvUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpload: (data: CsvData[]) => void;
}

const CsvUploadModal: React.FC<CsvUploadModalProps> = ({ isOpen, onClose, onUpload }) => {
  const [csvData, setCsvData] = useState<CsvData[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewMode, setPreviewMode] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    Papa.parse(file, {
      complete: (results) => {
        const data = results.data as string[][];
        const headers = data[0];
        
        // Validate CSV structure - required fields
        if (!headers.includes('channel') || !headers.includes('type')) {
          setError('CSV must include "channel" and "type" columns');
          setIsUploading(false);
          return;
        }

        // Process CSV data
        const processedData: CsvData[] = data.slice(1).map(row => {
          // Parse boolean value
          const isEmployeeChannel = 
            row[headers.indexOf('is_employee_channel')] === 'true' || 
            row[headers.indexOf('is_employee_channel')] === 'TRUE' ||
            row[headers.indexOf('is_employee_channel')] === '1';
          
          return {
            channel: row[headers.indexOf('channel')] || '',
            type: row[headers.indexOf('type')] || '',
            description: row[headers.indexOf('description')] || '',
            is_employee_channel: isEmployeeChannel,
            employee_name: isEmployeeChannel ? row[headers.indexOf('employee_name')] || '' : undefined,
            employee_role: isEmployeeChannel ? row[headers.indexOf('employee_role')] || '' : undefined,
            employee_department: isEmployeeChannel ? row[headers.indexOf('employee_department')] || '' : undefined,
            status: 'unverified' as const
          };
        });

        setCsvData(processedData);
        setIsUploading(false);
        setPreviewMode(true);
      },
      error: (error) => {
        setError('Error parsing CSV file: ' + error.message);
        setIsUploading(false);
      },
      header: true,
      skipEmptyLines: true
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv']
    },
    maxFiles: 1
  });

  const handleUpload = () => {
    onUpload(csvData);
    setPreviewMode(false);
    onClose();
  };

  const downloadTemplate = () => {
    const csvContent = `channel,type,description,is_employee_channel,employee_name,employee_role,employee_department
@CompanyX,x,Official Company X Twitter account,false,,, 
companyx.com,website,Main company website,false,,,
t.me/CompanyX,telegram,Official company customer support,false,,,
support@companyx.com,email,Customer support email,false,,,
+1234567890,phone,Main customer service line,false,,,
@JohnSupport,x,Employee account for support queries,true,John Doe,Customer Support,Support
t.me/SarahMarketing,telegram,Marketing team contact,true,Sarah Smith,Marketing Manager,Marketing
julia@companyx.com,email,HR representative,true,Julia Miller,HR Director,Human Resources
+1987654321,phone,Sales department contact,true,Michael Brown,Sales Representative,Sales`;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'channel_template.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 sm:p-10">
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Upload CSV Data</h2>
                <button 
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700 p-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {!previewMode ? (
                <div className="space-y-6">
                  <button
                    onClick={downloadTemplate}
                    className="w-full px-4 py-3 text-sm text-blue-600 font-medium border border-blue-300 rounded-lg hover:bg-blue-50 transition"
                  >
                    Download CSV Template
                  </button>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">
                      Your CSV must include the following required columns:
                    </p>
                    <ul className="list-disc list-inside text-sm mb-2">
                      <li className="font-medium text-gray-800">channel - The handle, URL, email or phone number</li>
                      <li className="font-medium text-gray-800">type - One of: x, telegram, website, email, phone</li>
                      <li className="font-medium text-gray-800">is_employee_channel - true/false</li>
                    </ul>
                    <p className="text-sm text-gray-600 mb-2">
                      For employee channels (is_employee_channel = true), also include:
                    </p>
                    <ul className="list-disc list-inside text-sm">
                      <li className="font-medium text-gray-800">employee_name - Full name of the employee</li>
                      <li className="font-medium text-gray-800">employee_role - Employee's job title</li>
                      <li className="font-medium text-gray-800">employee_department - Optional department</li>
                    </ul>
                  </div>
                  
                  <div>
                    <div {...getRootProps()}>
                      <input {...getInputProps()} />
                      <div className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                        isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                      }`}>
                        <div className="space-y-4">
                          <svg
                            className="mx-auto h-12 w-12 text-gray-400"
                            stroke="currentColor"
                            fill="none"
                            viewBox="0 0 48 48"
                            aria-hidden="true"
                          >
                            <path
                              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                              strokeWidth={2}
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          <div className="text-gray-600">
                            <p className="text-lg font-medium">
                              {isDragActive ? 'Drop the CSV file here' : 'Drag and drop a CSV file here'}
                            </p>
                            <p className="text-sm mt-1">or click to select a file</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <h4 className="text-lg font-medium text-gray-900 mb-4">Preview Data</h4>
                  <div className="overflow-x-auto max-h-96 overflow-y-auto mb-6 border border-gray-200 rounded-lg">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Channel
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Description
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Channel Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Employee Details
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {csvData.map((row, index) => (
                          <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {row.channel}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {row.type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {row.description}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                row.is_employee_channel ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                              }`}>
                                {row.is_employee_channel ? 'Employee' : 'Company'}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-900">
                              {row.is_employee_channel && row.employee_name ? (
                                <div className="space-y-1">
                                  <div className="font-medium">{row.employee_name}</div>
                                  {row.employee_role && <div>{row.employee_role}</div>}
                                  {row.employee_department && <div className="text-gray-500 text-xs">{row.employee_department}</div>}
                                </div>
                              ) : (
                                '-'
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Unverified
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="flex justify-end space-x-3">
                    <button
                      onClick={() => setPreviewMode(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                    >
                      Back
                    </button>
                    <button
                      onClick={handleUpload}
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-gradient-start to-gradient-end rounded-md hover:opacity-90 transition-colors"
                    >
                      Upload Data
                    </button>
                  </div>
                </div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 p-4 bg-red-50 text-red-800 rounded-md border border-red-200"
                >
                  {error}
                </motion.div>
              )}

              {isUploading && (
                <div className="mt-6 flex justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-gradient-start"></div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </>
    </AnimatePresence>
  );
};

export default CsvUploadModal; 