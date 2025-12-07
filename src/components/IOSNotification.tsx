import { useState, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface IOSNotificationProps {
  title: string;
  message: string;
  icon?: string;
  duration?: number;
  onClose?: () => void;
}

const IOSNotification = ({ 
  title, 
  message, 
  icon = "Bell", 
  duration = 4000,
  onClose 
}: IOSNotificationProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    // Плавное появление
    setTimeout(() => setIsVisible(true), 100);

    // Автоматическое скрытие
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, 300);
  };

  if (!isVisible && !isLeaving) return null;

  return (
    <div 
      className={`fixed top-4 right-4 z-[9999] transition-all duration-300 ${
        isVisible && !isLeaving 
          ? 'translate-y-0 opacity-100' 
          : '-translate-y-8 opacity-0'
      }`}
      style={{
        paddingTop: 'max(env(safe-area-inset-top, 0px), 0px)'
      }}
    >
      <div 
        className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-200/50 p-4 min-w-[300px] max-w-[380px] cursor-pointer active:scale-95 transition-transform"
        onClick={handleClose}
      >
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-gorkhon-pink to-gorkhon-pink/80 flex items-center justify-center shadow-lg shadow-gorkhon-pink/30">
            <Icon name={icon} size={20} className="text-white" />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <h4 className="font-semibold text-sm text-gray-900 truncate">
                {title}
              </h4>
              <span className="text-xs text-gray-500 flex-shrink-0">
                сейчас
              </span>
            </div>
            
            <p className="text-sm text-gray-600 leading-snug line-clamp-2">
              {message}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default IOSNotification;
