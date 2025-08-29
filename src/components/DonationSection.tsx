import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const DonationSection = () => {
  const [donationSettings, setDonationSettings] = useState({
    text: 'Помощь семье',
    goal: 100000,
    current: 45000
  });

  useEffect(() => {
    // Загружаем настройки пожертвований из localStorage
    try {
      const savedContent = localStorage.getItem('homePageContent');
      if (savedContent) {
        const content = JSON.parse(savedContent);
        if (content.donationText && content.donationGoal && content.donationCurrent !== undefined) {
          setDonationSettings({
            text: content.donationText,
            goal: content.donationGoal,
            current: content.donationCurrent
          });
        }
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек пожертвований:', error);
    }
  }, []);

  const donationData = [
    {
      title: "ФОНД поселка",
      recipient: "Ирина Н.П",
      account: "408 178 109 091 606 626 11",
      note: "Обязательно пишем 'ФОНД поселка'",
      icon: "Home",
      gradient: "bg-gradient-blue"
    },
    {
      title: "Помощь церкви ⛪️",
      recipient: "Голофаева В.",
      account: "89024562839",
      note: "Поддержка храма",
      icon: "Heart",
      gradient: "bg-gradient-warm"
    },
    {
      title: "Помощь бойцам 🪖",
      recipient: "Олеся Николаевна Н.",
      account: "89246210100",
      note: "В теме: 'Помощь Бойцам'",
      icon: "Shield",
      gradient: "bg-gradient-brand"
    }
  ];

  return (
    <Card className="rounded-lg md:rounded-2xl bg-white md:bg-gradient-to-br md:from-white md:to-green-50/30 border border-gray-200 md:border-2 md:border-gorkhon-green/10 shadow-sm md:shadow-lg transition-all duration-300">
      <CardHeader className="p-4 md:pb-4">
        <CardTitle className="flex items-center gap-3 text-gorkhon-green">
          <div className="p-2 rounded-lg md:rounded-full bg-gorkhon-green/10 flex-shrink-0">
            <Icon name="Heart" size={18} className="md:w-5 md:h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-base md:text-lg font-bold">Помощь поселку</span>
            <p className="text-xs md:text-sm text-slate-600 font-normal hidden sm:block">Вместе мы сильнее!</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 md:p-6 space-y-3 md:space-y-4">
        {donationData.map((donation, index) => (
          <div key={index} className={`group p-4 md:p-5 rounded-lg md:rounded-2xl ${donation.gradient} text-white relative overflow-hidden transition-all duration-300`}>
            {/* Floating decorative elements только на десктопе */}
            <div className="hidden md:block absolute top-2 right-4 w-12 h-12 bg-white/10 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="hidden md:block absolute bottom-2 left-4 w-8 h-8 bg-white/5 rounded-full opacity-30 group-hover:opacity-50 transition-opacity"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                <div className="p-2 rounded-full bg-white/20 flex-shrink-0">
                  <Icon name={donation.icon as any} size={18} className="md:w-5 md:h-5" />
                </div>
                <h4 className="font-bold text-sm md:text-lg truncate">{donation.title.replace(/⛪️|🪖/g, '').trim()}</h4>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Icon name="User" size={14} className="opacity-80 flex-shrink-0" />
                  <p className="text-xs md:text-sm opacity-90 truncate">{donation.recipient}</p>
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm p-2 md:p-3 rounded-lg md:rounded-xl border border-white/30">
                  <p className="text-xs md:text-sm font-mono text-center tracking-wide md:tracking-wider font-semibold break-all">
                    {donation.account}
                  </p>
                </div>
                
                <div className="flex items-start gap-2 mt-2 md:mt-3">
                  <Icon name="Info" size={12} className="opacity-70 mt-0.5 flex-shrink-0" />
                  <p className="text-xs opacity-80 leading-relaxed">{donation.note}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {/* Прогресс-бар активного сбора */}
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200/50">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-orange-800">
              <Icon name="Target" size={16} />
              <p className="text-sm font-semibold">{donationSettings.text}</p>
            </div>
            <p className="text-xs text-orange-700 font-medium">
              {Math.round((donationSettings.current / donationSettings.goal) * 100)}%
            </p>
          </div>
          
          {/* Прогресс-бар */}
          <div className="w-full bg-orange-200/50 rounded-full h-2 mb-3">
            <div
              className="bg-gradient-to-r from-orange-500 to-red-600 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${Math.min((donationSettings.current / donationSettings.goal) * 100, 100)}%` }}
            ></div>
          </div>
          
          <div className="flex items-center justify-between text-xs">
            <span className="text-orange-700">Собрано: <span className="font-semibold">{donationSettings.current.toLocaleString()} ₽</span></span>
            <span className="text-orange-700">Цель: <span className="font-semibold">{donationSettings.goal.toLocaleString()} ₽</span></span>
          </div>
        </div>
        
        <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-emerald-50 to-green-50 border border-emerald-200/50">
          <div className="flex items-center gap-2 text-emerald-800 mb-2">
            <Icon name="Users" size={16} />
            <p className="text-sm font-semibold">Благодарим за поддержку!</p>
          </div>
          <p className="text-xs text-emerald-700">Каждый вклад делает наш поселок лучше и уютнее для всех жителей</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DonationSection;