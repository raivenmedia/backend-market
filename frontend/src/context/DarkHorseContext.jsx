import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';

const DarkHorseContext = createContext();

export const useDarkHorse = () => useContext(DarkHorseContext);

export const DarkHorseProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  // Setup interceptor for global fetch/axios to automatically catch DarkHorse 403s
  // This is typically done in the API client setup, but we'll expose a trigger function here

  const triggerAlert = useCallback((message, type = 'violation') => {
    const id = Date.now();
    setAlerts((prev) => [...prev, { id, message, type }]);

    // Optional: play sound
    // const audio = new Audio('/sounds/darkhorse-alert.mp3');
    // audio.play().catch(e => console.log('Audio disabled by browser'));

    setTimeout(() => {
      setAlerts((prev) => prev.filter((alert) => alert.id !== id));
    }, 6000); // 6 seconds
  }, []);

  return (
    <DarkHorseContext.Provider value={{ triggerAlert }}>
      {children}
      <div className="fixed bottom-5 right-5 z-[9999] flex flex-col gap-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`
              relative overflow-hidden w-80 p-5 rounded-lg shadow-[0_0_15px_rgba(249,115,22,0.3)] 
              bg-[#1a1a1c] border border-orange-500/40 
              text-orange-50 font-outfit transform transition-all duration-500 animate-slide-in-right
              before:absolute before:inset-0 before:bg-orange-500/10 before:animate-pulse
            `}
          >
            <div className="flex items-start gap-3 relative z-10">
              <div className="mt-0.5 text-orange-500">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
                  <line x1="12" y1="9" x2="12" y2="13"></line>
                  <line x1="12" y1="17" x2="12.01" y2="17"></line>
                </svg>
              </div>
              <div>
                <h4 className="font-bold text-orange-500 uppercase tracking-wide text-xs mb-1">
                  Security Notice
                </h4>
                <p className="text-sm font-medium text-gray-200">{alert.message}</p>
              </div>
            </div>
            {/* Subtle glow overlay effect instead of intense glitch */}
            <div className="absolute inset-0 bg-orange-500/5 mix-blend-overlay pointer-events-none" />
          </div>
        ))}
      </div>
    </DarkHorseContext.Provider>
  );
};
