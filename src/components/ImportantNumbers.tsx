import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface ImportantNumber {
  name: string;
  person: string;
  phone: string;
  icon: string;
}

const ImportantNumbers = () => {
  const [importantNumbers, setImportantNumbers] = useState<ImportantNumber[]>([]);
  const [transitNumbers, setTransitNumbers] = useState<ImportantNumber[]>([]);

  // Загружаем данные из localStorage или используем дефолтные
  useEffect(() => {
    try {
      const savedContent = localStorage.getItem('homePageContent');
      if (savedContent) {
        const content = JSON.parse(savedContent);
        setImportantNumbers(content.importantNumbers || []);
        setTransitNumbers(content.transitNumbers || []);
      } else {
        // Дефолтные данные, если нет сохраненных
        setImportantNumbers([
          { name: "ФАП Горхон", person: "Аяна Анатольевна", phone: "89244563184", icon: "Phone" },
          { name: "Участковый", person: "Алексей", phone: "+7999-275-34-13", icon: "Shield" },
          { name: "Скорая помощь", person: "Служба экстренного вызова", phone: "112", icon: "Ambulance" },
          { name: "Диспетчер РЭС", person: "Электроснабжение", phone: "+73012344083", icon: "Zap" },
          { name: "МФЦ Заиграево", person: "Многофункциональный центр", phone: "+73013641101", icon: "Building" },
          { name: "Почта Горхон", person: "Юлия Паук", phone: "+89836307423", icon: "Mail" },
          { name: "ЕДДС района", person: "Служба экстренного реагирования", phone: "83013641414", icon: "AlertTriangle" }
        ]);
        
        setTransitNumbers([
          { name: "Диспетчер Город", person: "Заиграевский транзит", phone: "8-983-420-04-03", icon: "Bus" },
          { name: "Диспетчер Заиграево", person: "Заиграевский транзит", phone: "8-983-420-04-90", icon: "Bus" }
        ]);
      }
    } catch (error) {
      console.error('Ошибка загрузки важных номеров:', error);
      // Используем дефолтные данные в случае ошибки
      setImportantNumbers([
        { name: "ФАП Горхон", person: "Аяна Анатольевна", phone: "89244563184", icon: "Phone" },
        { name: "Участковый", person: "Алексей", phone: "+7999-275-34-13", icon: "Shield" },
        { name: "Скорая помощь", person: "Служба экстренного вызова", phone: "112", icon: "Ambulance" },
        { name: "Диспетчер РЭС", person: "Электроснабжение", phone: "+73012344083", icon: "Zap" },
        { name: "МФЦ Заиграево", person: "Многофункциональный центр", phone: "+73013641101", icon: "Building" },
        { name: "Почта Горхон", person: "Юлия Паук", phone: "+89836307423", icon: "Mail" },
        { name: "ЕДДС района", person: "Служба экстренного реагирования", phone: "83013641414", icon: "AlertTriangle" }
      ]);
      
      setTransitNumbers([
        { name: "Диспетчер Город", person: "Заиграевский транзит", phone: "8-983-420-04-03", icon: "Bus" },
        { name: "Диспетчер Заиграево", person: "Заиграевский транзит", phone: "8-983-420-04-90", icon: "Bus" }
      ]);
    }
  }, []);

  // Слушаем изменения в localStorage для живого обновления
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'homePageContent') {
        try {
          if (e.newValue) {
            const content = JSON.parse(e.newValue);
            setImportantNumbers(content.importantNumbers || []);
            setTransitNumbers(content.transitNumbers || []);
          }
        } catch (error) {
          console.error('Ошибка обновления данных:', error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Card className="rounded-lg md:rounded-3xl bg-white border border-gray-200 md:border-gorkhon-blue/20 shadow-sm md:shadow-xl transition-all duration-300 overflow-hidden relative">
      {/* Декоративные элементы только на десктопе */}
      <div className="hidden md:block absolute top-0 right-0 w-32 h-32 bg-gorkhon-blue/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
      <div className="hidden md:block absolute bottom-0 left-0 w-24 h-24 bg-gorkhon-green/5 rounded-full translate-y-12 -translate-x-12 group-hover:scale-125 transition-transform duration-700"></div>
      
      <CardHeader className="p-4 md:pb-6 relative z-10">
        <CardTitle className="flex items-center gap-3 md:gap-4 text-gorkhon-blue">
          <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-gorkhon-blue/10 md:bg-gradient-to-br md:from-gorkhon-blue/10 md:to-gorkhon-blue/20 flex-shrink-0">
            <Icon name="Phone" size={20} className="md:w-6 md:h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-lg md:text-xl font-bold text-gorkhon-blue md:bg-gradient-to-r md:from-gorkhon-blue md:to-gorkhon-green md:bg-clip-text md:text-transparent">Важные номера</span>
            <p className="text-xs md:text-sm text-slate-600 font-medium mt-0.5 md:mt-1 hidden sm:block">Всегда под рукой в трудную минуту</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 md:p-6 space-y-2 md:space-y-4 relative z-10">
        {importantNumbers.map((contact, index) => (
          <div key={index} className="group p-3 md:p-4 rounded-lg md:rounded-2xl bg-gray-50 md:bg-gradient-to-r md:from-white md:via-blue-50/30 md:to-indigo-50/20 hover:bg-gray-100 md:hover:from-gorkhon-blue/10 md:hover:via-white md:hover:to-gorkhon-green/10 transition-all duration-300 border border-gray-200 md:border-slate-200/60 md:hover:border-gorkhon-blue/40 md:hover:shadow-lg relative overflow-hidden">
            {/* Анимированный фон только на десктопе */}
            <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-gorkhon-blue/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            
            <div className="flex items-center gap-2 md:gap-4 relative z-10 w-full">
              <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0 overflow-hidden">
                <div className="p-2 md:p-3 rounded-lg md:rounded-2xl bg-gorkhon-blue/10 md:bg-gradient-to-br md:from-gorkhon-blue/15 md:via-gorkhon-blue/10 md:to-gorkhon-blue/5 flex-shrink-0">
                  <Icon name={contact.icon} size={16} className="md:w-[18px] md:h-[18px] text-gorkhon-blue" />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="font-bold text-sm md:text-base text-slate-800 truncate">{contact.name}</p>
                  <p className="text-xs md:text-sm text-slate-600 truncate">{contact.person}</p>
                  <p className="text-xs text-gorkhon-blue/70 font-mono truncate">{contact.phone}</p>
                </div>
              </div>
              <Button 
                size="sm" 
                className="bg-gorkhon-green hover:bg-gorkhon-green/90 text-white px-2 py-2 h-10 md:h-8 rounded-lg text-xs flex-shrink-0 w-10 md:w-auto md:px-3 touch-none"
                onClick={() => window.open(`tel:${contact.phone}`, '_self')}
              >
                <Icon name="Phone" size={14} />
                <span className="hidden md:inline ml-1">Звонок</span>
              </Button>
            </div>
          </div>
        ))}
        
        {/* Заиграевский транзит section */}
        <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-2 md:mb-3">
            <Icon name="Bus" size={16} className="text-gorkhon-orange" />
            <h4 className="font-bold text-sm md:text-base text-gorkhon-orange">Заиграевский транзит</h4>
          </div>
          {transitNumbers.map((contact, index) => (
            <div key={index} className="group p-2 md:p-3 rounded-lg md:rounded-xl bg-orange-50 md:bg-gradient-to-r md:from-orange-50/50 md:to-amber-50/50 hover:bg-orange-100 md:hover:from-gorkhon-orange/5 md:hover:to-gorkhon-orange/10 transition-all duration-300 border border-orange-200 md:border-orange-200/50 md:hover:border-gorkhon-orange/20 mb-2">
              <div className="flex items-center gap-2 md:gap-3 w-full">
                <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0 overflow-hidden">
                  <div className="p-2 rounded-lg md:rounded-xl bg-gorkhon-orange/10 flex-shrink-0">
                    <Icon name={contact.icon} size={16} className="text-gorkhon-orange" />
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="font-semibold text-xs md:text-sm text-slate-800 truncate">{contact.name}</p>
                    <p className="text-xs text-slate-600 truncate">{contact.person}</p>
                    <p className="text-xs text-gorkhon-orange/70 font-mono truncate">{contact.phone}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="bg-gorkhon-orange hover:bg-gorkhon-orange/90 text-white px-2 py-2 h-10 md:h-8 rounded-lg text-xs flex-shrink-0 w-10 md:w-auto md:px-3 touch-none"
                  onClick={() => window.open(`tel:${contact.phone}`, '_self')}
                >
                  <Icon name="Phone" size={14} />
                  <span className="hidden md:inline ml-1">Звонок</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
        

      </CardContent>
    </Card>
  );
};

export default ImportantNumbers;