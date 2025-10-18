import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface WorkScheduleItem {
  name: string;
  schedule: string;
  icon: string;
}

const WorkSchedule = () => {
  const [workSchedule, setWorkSchedule] = useState<WorkScheduleItem[]>([]);

  const defaultSchedule: WorkScheduleItem[] = [
    { name: "Почта", schedule: "ПН, СР, ЧТ, ПТ: 9-17ч, СБ: 9-16ч. Обед: 13-14ч. ВТ, ВС - выходные", icon: "Mail" },
    { name: "Сбербанк", schedule: "ВТ, ПТ: 9-17ч. Обед: 12:30-13:30. ПН, СР, ЧТ, СБ, ВС - выходные", icon: "CreditCard" },
    { name: "МУП ЖКХ", schedule: "ПН-ПТ: 8-16ч. Обед: 12-13ч", icon: "Wrench" }
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'homePageContent') {
        loadData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const loadData = () => {
    try {
      const savedContent = localStorage.getItem('homePageContent');
      if (savedContent) {
        const content = JSON.parse(savedContent);
        if (content.workSchedule && content.workSchedule.length > 0) {
          setWorkSchedule(content.workSchedule);
        } else {
          setWorkSchedule(defaultSchedule);
        }
      } else {
        setWorkSchedule(defaultSchedule);
      }
    } catch (error) {
      setWorkSchedule(defaultSchedule);
    }
  };

  return (
    <Card className="animate-fade-in rounded-2xl bg-gradient-to-br from-white to-purple-50/30 border-2 border-gorkhon-blue/10 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-gorkhon-blue">
          <div className="p-2 rounded-full bg-gorkhon-blue/10 animate-pulse">
            <Icon name="Clock" size={20} />
          </div>
          <div>
            <span className="text-lg font-bold">Режим работы</span>
            <p className="text-sm text-slate-600 font-normal">Сервис 360° в удобное время</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {workSchedule.map((item, index) => (
          <div key={index} className="group p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-purple-50/50 hover:from-gorkhon-blue/5 hover:to-gorkhon-blue/10 transition-all duration-300 border border-slate-200/50 hover:border-gorkhon-blue/20 hover:shadow-md">
            <div className="flex gap-4 mb-3">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-gorkhon-blue/10 to-gorkhon-blue/5 group-hover:from-gorkhon-blue/20 group-hover:to-gorkhon-blue/10 transition-all duration-300 flex-shrink-0">
                <Icon name={item.icon} size={18} className="text-gorkhon-blue group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <p className="font-bold text-slate-800 group-hover:text-gorkhon-blue transition-colors">
                    {item.name}
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="Calendar" size={12} className="text-slate-500 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed">{item.schedule}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
        

      </CardContent>
    </Card>
  );
};

export default WorkSchedule;