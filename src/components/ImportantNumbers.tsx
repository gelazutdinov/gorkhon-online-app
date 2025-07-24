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

  return (
    <Card className="animate-fade-in rounded-2xl bg-gradient-to-br from-white to-blue-50/30 border-2 border-gorkhon-blue/10 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-gorkhon-blue">
          <div className="p-2 rounded-full bg-gorkhon-blue/10 animate-pulse">
            <Icon name="Phone" size={20} />
          </div>
          <div>
            <span className="text-lg font-bold">Важные номера</span>
            <p className="text-sm text-slate-600 font-normal">Всегда под рукой в трудную минуту</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {importantNumbers.map((contact, index) => (
          <div key={index} className="group p-3 rounded-xl bg-gradient-to-r from-slate-50 to-blue-50/50 hover:from-gorkhon-blue/5 hover:to-gorkhon-green/5 transition-all duration-300 border border-slate-200/50 hover:border-gorkhon-blue/20 hover:shadow-md">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="p-2 rounded-xl bg-gradient-to-br from-gorkhon-blue/10 to-gorkhon-blue/5 group-hover:from-gorkhon-blue/20 group-hover:to-gorkhon-blue/10 transition-all duration-300 flex-shrink-0">
                  <Icon name={contact.icon} size={16} className="text-gorkhon-blue group-hover:scale-110 transition-transform duration-300" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-slate-800 group-hover:text-gorkhon-blue transition-colors truncate">{contact.name}</p>
                  <p className="text-xs text-slate-600 truncate">{contact.person}</p>
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
        
        <div className="mt-4 p-3 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/50">
          <div className="flex items-center gap-2 text-amber-800">
            <Icon name="Heart" size={16} />
            <p className="text-sm font-medium">Мы всегда готовы помочь нашим соседям!</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImportantNumbers;