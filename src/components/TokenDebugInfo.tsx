import React, { useState, useEffect } from 'react';
import { tokenStorage } from '../utils/tokenStorage';

export const TokenDebugInfo: React.FC = () => {
  const [, setTick] = useState(0);
  
  // Update every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTick(tick => tick + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const tokenData = tokenStorage.get();
  
  if (!tokenData) {
    return (
      <div className="fixed bottom-4 right-4 bg-red-100 border border-red-400 text-red-700 px-3 py-2 rounded text-xs">
        No tokens found
      </div>
    );
  }

  const timeUntilExpiry = tokenData.expiresAt - Date.now();
  const minutesUntilExpiry = Math.floor(timeUntilExpiry / (1000 * 60));
  const secondsUntilExpiry = Math.floor((timeUntilExpiry % (1000 * 60)) / 1000);
  const isExpired = tokenStorage.isExpired();
  const needsRefresh = tokenStorage.needsRefresh();
  
  // Change background color based on time remaining
  const isUnderOneMinute = minutesUntilExpiry < 1;
  const backgroundClass = isUnderOneMinute 
    ? "bg-red-100 border border-red-400 text-red-700" 
    : "bg-blue-100 border border-blue-400 text-blue-700";

  return (
    <div className={`fixed bottom-4 right-4 ${backgroundClass} px-3 py-2 rounded text-xs max-w-xs`}>
      <div><strong>Token Status:</strong></div>
      <div>Expires in: {minutesUntilExpiry}m {secondsUntilExpiry}s</div>
      <div>Is Expired: {isExpired ? 'Yes' : 'No'}</div>
      <div>Needs Refresh: {needsRefresh ? 'Yes' : 'No'}</div>
      <div>Has Refresh Token: {tokenData.refreshToken ? 'Yes' : 'No'}</div>
    </div>
  );
};
