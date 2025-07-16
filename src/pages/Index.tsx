import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import Icon from "@/components/ui/icon";

const Index = () => {
  const importantNumbers = [
    { name: "ФАП Горхон", person: "Аяна Анатольевна", phone: "89244563184", icon: "Phone" },
    { name: "Участковый", person: "Алексей", phone: "+7999-275-34-13", icon: "Shield" },
    { name: "Скорая помощь", person: "Служба экстренного вызова", phone: "112", icon: "Ambulance" },
    { name: "Диспетчер РЭС", person: "Электроснабжение", phone: "+73012344083", icon: "Zap" },
    { name: "МФЦ Заиграево", person: "Многофункциональный центр", phone: "+73013641101", icon: "Building" },
    { name: "Почта Горхон", person: "Юлия Паук", phone: "+89836307423", icon: "Mail" }
  ];

  const scheduleData = [
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

  const donationData = [
    {
      title: "ФОНД поселка",
      recipient: "Ирина Н.П",
      account: "408 178 109 091 606 626 11",
      note: "Обязательно пишем 'ФОНД поселка'",
      icon: "Home",
      gradient: "bg-gradient-blue"
    },
    {
      title: "Помощь церкви ⛪️",
      recipient: "Голофаева В.",
      account: "89024562839",
      note: "Поддержка храма",
      icon: "Heart",
      gradient: "bg-gradient-warm"
    },
    {
      title: "Помощь бойцам 🪖",
      recipient: "Олеся Николаевна Н.",
      account: "89246210100",
      note: "В теме: 'Помощь Бойцам'",
      icon: "Shield",
      gradient: "bg-gradient-brand"
    }
  ];

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-gorkhon-pink text-white px-4 py-6 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: `url('https://cdn.poehali.dev/files/19d92d52-a37f-4236-a55f-1ce90dd9ba1b.png')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            animation: 'float 8s ease-in-out infinite'
          }}
        />
        
        <div className="max-w-md mx-auto text-center relative z-10">
          <div className="flex items-center justify-center gap-3 mb-3">
            <img 
              src="https://cdn.poehali.dev/files/64175b7f-29b7-4d32-bcc2-25c53be6ea3b.png" 
              alt="Логотип Горхон" 
              className="w-12 h-12 rounded-lg shadow-lg"
            />
            <h1 className="text-2xl font-bold">Горхон.Online</h1>
          </div>
          <p className="text-white/90">Вся нужная информация под рукой</p>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
          <Button className="h-16 bg-gorkhon-blue hover:bg-gorkhon-blue/90 text-white flex flex-col items-center gap-1">
            <Icon name="Phone" size={20} />
            <span className="text-sm">Экстренные службы</span>
          </Button>
          <Button className="h-16 bg-gorkhon-green hover:bg-gorkhon-green/90 text-white flex flex-col items-center gap-1">
            <Icon name="Bus" size={20} />
            <span className="text-sm">Расписание</span>
          </Button>
        </div>

        {/* Important Numbers */}
        <Card className="animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-gorkhon-blue">
              <Icon name="Phone" size={20} />
              Важные номера
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {importantNumbers.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gorkhon-blue/10">
                    <Icon name={contact.icon as any} size={16} className="text-gorkhon-blue" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{contact.name}</p>
                    <p className="text-xs text-slate-600">{contact.person}</p>
                  </div>
                </div>
                <Button 
                  size="sm" 
                  className="bg-gorkhon-green hover:bg-gorkhon-green/90 text-white px-3 py-1 h-8"
                  onClick={() => window.open(`tel:${contact.phone}`, '_self')}
                >
                  <Icon name="Phone" size={14} />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Transport Schedule */}
        <Card className="animate-fade-in">
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
                    <div key={routeIndex} className="flex justify-between items-center p-2 rounded bg-slate-50">
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

        {/* Donation Section */}
        <Card className="animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-gorkhon-blue">
              <Icon name="Heart" size={20} />
              Помощь поселку
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {donationData.map((donation, index) => (
              <div key={index} className={`p-4 rounded-lg ${donation.gradient} text-white relative overflow-hidden`}>
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon name={donation.icon as any} size={18} />
                    <h4 className="font-medium">{donation.title}</h4>
                  </div>
                  <p className="text-sm opacity-90 mb-1">{donation.recipient}</p>
                  <p className="text-sm font-mono bg-white/20 p-2 rounded mb-2">
                    {donation.account}
                  </p>
                  <p className="text-xs opacity-80">{donation.note}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Work Schedule */}
        <Card className="animate-fade-in">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-gorkhon-blue">
              <Icon name="Clock" size={20} />
              Режим работы
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {workSchedule.map((item, index) => (
              <div key={index} className="p-3 rounded-lg bg-slate-50">
                <div className="flex gap-3 mb-2">
                  <div className="p-2 rounded-full bg-gorkhon-blue/10 flex-shrink-0">
                    <Icon name={item.icon as any} size={16} className="text-gorkhon-blue" />
                  </div>
                  <div>
                    <p className="font-medium text-sm mb-1">{item.service}</p>
                    <p className="text-xs text-slate-600">{item.schedule}</p>
                  </div>
                </div>
                
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

        {/* Medical Link */}
        <Card className="animate-fade-in bg-gradient-to-r from-gorkhon-blue/5 to-gorkhon-green/5 border-gorkhon-blue/20">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-gorkhon-blue/10">
                  <Icon name="Stethoscope" size={20} className="text-gorkhon-blue" />
                </div>
                <div>
                  <p className="font-medium text-gorkhon-blue">Запись к врачу</p>
                  <p className="text-sm text-slate-600">Чат с Заиграевской ЦРБ</p>
                </div>
              </div>
              <Button 
                className="bg-gorkhon-blue hover:bg-gorkhon-blue/90 text-white"
                onClick={() => window.open('https://t.me/ZaigrCRB/8', '_blank')}
              >
                <Icon name="ExternalLink" size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Chat Support */}
        <Card className="animate-fade-in bg-gradient-warm text-white">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-full bg-white/20">
                  <Icon name="MessageCircle" size={20} className="text-white" />
                </div>
                <div>
                  <p className="font-medium">Чат поддержки</p>
                  <p className="text-sm opacity-90">Есть вопросы? Мы поможем!</p>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="border-white/30 text-white hover:bg-white/20"
                onClick={() => {
                  // Jivo chat integration will be added here
                  console.log('Opening chat support...');
                }}
              >
                <Icon name="MessageSquare" size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center py-4">
          <p className="text-sm text-slate-500">
            Сделано с ❤️ для жителей Горхона
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;