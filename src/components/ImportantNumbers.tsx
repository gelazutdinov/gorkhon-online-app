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
          { name: "Миграционная служба ГАИ", person: "Пн 9:00-12:30, Вт-Чт 9:00-15:00, Пт выходной", phone: "8-3013-64-15-70", icon: "Car" },
          { name: "Ветеринарная станция Заиграевская", person: "Ветеринарная помощь", phone: "8-902-161-22-48", icon: "Heart" },
          { name: "Администрация Горхон", person: "Администрация поселка", phone: "89024536722", icon: "Building" },
          { name: "ТСЖ Зелёная Долина", person: "Товарищество собственников жилья", phone: "89148557535", icon: "Home" },
          { name: "Кафе Бууза", person: "Общественное питание", phone: "89243950828", icon: "UtensilsCrossed" },
          { name: "Магазин Империя", person: "Продуктовый магазин", phone: "89148383500", icon: "ShoppingCart" },
          { name: "Барановская Оксана Александровна", person: "Председатель ТОС", phone: "89503872086", icon: "Users" },
          { name: "Бальжинимаева Дулма Батожаргаловна", person: "Глава сельского поселения", phone: "89243992214", icon: "UserCheck" }
        ]);
        
        setTransitNumbers([
          { name: "Диспетчер Город", person: "Заиграевский транзит", phone: "8-983-420-04-03", icon: "Bus" },
          { name: "Диспетчер Заиграево", person: "Заиграевский транзит", phone: "8-983-420-04-90", icon: "Bus" }
        ]);
      }
    } catch (error) {
      // Используем дефолтные данные в случае ошибки
      setImportantNumbers([
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
        { name: "Миграционная служба ГАИ", person: "Пн 9:00-12:30, Вт-Чт 9:00-15:00, Пт выходной", phone: "8-3013-64-15-70", icon: "Car" },
        { name: "Ветеринарная станция Заиграевская", person: "Ветеринарная помощь", phone: "8-902-161-22-48", icon: "Heart" },
        { name: "Администрация Горхон", person: "Администрация поселка", phone: "89024536722", icon: "Building" },
        { name: "ТСЖ Зелёная Долина", person: "Товарищество собственников жилья", phone: "89148557535", icon: "Home" },
        { name: "Кафе Бууза", person: "Общественное питание", phone: "89243950828", icon: "UtensilsCrossed" },
        { name: "Магазин Империя", person: "Продуктовый магазин", phone: "89148383500", icon: "ShoppingCart" },
        { name: "Барановская Оксана Александровна", person: "Председатель ТОС", phone: "89503872086", icon: "Users" },
        { name: "Бальжинимаева Дулма Батожаргаловна", person: "Глава сельского поселения", phone: "89243992214", icon: "UserCheck" }
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
    <Card className="rounded-2xl md:rounded-3xl bg-gradient-to-br from-white to-gray-50 border-0 shadow-sm transition-all duration-300">
      <CardHeader className="p-5 md:p-7 border-b-0 bg-gradient-to-r from-gorkhon-blue/5 to-transparent">
        <CardTitle className="flex items-center gap-3 md:gap-4">
          <div className="p-3 md:p-3.5 rounded-2xl bg-gradient-to-br from-gorkhon-blue to-gorkhon-blue/80 shadow-lg shadow-gorkhon-blue/20 flex-shrink-0">
            <Icon name="Phone" size={22} className="md:w-7 md:h-7 text-white" />
          </div>
          <div className="min-w-0">
            <span className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Важные номера</span>
            <p className="text-xs md:text-sm text-gray-600 font-medium mt-1 md:mt-1.5 hidden sm:block">Всегда под рукой в трудную минуту</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-7 space-y-2.5 md:space-y-3">
        {importantNumbers.map((contact, index) => (
          <div key={index} className="group p-3.5 md:p-5 rounded-2xl bg-white hover:bg-gradient-to-r hover:from-white hover:to-gray-50 transition-all duration-300 border border-gray-100 hover:border-gorkhon-blue/30 hover:shadow-md hover:scale-[1.02]">
            <div className="flex items-center gap-3 md:gap-4 w-full">
              <div className="flex items-center gap-3 md:gap-3.5 flex-1 min-w-0 overflow-hidden">
                <div className="p-2.5 md:p-3 rounded-xl bg-gradient-to-br from-gorkhon-blue/10 to-gorkhon-blue/5 border border-gorkhon-blue/10 flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <Icon name={contact.icon} size={18} className="md:w-5 md:h-5 text-gorkhon-blue" />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <p className="font-bold text-sm md:text-base text-gray-900 truncate">{contact.name}</p>
                  <p className="text-xs md:text-sm text-gray-600 truncate mt-0.5">{contact.person}</p>
                  {contact.phone && <p className="text-xs text-gray-500 font-mono truncate mt-1">{contact.phone}</p>}
                </div>
              </div>
              {contact.phone && (
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-gorkhon-pink to-gorkhon-pink/90 hover:from-gorkhon-pink/90 hover:to-gorkhon-pink text-white px-2 py-2 h-11 md:h-10 rounded-xl text-xs flex-shrink-0 w-11 md:w-auto md:px-5 touch-none shadow-lg shadow-gorkhon-pink/25 hover:shadow-xl hover:shadow-gorkhon-pink/30 hover:scale-105 transition-all duration-300"
                  onClick={() => window.open(`tel:${contact.phone}`, '_self')}
                >
                  <Icon name="Phone" size={16} className="md:w-4 md:h-4" />
                  <span className="hidden md:inline ml-2 font-semibold">Позвонить</span>
                </Button>
              )}
            </div>
          </div>
        ))}
        
        <div className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <div className="p-1.5 rounded-lg bg-gorkhon-blue/10">
              <Icon name="Bus" size={16} className="text-gorkhon-blue" />
            </div>
            <h4 className="font-bold text-sm md:text-base text-gray-900">Заиграевский транзит</h4>
          </div>
          {transitNumbers.map((contact, index) => (
            <div key={index} className="group p-3 md:p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-all duration-200 border border-gray-200 hover:border-gray-300 mb-2">
              <div className="flex items-center gap-2 md:gap-4 w-full">
                <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0 overflow-hidden">
                  <div className="p-2 md:p-2.5 rounded-lg bg-white border border-gray-200 flex-shrink-0">
                    <Icon name={contact.icon} size={16} className="md:w-[18px] md:h-[18px] text-gorkhon-blue" />
                  </div>
                  <div className="flex-1 min-w-0 overflow-hidden">
                    <p className="font-semibold text-sm md:text-base text-gray-900 truncate">{contact.name}</p>
                    <p className="text-xs md:text-sm text-gray-500 truncate">{contact.person}</p>
                    <p className="text-xs text-gray-600 font-mono truncate mt-0.5">{contact.phone}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="bg-gorkhon-pink hover:bg-gorkhon-pink/90 text-white px-2 py-2 h-10 md:h-9 rounded-xl text-xs flex-shrink-0 w-10 md:w-auto md:px-4 touch-none shadow-sm"
                  onClick={() => window.open(`tel:${contact.phone}`, '_self')}
                >
                  <Icon name="Phone" size={14} />
                  <span className="hidden md:inline ml-1.5">Позвонить</span>
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