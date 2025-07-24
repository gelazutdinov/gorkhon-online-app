import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface WorkScheduleItem {
  service: string;
  schedule: string;
  icon: string;
  detailed?: Record<string, string>;
}

const WorkSchedule = () => {
  const workSchedule: WorkScheduleItem[] = [
    { service: "Почта", schedule: "ПН, СР, ЧТ, ПТ: 9-17ч, СБ: 9-16ч. Обед: 13-14ч. ВТ, ВС - выходные", icon: "Mail" },
    { 
      service: "Сбербанк", 
      schedule: "ВТ, ПТ: 9-17ч. Обед: 12:30-13:30. ПН, СР, ЧТ, СБ, ВС - выходные", 
      icon: "CreditCard",
      detailed: {
        "Понедельник": "Выходной",
        "Вторник": "09:00 - 17:00 (Обед: 12:30 - 13:30)",
        "Среда": "Выходной", 
        "Четверг": "Выходной",
        "Пятница": "09:00 - 17:00 (Обед: 12:30 - 13:30)",
        "Суббота": "Выходной",
        "Воскресенье": "Выходной"
      }
    },
    { service: "МУП ЖКХ", schedule: "ПН-ПТ: 8-16ч. Обед: 12-13ч", icon: "Wrench" }
  ];

  return (
    <Card className="animate-fade-in rounded-2xl bg-gradient-to-br from-white to-purple-50/30 border-2 border-gorkhon-blue/10 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-gorkhon-blue">
          <div className="p-2 rounded-full bg-gorkhon-blue/10 animate-pulse">
            <Icon name="Clock" size={20} />
          </div>
          <div>
            <span className="text-lg font-bold">⏰ Режим работы</span>
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
                    {item.service}
                  </p>
                  <div className="px-2 py-1 rounded-full bg-gorkhon-blue/10 group-hover:bg-gorkhon-blue/20 transition-colors">
                    <span className="text-xs font-medium text-gorkhon-blue">Открыто</span>
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Icon name="Calendar" size={12} className="text-slate-500 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed">{item.schedule}</p>
                </div>
              </div>
            </div>

            {item.detailed && (
              <div className="mt-4 pt-4 border-t border-slate-200/50">
                <div className="flex items-center gap-2 mb-3">
                  <Icon name="CalendarDays" size={14} className="text-gorkhon-blue" />
                  <p className="text-sm font-semibold text-gorkhon-blue">Подробный график недели:</p>
                </div>
                <div className="grid gap-2 bg-white/50 p-3 rounded-xl border border-slate-200/30">
                  {Object.entries(item.detailed).map(([day, hours]) => (
                    <div key={day} className="flex justify-between items-center text-xs py-1">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${hours === "Выходной" ? "bg-red-400" : "bg-green-400"}`}></div>
                        <span className="text-slate-700 font-medium">{day}:</span>
                      </div>
                      <span className={`font-semibold ${hours === "Выходной" ? "text-red-600" : "text-green-600"}`}>
                        {hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
        
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50">
          <div className="flex items-center gap-2 text-blue-800 mb-2">
            <Icon name="Sparkles" size={16} />
            <p className="text-sm font-semibold">Режим работы 360°</p>
          </div>
          <p className="text-xs text-blue-700">Мы стараемся быть доступными для вас в максимально удобное время! 🕐</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default WorkSchedule;