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
    <Card className="animate-fade-in rounded-2xl shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-gorkhon-blue">
          <div className="p-2 rounded-xl bg-gradient-blue">
            <Icon name="Phone" size={20} className="text-white" />
          </div>
          Важные номера
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {importantNumbers.map((contact, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-2xl bg-white/60 hover:bg-white/80 transition-all duration-200 hover:scale-[1.02] border border-white/20">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-2xl bg-gradient-purple">
                <Icon name={contact.icon} size={16} className="text-white" />
              </div>
              <div>
                <p className="font-medium text-sm">{contact.name}</p>
                <p className="text-xs text-slate-600">{contact.person}</p>
              </div>
            </div>
            <Button 
              size="sm" 
              className="bg-gradient-emerald hover:scale-105 text-white px-3 py-1 h-8 rounded-xl transition-all duration-200 shadow-md"
              onClick={() => window.open(`tel:${contact.phone}`, '_self')}
            >
              <Icon name="Phone" size={14} />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default ImportantNumbers;