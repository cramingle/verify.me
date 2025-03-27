import { track } from '@vercel/analytics';

// Track page views
export const trackPageView = (path: string) => {
  track('page_view', { path });
};

// Track verification attempts
export const trackVerification = (inputValue: string, isVerified: boolean) => {
  track('verification', { 
    inputValue, 
    isVerified, 
    timestamp: new Date().toISOString() 
  });
};

// Track button clicks
export const trackButtonClick = (buttonName: string, pageName: string) => {
  track('button_click', { 
    buttonName, 
    pageName,
    timestamp: new Date().toISOString() 
  });
};

// Track form submissions
export const trackFormSubmission = (formName: string, success: boolean) => {
  track('form_submission', { 
    formName, 
    success,
    timestamp: new Date().toISOString() 
  });
};

// Track user registration
export const trackRegistration = (success: boolean) => {
  track('registration', { 
    success,
    timestamp: new Date().toISOString() 
  });
};

// Track user login
export const trackLogin = (success: boolean) => {
  track('login', { 
    success,
    timestamp: new Date().toISOString() 
  });
};

// Track feature usage
export const trackFeatureUsage = (featureName: string) => {
  track('feature_usage', { 
    featureName,
    timestamp: new Date().toISOString() 
  });
};

// Track errors
export const trackError = (errorType: string, errorMessage: string) => {
  track('error', { 
    errorType, 
    errorMessage,
    timestamp: new Date().toISOString() 
  });
}; 