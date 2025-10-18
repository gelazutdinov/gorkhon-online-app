import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface HelpItem {
  title: string;
  description: string;
  contact: string;
  icon: string;
}

const DonationSection = () => {
  const [helpItems, setHelpItems] = useState<HelpItem[]>([]);

  const defaultData = [
    {
      title: "ФОНД поселка",
      description: "Ирина Н.П - Обязательно пишем 'ФОНД поселка'",
      contact: "408 178 109 091 606 626 11",
      icon: "Home"
    },
    {
      title: "Помощь церкви ⛪️",
      description: "Голофаева В. - Поддержка храма",
      contact: "89024562839",
      icon: "Heart"
    },
    {
      title: "Помощь бойцам 🪖",
      description: "Олеся Николаевна Н. - В теме: 'Помощь Бойцам'",
      contact: "89246210100",
      icon: "Shield"
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      loadData();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadData = () => {
    try {
      const savedContent = localStorage.getItem('homePageContent');
      if (savedContent) {
        const content = JSON.parse(savedContent);
        if (content.helpItems && content.helpItems.length > 0) {
          setHelpItems(content.helpItems);
        } else {
          setHelpItems(defaultData);
        }
      } else {
        setHelpItems(defaultData);
      }
    } catch (error) {
      setHelpItems(defaultData);
    }
  };

  const getGradient = (index: number) => {
    const gradients = ['bg-gradient-blue', 'bg-gradient-warm', 'bg-gradient-brand'];
    return gradients[index % gradients.length];
  };

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
        {helpItems.map((item, index) => (
          <div key={index} className={`group p-4 md:p-5 rounded-lg md:rounded-2xl ${getGradient(index)} text-white relative overflow-hidden transition-all duration-300`}>
            {/* Floating decorative elements только на десктопе */}
            <div className="hidden md:block absolute top-2 right-4 w-12 h-12 bg-white/10 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
            <div className="hidden md:block absolute bottom-2 left-4 w-8 h-8 bg-white/5 rounded-full opacity-30 group-hover:opacity-50 transition-opacity"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                <div className="p-2 rounded-full bg-white/20 flex-shrink-0">
                  <Icon name={item.icon as any} size={18} className="md:w-5 md:h-5" />
                </div>
                <h4 className="font-bold text-sm md:text-lg truncate">{item.title}</h4>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <Icon name="Info" size={14} className="opacity-80 flex-shrink-0 mt-0.5" />
                  <p className="text-xs md:text-sm opacity-90">{item.description}</p>
                </div>
                
                <div className="bg-white/20 backdrop-blur-sm p-2 md:p-3 rounded-lg md:rounded-xl border border-white/30">
                  <p className="text-xs md:text-sm font-mono text-center tracking-wide md:tracking-wider font-semibold break-all">
                    {item.contact}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
        

        
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