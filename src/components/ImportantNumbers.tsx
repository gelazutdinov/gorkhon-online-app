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
  const importantNumbers: ImportantNumber[] = [
    { name: "ФАП Горхон", person: "Аяна Анатольевна", phone: "89244563184", icon: "Phone" },
    { name: "Участковый", person: "Алексей", phone: "+7999-275-34-13", icon: "Shield" },
    { name: "Скорая помощь", person: "Служба экстренного вызова", phone: "112", icon: "Ambulance" },
    { name: "Диспетчер РЭС", person: "Электроснабжение", phone: "+73012344083", icon: "Zap" },
    { name: "МФЦ Заиграево", person: "Многофункциональный центр", phone: "+73013641101", icon: "Building" },
    { name: "Почта Горхон", person: "Юлия Паук", phone: "+89836307423", icon: "Mail" }
  ];

  const transitNumbers: ImportantNumber[] = [
    { name: "Диспетчер Город", person: "Заиграевский транзит", phone: "8-983-420-04-03", icon: "Bus" },
    { name: "Диспетчер Заиграево", person: "Заиграевский транзит", phone: "8-983-420-04-90", icon: "Bus" }
  ];

  return (
    <Card className="animate-slide-up rounded-3xl bg-gradient-to-br from-white via-blue-50/20 to-indigo-50/30 border-2 border-gorkhon-blue/20 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 group overflow-hidden relative">
      {/* Декоративные элементы */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-gorkhon-blue/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-gorkhon-green/5 rounded-full translate-y-12 -translate-x-12 group-hover:scale-125 transition-transform duration-700"></div>
      
      <CardHeader className="pb-6 relative z-10">
        <CardTitle className="flex items-center gap-4 text-gorkhon-blue">
          <div className="p-3 rounded-2xl bg-gradient-to-br from-gorkhon-blue/10 to-gorkhon-blue/20 animate-pulse-soft shadow-lg group-hover:scale-110 transition-transform duration-300">
            <Icon name="Phone" size={24} className="group-hover:rotate-12 transition-transform duration-300" />
          </div>
          <div>
            <span className="text-xl font-bold bg-gradient-to-r from-gorkhon-blue to-gorkhon-green bg-clip-text text-transparent">Важные номера</span>
            <p className="text-sm text-slate-600 font-medium mt-1">Всегда под рукой в трудную минуту</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 relative z-10">
        {importantNumbers.map((contact, index) => (
          <div key={index} className="group p-4 rounded-2xl bg-gradient-to-r from-white via-blue-50/30 to-indigo-50/20 hover:from-gorkhon-blue/10 hover:via-white hover:to-gorkhon-green/10 transition-all duration-500 border border-slate-200/60 hover:border-gorkhon-blue/40 hover:shadow-lg hover:-translate-y-0.5 relative overflow-hidden">
            {/* Анимированный фон */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gorkhon-blue/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            
            <div className="flex items-center justify-between gap-4 relative z-10">
              <div className="flex items-center gap-4 flex-1 min-w-0">
                <div className="p-3 rounded-2xl bg-gradient-to-br from-gorkhon-blue/15 via-gorkhon-blue/10 to-gorkhon-blue/5 group-hover:from-gorkhon-blue/25 group-hover:to-gorkhon-blue/15 transition-all duration-400 flex-shrink-0 shadow-md group-hover:shadow-lg">
                  <Icon name={contact.icon} size={18} className="text-gorkhon-blue group-hover:scale-125 group-hover:rotate-6 transition-all duration-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-base text-slate-800 group-hover:text-gorkhon-blue transition-colors duration-300 truncate">{contact.name}</p>
                  <p className="text-sm text-slate-600 group-hover:text-slate-700 transition-colors duration-300 truncate">{contact.person}</p>
                  <p className="text-xs text-gorkhon-blue/70 font-mono">{contact.phone}</p>
                </div>
              </div>
              <Button 
                size="sm" 
                className="bg-gradient-to-r from-gorkhon-green to-gorkhon-green/90 hover:from-gorkhon-green/90 hover:to-gorkhon-green text-white px-3 py-1.5 h-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-xs flex-shrink-0"
                onClick={() => window.open(`tel:${contact.phone}`, '_self')}
              >
                <Icon name="Phone" size={14} className="mr-1" />
                Звонок
              </Button>
            </div>
          </div>
        ))}
        
        {/* Заиграевский транзит section */}
        <div className="mt-4 pt-4 border-t border-slate-200/50">
          <div className="flex items-center gap-2 mb-3">
            <Icon name="Bus" size={16} className="text-gorkhon-orange" />
            <h4 className="font-bold text-gorkhon-orange">Заиграевский транзит</h4>
          </div>
          {transitNumbers.map((contact, index) => (
            <div key={index} className="group p-3 rounded-xl bg-gradient-to-r from-orange-50/50 to-amber-50/50 hover:from-gorkhon-orange/5 hover:to-gorkhon-orange/10 transition-all duration-300 border border-orange-200/50 hover:border-gorkhon-orange/20 hover:shadow-md mb-2">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="p-2 rounded-xl bg-gradient-to-br from-gorkhon-orange/10 to-gorkhon-orange/5 group-hover:from-gorkhon-orange/20 group-hover:to-gorkhon-orange/10 transition-all duration-300 flex-shrink-0">
                    <Icon name={contact.icon} size={16} className="text-gorkhon-orange group-hover:scale-110 transition-transform duration-300" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm text-slate-800 group-hover:text-gorkhon-orange transition-colors truncate">{contact.name}</p>
                    <p className="text-xs text-slate-600 truncate">{contact.person}</p>
                    <p className="text-xs text-gorkhon-orange/70 font-mono">{contact.phone}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="bg-gradient-to-r from-gorkhon-orange to-gorkhon-orange/90 hover:from-gorkhon-orange/90 hover:to-gorkhon-orange text-white px-3 py-1.5 h-8 rounded-lg shadow-sm hover:shadow-md transition-all duration-300 text-xs flex-shrink-0"
                  onClick={() => window.open(`tel:${contact.phone}`, '_self')}
                >
                  <Icon name="Phone" size={14} className="mr-1" />
                  Звонок
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