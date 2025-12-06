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
    <Card data-tutorial="city-map" className="rounded-2xl md:rounded-3xl bg-gradient-to-br from-white to-orange-50/30 border-0 shadow-sm md:shadow-xl transition-all duration-300 overflow-hidden relative group">
      {/* Декоративные элементы */}
      <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-gorkhon-orange/10 to-transparent rounded-full -translate-y-20 translate-x-20 group-hover:scale-150 transition-transform duration-700"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-amber-500/10 to-transparent rounded-full translate-y-16 -translate-x-16 group-hover:scale-125 transition-transform duration-700"></div>
      
      <CardHeader className="p-5 md:p-7 relative z-10 bg-gradient-to-r from-gorkhon-orange/5 to-transparent border-b-0">
        <CardTitle className="flex items-center gap-3 md:gap-4">
          <div className="p-3 md:p-3.5 rounded-2xl bg-gradient-to-br from-gorkhon-orange to-gorkhon-orange/80 shadow-lg shadow-gorkhon-orange/20 flex-shrink-0">
            <Icon name="Bus" size={22} className="md:w-7 md:h-7 text-white" />
          </div>
          <div className="min-w-0">
            <span className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">Расписание транспорта</span>
            <p className="text-xs md:text-sm text-gray-600 font-medium mt-1 md:mt-1.5 hidden sm:block">Путешествуйте с комфортом 360°</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 md:p-7 space-y-4 md:space-y-6 relative z-10">
        {scheduleData.map((transport, index) => (
          <div key={index} className="group/section">
            <div className="flex items-center gap-2.5 md:gap-3 mb-3 md:mb-4">
              <div className="p-2 md:p-2.5 rounded-xl bg-gradient-to-br from-gorkhon-orange/15 to-gorkhon-orange/5 flex-shrink-0 border border-gorkhon-orange/10">
                <span className="text-lg md:text-xl">{transport.type.split(' ')[0]}</span>
              </div>
              <h4 className="font-bold text-base md:text-lg text-gray-900">
                {transport.type.split(' ').slice(1).join(' ')}
              </h4>
            </div>
            
            <div className="space-y-2.5 md:space-y-3">
              {transport.routes.map((route, routeIndex) => (
                <div key={routeIndex} className="group/route flex justify-between items-center p-3.5 md:p-5 rounded-2xl bg-white hover:bg-gradient-to-r hover:from-white hover:to-orange-50/50 transition-all duration-300 border border-gray-100 hover:border-gorkhon-orange/30 hover:shadow-md hover:scale-[1.02]">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="p-1 rounded-lg bg-gorkhon-orange/10">
                        <Icon name="MapPin" size={14} className="text-gorkhon-orange flex-shrink-0" />
                      </div>
                      <p className="text-sm md:text-base font-bold text-gray-900 truncate">
                        {route.route}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-7">
                      <Icon name="Clock" size={12} className="text-gray-500 flex-shrink-0" />
                      <p className="text-xs md:text-sm text-gray-600 font-medium">{route.time}</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1.5 ml-3">
                    <Badge variant="secondary" className="bg-gradient-to-r from-gorkhon-orange to-gorkhon-orange/90 text-white border-0 px-3 md:px-4 py-1.5 font-bold text-sm shadow-lg shadow-gorkhon-orange/20">
                      {route.price}
                    </Badge>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
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