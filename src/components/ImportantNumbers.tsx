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
          { name: "Скорая помощь (новый)", person: "Дополнительный номер", phone: "73013645103", icon: "Ambulance" },
          { name: "Диспетчер РЭС", person: "Электроснабжение", phone: "+73012344083", icon: "Zap" },
          { name: "МФЦ Заиграево", person: "Многофункциональный центр", phone: "+73013641101", icon: "Building" },
          { name: "Соц.защита Заиграево", person: "Социальная защита населения", phone: "+73013641220", icon: "Heart" },
          { name: "Регистратура поликлиники", person: "Заиграево", phone: "+79245559003", icon: "Stethoscope" },
          { name: "Нотариус Заиграево", person: "Нотариальные услуги", phone: "+73013641614", icon: "FileText" },
          { name: "Судебные приставы", person: "Заиграевский район", phone: "83013641010", icon: "Scale" },
          { name: "Вакуумная машина", person: "Кондаков К.Ю., Горхон", phone: "+79834539902", icon: "Truck" },
          { name: "Почта Горхон", person: "Елена", phone: "8-914-843-45-93", icon: "Mail" },
          { name: "Миграционная служба ГАИ", person: "Пн 9:00-12:30, Вт-Чт 9:00-15:00, Пт выходной", phone: "8-3013-64-15-70", icon: "Car" }
        ]);
        
        setTransitNumbers([
          { name: "Диспетчер Город", person: "Заиграевский транзит", phone: "8-983-420-04-03", icon: "Bus" },
          { name: "Диспетчер Заиграево", person: "Заиграевский транзит", phone: "8-983-420-04-90", icon: "Bus" }
        ]);
      }
    } catch (error) {
      // Используем дефолтные данные в случае ошибки
      setImportantNumbers([
        { name: "ФАП Горхон", person: "Аяна Анатольевна", phone: "89244563184", icon: "Phone" },
        { name: "Участковый", person: "Алексей", phone: "+7999-275-34-13", icon: "Shield" },
        { name: "Скорая помощь", person: "Служба экстренного вызова", phone: "112", icon: "Ambulance" },
        { name: "Скорая помощь (новый)", person: "Дополнительный номер", phone: "73013645103", icon: "Ambulance" },
        { name: "Диспетчер РЭС", person: "Электроснабжение", phone: "+73012344083", icon: "Zap" },
        { name: "МФЦ Заиграево", person: "Многофункциональный центр", phone: "+73013641101", icon: "Building" },
        { name: "Соц.защита Заиграево", person: "Социальная защита населения", phone: "+73013641220", icon: "Heart" },
        { name: "Регистратура поликлиники", person: "Заиграево", phone: "+79245559003", icon: "Stethoscope" },
        { name: "Нотариус Заиграево", person: "Нотариальные услуги", phone: "+73013641614", icon: "FileText" },
        { name: "Судебные приставы", person: "Заиграевский район", phone: "83013641010", icon: "Scale" },
        { name: "Вакуумная машина", person: "Кондаков К.Ю., Горхон", phone: "+79834539902", icon: "Truck" },
        { name: "Почта Горхон", person: "Елена", phone: "8-914-843-45-93", icon: "Mail" },
        { name: "Миграционная служба ГАИ", person: "Пн 9:00-12:30, Вт-Чт 9:00-15:00, Пт выходной", phone: "8-3013-64-15-70", icon: "Car" }
      ]);
      
      setTransitNumbers([
        { name: "Диспетчер Город", person: "Заиграевский транзит", phone: "8-983-420-04-03", icon: "Bus" },
        { name: "Диспетчер Заиграево", person: "Заиграевский транзит", phone: "8-983-420-04-90", icon: "Bus" }
      ]);
    }
  }, []);

  // Слушаем изменения в localStorage для живого обновления
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const savedContent = localStorage.getItem('homePageContent');
        if (savedContent) {
          const content = JSON.parse(savedContent);
          setImportantNumbers(content.importantNumbers || []);
          setTransitNumbers(content.transitNumbers || []);
        }
      } catch (error) {
        console.error('Ошибка обновления данных:', error);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  return (
    <Card className="rounded-lg md:rounded-3xl bg-gradient-to-br from-white via-blue-50/30 to-purple-50/20 border border-gorkhon-pink/30 shadow-sm md:shadow-xl transition-all duration-300 overflow-hidden relative">
      <div className="hidden md:block absolute top-0 right-0 w-32 h-32 bg-gorkhon-blue/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
      <div className="hidden md:block absolute bottom-0 left-0 w-24 h-24 bg-gorkhon-pink/10 rounded-full translate-y-12 -translate-x-12 group-hover:scale-125 transition-transform duration-700"></div>
      
      <CardHeader className="p-4 md:pb-6 relative z-10">
        <CardTitle className="flex items-center gap-3 md:gap-4">
          <div className="p-2 md:p-3 rounded-xl md:rounded-2xl bg-gradient-to-br from-gorkhon-blue/15 to-gorkhon-pink/15 flex-shrink-0">
            <Icon name="Phone" size={20} className="md:w-6 md:h-6 text-gorkhon-blue" />
          </div>
          <div className="min-w-0">
            <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-gorkhon-blue via-gorkhon-pink to-purple-600 bg-clip-text text-transparent">Важные номера</span>
            <p className="text-xs md:text-sm text-gray-600 font-medium mt-0.5 md:mt-1 hidden sm:block">Всегда под рукой в трудную минуту</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 md:p-6 space-y-2 md:space-y-4 relative z-10">
        {importantNumbers.map((contact, index) => (
          <div key={index} className="group p-3 md:p-4 rounded-lg md:rounded-2xl bg-gradient-to-r from-white via-blue-50/20 to-purple-50/10 hover:from-gorkhon-blue/5 hover:via-blue-50/40 hover:to-purple-50/30 transition-all duration-300 border border-gorkhon-pink/20 hover:border-gorkhon-blue/30 hover:shadow-lg relative overflow-hidden">
            <div className="hidden md:block absolute inset-0 bg-gradient-to-r from-transparent via-gorkhon-pink/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            
            <div className="flex items-center gap-2 md:gap-4 relative z-10 w-full">
              <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0 overflow-hidden">
                <div className="p-2 md:p-3 rounded-lg md:rounded-2xl bg-gradient-to-br from-gorkhon-blue/15 to-gorkhon-pink/15 flex-shrink-0">
                  <Icon name={contact.icon} size={16} className="md:w-[18px] md:h-[18px] text-gorkhon-blue" />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="font-bold text-sm md:text-base text-gorkhon-blue truncate">{contact.name}</p>
                  <p className="text-xs md:text-sm text-gray-600 truncate">{contact.person}</p>
                  {contact.phone && <p className="text-xs text-gorkhon-pink font-mono truncate">{contact.phone}</p>}


                </div>
              </div>
              {contact.phone && (
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-gorkhon-blue to-gorkhon-pink hover:from-gorkhon-blue/90 hover:to-gorkhon-pink/90 text-white px-2 py-2 h-10 md:h-8 rounded-lg text-xs flex-shrink-0 w-10 md:w-auto md:px-3 touch-none shadow-md"
                  onClick={() => window.open(`tel:${contact.phone}`, '_self')}
                >
                  <Icon name="Phone" size={14} />
                  <span className="hidden md:inline ml-1">Звонок</span>
                </Button>
              )}
            </div>
          </div>
        ))}
        
        <div className="mt-3 md:mt-4 pt-3 md:pt-4 border-t border-gorkhon-pink/30 relative">
          <div className="flex items-center gap-2 mb-2 md:mb-3">
            <Icon name="Bus" size={16} className="text-gorkhon-pink" />
            <h4 className="font-bold text-sm md:text-base text-gorkhon-pink">Заиграевский транзит</h4>
          </div>
          {transitNumbers.map((contact, index) => (
            <div key={index} className="group p-2 md:p-3 rounded-lg md:rounded-xl bg-gradient-to-r from-blue-50/50 to-purple-50/50 hover:from-gorkhon-blue/10 hover:to-gorkhon-pink/10 transition-all duration-300 border border-gorkhon-blue/30 hover:border-gorkhon-pink/40 mb-2 shadow-sm">
              <div className="flex items-center gap-2 md:gap-3 w-full">
                <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0 overflow-hidden">
                  <div className="p-2 rounded-lg md:rounded-xl bg-gradient-to-br from-gorkhon-pink/15 to-gorkhon-blue/15 flex-shrink-0">
                    <Icon name={contact.icon} size={16} className="text-gorkhon-pink" />
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="font-semibold text-xs md:text-sm text-gorkhon-blue truncate">{contact.name}</p>
                    <p className="text-xs text-gray-600 truncate">{contact.person}</p>
                    <p className="text-xs text-gorkhon-pink font-mono truncate">{contact.phone}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-gorkhon-pink to-gorkhon-blue hover:from-gorkhon-pink/90 hover:to-gorkhon-blue/90 text-white px-2 py-2 h-10 md:h-8 rounded-lg text-xs flex-shrink-0 w-10 md:w-auto md:px-3 touch-none shadow-md"
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