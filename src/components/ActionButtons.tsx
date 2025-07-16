import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const ActionButtons = () => {
  return (
    <div className="space-y-6">
      {/* Medical Link */}
      <Card className="animate-fade-in bg-gradient-to-r from-gorkhon-blue/5 to-gorkhon-green/5 border-gorkhon-blue/20 rounded-2xl">
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

      {/* Beta Feedback */}
      <Card className="animate-fade-in bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 rounded-2xl">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-full bg-amber-100">
                <Icon name="TestTube" size={20} className="text-amber-600" />
              </div>
              <div>
                <p className="font-medium text-amber-800">Бета-версия портала</p>
                <p className="text-sm text-amber-700">Поделитесь мнением о сайте</p>
              </div>
            </div>
            <Button 
              className="bg-amber-600 hover:bg-amber-700 text-white"
              onClick={() => window.open('https://t.me/+QgiLIa1gFRY4Y2Iy', '_blank')}
            >
              <Icon name="MessageSquare" size={16} />
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
              onClick={() => window.open('https://jivo.chat/9GPwkXQFfM', '_blank')}
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
  );
};

export default ActionButtons;