import { ReactNode } from 'react';
import Icon from '@/components/ui/icon';

interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl';
}

const ResponsiveModal = ({ isOpen, onClose, title, children, maxWidth = 'md' }: ResponsiveModalProps) => {
  if (!isOpen) return null;

  const maxWidthClass = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md', 
    lg: 'sm:max-w-lg',
    xl: 'sm:max-w-xl'
  }[maxWidth];

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-md" onClick={onClose}></div>
      <div className={`relative bg-white/95 backdrop-blur-xl rounded-t-2xl sm:rounded-2xl w-full ${maxWidthClass} max-h-[90vh] sm:max-h-[75vh] overflow-y-auto shadow-2xl border border-white/20`}>
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 sticky top-0 bg-white/95 backdrop-blur-xl">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors active:scale-95"
          >
            <Icon name="X" size={20} className="text-gray-500" />
          </button>
        </div>
        
        <div className="p-4 sm:p-6 safe-area-bottom">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ResponsiveModal;