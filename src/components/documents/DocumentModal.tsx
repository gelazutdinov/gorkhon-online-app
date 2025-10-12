import Icon from "@/components/ui/icon";
import PrivacyPolicy from "./PrivacyPolicy";
import TermsOfUse from "./TermsOfUse";
import SecurityPolicy from "./SecurityPolicy";

interface DocumentModalProps {
  activeDocument: 'privacy' | 'terms' | 'security' | null;
  onClose: () => void;
}

const DocumentModal = ({ activeDocument, onClose }: DocumentModalProps) => {
  if (!activeDocument) return null;

  const documentTitles = {
    privacy: 'Политика конфиденциальности',
    terms: 'Правила пользования',
    security: 'Защита информации'
  };

  const documentIcons = {
    privacy: 'Shield',
    terms: 'FileText',
    security: 'Lock'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center bg-black/50" onClick={onClose}>
      <div 
        className="bg-white rounded-t-2xl md:rounded-2xl w-full md:w-[600px] md:max-w-2xl h-[90vh] md:max-h-[85vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b" style={{backgroundColor: '#F1117E'}}>
          <div className="flex items-center gap-3">
            <Icon 
              name={documentIcons[activeDocument]} 
              size={24} 
              className="text-white" 
            />
            <h3 className="font-semibold text-white">
              {documentTitles[activeDocument]}
            </h3>
          </div>
          <button onClick={onClose} className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors">
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="flex-1 p-6 overflow-y-auto">
          {activeDocument === 'privacy' && <PrivacyPolicy />}
          {activeDocument === 'terms' && <TermsOfUse />}
          {activeDocument === 'security' && <SecurityPolicy />}
        </div>

        <div className="p-4 border-t bg-gray-50">
          <button 
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-lg transition-colors font-medium"
          >
            Закрыть
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentModal;
