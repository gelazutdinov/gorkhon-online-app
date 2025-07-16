import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const WorkSchedule = () => {
  const workSchedule = [
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
    <Card className="animate-fade-in rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-gorkhon-blue">
          <Icon name="Clock" size={20} />
          Режим работы
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {workSchedule.map((item, index) => (
          <div key={index} className="p-3 rounded-2xl bg-slate-50">
            <div className="flex gap-3 mb-2">
              <div className="p-2 rounded-2xl bg-gorkhon-blue/10 flex-shrink-0">
                <Icon name={item.icon as any} size={16} className="text-gorkhon-blue" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm mb-1">{item.service}</p>
                {(item as any).address && (
                  <p className="text-xs text-slate-500 mb-1">{(item as any).address}</p>
                )}
                <p className="text-xs text-slate-600">{item.schedule}</p>
              </div>
            </div>
            
            {(item as any).photos && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <p className="text-xs font-medium text-slate-700 mb-2">Фотографии:</p>
                <div className="grid grid-cols-2 gap-2">
                  {(item as any).photos.map((photo: any, photoIndex: number) => (
                    <div key={photoIndex} className="relative">
                      <img 
                        src={photo.url} 
                        alt={photo.caption}
                        className="w-full h-20 object-cover rounded-lg"
                      />
                      <div className="mt-1">
                        <p className="text-xs text-slate-600">{photo.caption}</p>
                        <p className="text-xs text-slate-400">Источник: {photo.source}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(item as any).detailed && (
              <div className="mt-3 pt-3 border-t border-slate-200">
                <p className="text-xs font-medium text-slate-700 mb-2">Подробный график:</p>
                <div className="grid gap-1">
                  {Object.entries((item as any).detailed).map(([day, hours]) => (
                    <div key={day} className="flex justify-between text-xs">
                      <span className="text-slate-600">{day}:</span>
                      <span className={hours === "Выходной" ? "text-red-600" : "text-green-600 font-medium"}>
                        {hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default WorkSchedule;