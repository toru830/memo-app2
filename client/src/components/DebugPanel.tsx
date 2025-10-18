import React from 'react';

export const DebugPanel: React.FC = () => {
  const envVars = {
    VITE_FIREBASE_API_KEY: import.meta.env.VITE_FIREBASE_API_KEY,
    VITE_FIREBASE_AUTH_DOMAIN: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
    VITE_FIREBASE_PROJECT_ID: import.meta.env.VITE_FIREBASE_PROJECT_ID,
    VITE_FIREBASE_STORAGE_BUCKET: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
    VITE_FIREBASE_MESSAGING_SENDER_ID: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
    VITE_FIREBASE_APP_ID: import.meta.env.VITE_FIREBASE_APP_ID,
  };

  const isProduction = import.meta.env.PROD;
  const isDevelopment = import.meta.env.DEV;

  return (
    <div className="fixed bottom-4 right-4 bg-black bg-opacity-90 text-white p-4 rounded-lg max-w-md text-xs z-50">
      <h3 className="font-bold mb-2">🔍 Debug Panel</h3>
      <div className="mb-2">
        <strong>Environment:</strong> {isProduction ? 'Production' : 'Development'}
      </div>
      <div className="mb-2">
        <strong>Mode:</strong> {isDevelopment ? 'DEV' : 'PROD'}
      </div>
      <div className="space-y-1">
        {Object.entries(envVars).map(([key, value]) => (
          <div key={key} className="flex">
            <span className="w-32 truncate">{key}:</span>
            <span className={`ml-2 ${value ? 'text-green-400' : 'text-red-400'}`}>
              {value ? '✅' : '❌'} {value ? value.substring(0, 20) + '...' : 'undefined'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
