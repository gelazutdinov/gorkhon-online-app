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
    <Card className="animate-fade-in rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-gorkhon-blue">
          <Icon name="Bus" size={20} />
          Расписание транспорта
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {scheduleData.map((transport, index) => (
          <div key={index}>
            <h4 className="font-medium mb-2 text-slate-700">{transport.type}</h4>
            <div className="space-y-2">
              {transport.routes.map((route, routeIndex) => (
                <div key={routeIndex} className="flex justify-between items-center p-2 rounded-2xl bg-slate-50">
                  <div>
                    <p className="text-sm font-medium">{route.route}</p>
                    <p className="text-xs text-slate-600">{route.time}</p>
                  </div>
                  <Badge variant="secondary" className="bg-gorkhon-orange/10 text-gorkhon-orange border-gorkhon-orange/20">
                    {route.price}
                  </Badge>
                </div>
              ))}
            </div>
            {index < scheduleData.length - 1 && <Separator className="mt-4" />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Schedule;