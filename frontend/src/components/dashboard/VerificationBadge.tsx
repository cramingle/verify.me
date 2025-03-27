import React from 'react';

interface VerificationBadgeProps {
  verified: boolean;
}

const VerificationBadge: React.FC<VerificationBadgeProps> = ({ verified }) => {
  return (
    <div className={`px-2 py-1 inline-flex items-center rounded-full text-xs font-medium ${
      verified 
        ? 'bg-green-100 text-green-800' 
        : 'bg-gray-100 text-gray-800'
    }`}>
      {verified ? (
        <>
          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Verified
        </>
      ) : (
        <>
          <svg className="w-3 h-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Unverified
        </>
      )}
    </div>
  );
};

export default VerificationBadge; 