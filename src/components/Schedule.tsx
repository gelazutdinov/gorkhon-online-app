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
    <Card data-tutorial="city-map" className="rounded-lg md:rounded-3xl bg-white md:bg-gradient-to-br md:from-white md:via-orange-50/20 md:to-amber-50/30 border border-gray-200 md:border-2 md:border-gorkhon-orange/20 shadow-sm md:shadow-xl transition-all duration-300 overflow-hidden relative">
      {/* Декоративные элементы только на десктопе */}
      <div className="hidden md:block absolute top-0 right-0 w-32 h-32 bg-gorkhon-orange/5 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 transition-transform duration-700"></div>
      <div className="hidden md:block absolute bottom-0 left-0 w-24 h-24 bg-amber-500/5 rounded-full translate-y-12 -translate-x-12 group-hover:scale-125 transition-transform duration-700"></div>
      
      <CardHeader className="p-4 md:pb-6 relative z-10">
        <CardTitle className="flex items-center gap-3 text-gorkhon-orange">
          <div className="p-2 rounded-lg md:rounded-full bg-gorkhon-orange/10 flex-shrink-0">
            <Icon name="Bus" size={18} className="md:w-5 md:h-5" />
          </div>
          <div className="min-w-0">
            <span className="text-base md:text-lg font-bold">Расписание транспорта</span>
            <p className="text-xs md:text-sm text-slate-600 font-normal hidden sm:block">Путешествуйте с комфортом 360°</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 md:p-6 space-y-3 md:space-y-5">
        {scheduleData.map((transport, index) => (
          <div key={index} className="group">
            <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
              <div className="p-1.5 md:p-2 rounded-lg md:rounded-xl bg-gorkhon-orange/10 flex-shrink-0">
                <span className="text-base md:text-lg">{transport.type.split(' ')[0]}</span>
              </div>
              <h4 className="font-bold text-sm md:text-base text-slate-800">
                {transport.type.split(' ').slice(1).join(' ')}
              </h4>
            </div>
            
            <div className="space-y-2 md:space-y-3">
              {transport.routes.map((route, routeIndex) => (
                <div key={routeIndex} className="group/route flex justify-between items-center p-3 md:p-4 rounded-lg md:rounded-2xl bg-gray-50 md:bg-gradient-to-r md:from-slate-50 md:to-orange-50/50 hover:bg-gray-100 md:hover:from-gorkhon-orange/5 md:hover:to-gorkhon-orange/10 transition-all duration-300 border border-gray-200 md:border-slate-200/50">
                  <div className="space-y-1 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <Icon name="MapPin" size={14} className="text-gorkhon-orange flex-shrink-0" />
                      <p className="text-xs md:text-sm font-semibold text-slate-800 truncate">
                        {route.route}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Clock" size={12} className="text-slate-500 flex-shrink-0" />
                      <p className="text-xs text-slate-600">{route.time}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1 ml-2">
                    <Badge variant="secondary" className="bg-gorkhon-orange/15 text-gorkhon-orange border-gorkhon-orange/30 px-2 md:px-3 py-1 font-bold text-xs">
                      {route.price}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-slate-500">
                      <Icon name="Ticket" size={10} />
                      <span className="hidden sm:inline">за билет</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {index < scheduleData.length - 1 && (
              <div className="flex items-center gap-3 mt-3 md:mt-5 mb-1">
                <Separator className="flex-1" />
                <div className="p-1 rounded-full bg-gorkhon-orange/10">
                  <Icon name="ArrowDown" size={12} className="text-gorkhon-orange" />
                </div>
                <Separator className="flex-1" />
              </div>
            )}
          </div>
        ))}
        
        <div className="mt-4 md:mt-6 p-3 md:p-4 rounded-lg md:rounded-xl bg-blue-50 md:bg-gradient-to-r md:from-blue-50 md:to-purple-50 border border-blue-200/50">
          <div className="flex items-center gap-2 text-blue-800 mb-2">
            <Icon name="Info" size={16} className="flex-shrink-0" />
            <p className="text-sm md:text-sm font-semibold">Полезная информация</p>
          </div>
          <p className="text-xs text-blue-700 leading-relaxed">Возможны изменения в расписании или отмены рейсов "Горхон - УУ", "УУ - Горхон", "Заиграево - Горхон", "Горхон - Заиграево". Уточняйте информацию в поселковых чатах в Telegram.</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default Schedule;