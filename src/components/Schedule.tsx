import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";

interface RouteInfo {
  route: string;
  time: string;
  price: string;
}

interface TransportSchedule {
  type: string;
  routes: RouteInfo[];
}

const Schedule = () => {
  const scheduleData: TransportSchedule[] = [
    {
      type: "🚌 Автобус",
      routes: [
        { route: "Горхон → УУ", time: "7:00 (ПН-ПТ)", price: "370₽" },
        { route: "Горхон → УУ", time: "8:00 (СБ-ВС)", price: "370₽" },
        { route: "Горхон → Заиграево", time: "7:00, 14:15 (ПН-ПТ)", price: "215₽" }
      ]
    },
    {
      type: "🚞 Электричка", 
      routes: [
        { route: "Горхон → УУ", time: "05:32 (ПН)", price: "282₽" },
        { route: "Горхон → УУ", time: "09:27 (СБ)", price: "282₽" },
        { route: "УУ → Горхон", time: "17:40 (ПТ)", price: "282₽" }
      ]
    }
  ];

  return (
    <Card className="animate-fade-in rounded-2xl bg-gradient-to-br from-white to-orange-50/30 border-2 border-gorkhon-orange/10 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-gorkhon-orange">
          <div className="p-2 rounded-full bg-gorkhon-orange/10 animate-pulse">
            <Icon name="Bus" size={20} />
          </div>
          <div>
            <span className="text-lg font-bold">Расписание транспорта</span>
            <p className="text-sm text-slate-600 font-normal">Путешествуйте с комфортом 3<span className="text-8xl font-black text-gorkhon-orange inline-block transform -translate-y-3 scale-150">∞</span>°</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {scheduleData.map((transport, index) => (
          <div key={index} className="group">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-gradient-to-r from-gorkhon-orange/10 to-gorkhon-orange/5 group-hover:from-gorkhon-orange/20 group-hover:to-gorkhon-orange/10 transition-all duration-300">
                <span className="text-lg">{transport.type.split(' ')[0]}</span>
              </div>
              <h4 className="font-bold text-slate-800 group-hover:text-gorkhon-orange transition-colors">
                {transport.type.split(' ').slice(1).join(' ')}
              </h4>
            </div>
            
            <div className="space-y-3">
              {transport.routes.map((route, routeIndex) => (
                <div key={routeIndex} className="group/route flex justify-between items-center p-4 rounded-2xl bg-gradient-to-r from-slate-50 to-orange-50/50 hover:from-gorkhon-orange/5 hover:to-gorkhon-orange/10 transition-all duration-300 border border-slate-200/50 hover:border-gorkhon-orange/20 hover:shadow-md">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Icon name="MapPin" size={14} className="text-gorkhon-orange" />
                      <p className="text-sm font-semibold text-slate-800 group-hover/route:text-gorkhon-orange transition-colors">
                        {route.route}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Clock" size={12} className="text-slate-500" />
                      <p className="text-xs text-slate-600">{route.time}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <Badge variant="secondary" className="bg-gorkhon-orange/15 text-gorkhon-orange border-gorkhon-orange/30 hover:bg-gorkhon-orange/20 transition-colors px-3 py-1 font-bold shadow-sm">
                      {route.price}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Icon name="Ticket" size={10} />
                      <span>за билет</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {index < scheduleData.length - 1 && (
              <div className="flex items-center gap-3 mt-5 mb-1">
                <Separator className="flex-1" />
                <div className="p-1 rounded-full bg-gorkhon-orange/10">
                  <Icon name="ArrowDown" size={12} className="text-gorkhon-orange" />
                </div>
                <Separator className="flex-1" />
              </div>
            )}
          </div>
        ))}
        
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-amber-50 to-orange-50 border border-orange-200/50">
          <div className="flex items-center gap-2 text-orange-800 mb-2">
            <Icon name="Info" size={16} />
            <p className="text-sm font-semibold">Полезная информация</p>
          </div>
          <p className="text-xs text-orange-700">Расписание может изменяться в праздничные дни. Следите за обновлениями!</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Schedule;