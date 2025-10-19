import Icon from '@/components/ui/icon';

interface ChannelProfileProps {
  isOpen: boolean;
  onClose: () => void;
  onEnableNotifications: () => void;
}

const ChannelProfile = ({ isOpen, onClose, onEnableNotifications }: ChannelProfileProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-[#E8EDF2]" style={{ fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      <div className="flex items-center p-4 bg-white border-b border-gray-200">
        <button onClick={onClose} className="flex items-center gap-1 text-[#0088CC] text-base">
          <Icon name="ChevronLeft" size={24} />
          <span>Назад</span>
        </button>
      </div>

      <div className="bg-gradient-to-b from-white to-[#E8EDF2] pb-6">
        <div className="flex flex-col items-center pt-8 pb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden bg-white shadow-md mb-4">
            <img 
              src="https://cdn.poehali.dev/files/538a3c94-c9c4-4488-9214-dc9493fadb43.png" 
              alt="Горхон.Online"
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-semibold text-gray-900">Горхон.Online</h1>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#0088CC"/>
              <path d="M17 8.5L10.5 15L7 11.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          
          <p className="text-sm text-gray-500">@gorhon_online</p>
        </div>

        <div className="px-4 grid grid-cols-2 gap-3 mb-6">
          <button 
            onClick={onEnableNotifications}
            className="bg-white rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm active:bg-gray-50 transition-colors"
          >
            <Icon name="Bell" size={28} className="text-[#0088CC]" />
            <span className="text-[#0088CC] text-sm font-medium">звук</span>
          </button>
          
          <button className="bg-white rounded-xl p-4 flex flex-col items-center gap-2 shadow-sm active:bg-gray-50 transition-colors">
            <Icon name="Search" size={28} className="text-[#0088CC]" />
            <span className="text-[#0088CC] text-sm font-medium">поиск</span>
          </button>
        </div>

        <div className="bg-white mx-4 rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-gray-100">
            <div className="flex items-start gap-3">
              <Icon name="Info" size={20} className="text-gray-500 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm text-gray-600 leading-relaxed">
                  Официальный канал платформы Горхон.Online. Здесь публикуются новости, обновления и важная информация о сервисе.
                </p>
                <a href="https://t.me/gorhon_online" target="_blank" rel="noopener noreferrer" className="text-sm text-[#0088CC] font-medium mt-2 inline-block">https://t.me/gorhon_online</a>
              </div>
            </div>
          </div>

          <button className="w-full p-4 flex items-center gap-3 active:bg-gray-50 transition-colors">
            <Icon name="Share2" size={20} className="text-gray-500" />
            <span className="text-base text-gray-900">Поделиться</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChannelProfile;