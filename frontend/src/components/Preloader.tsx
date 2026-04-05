import { useEffect, useState } from 'react';

export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => {
      setFadeOut(true);
    }, 1200);

    const hideTimer = setTimeout(() => {
      setIsVisible(false);
    }, 1500);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div 
      className={`fixed inset-0 z-50 bg-surface flex items-center justify-center transition-opacity duration-300 ${
        fadeOut ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="relative">
        <div className="absolute inset-0 animate-ping opacity-20">
          <img 
            src="/images/logo.png" 
            alt="General Study" 
            className="w-24 h-24"
          />
        </div>
        <img 
          src="/images/logo.png" 
          alt="General Study" 
          className="w-24 h-24 animate-pulse relative z-10"
        />
      </div>
    </div>
  );
}
