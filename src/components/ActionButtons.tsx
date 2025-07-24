import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const ActionButtons = () => {
  return (
    <div className="space-y-6">
      {/* Medical Link */}
      <Card className="animate-fade-in bg-gradient-to-r from-gorkhon-blue/5 to-gorkhon-green/5 border-2 border-gorkhon-blue/20 rounded-2xl hover:shadow-lg transition-all duration-300 group">
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-gorkhon-blue/10 group-hover:bg-gorkhon-blue/20 transition-colors duration-300">
                <Icon name="Stethoscope" size={22} className="text-gorkhon-blue group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div>
                <p className="font-bold text-gorkhon-blue text-lg">🏥 Запись к врачу</p>
                <p className="text-sm text-slate-600 flex items-center gap-1">
                  <Icon name="MessageCircle" size={12} />
                  Чат с Заиграевской ЦРБ
                </p>
                <p className="text-xs text-gorkhon-blue/70 mt-1">Быстро и удобно</p>
              </div>
            </div>
            <Button 
              className="bg-gorkhon-blue hover:bg-gorkhon-blue/90 text-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105"
              onClick={() => window.open('https://t.me/ZaigrCRB/8', '_blank')}
            >
              <Icon name="ExternalLink" size={18} className="mr-2" />
              Записаться
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chat Support */}
      <Card className="animate-fade-in bg-gradient-warm text-white rounded-2xl hover:shadow-xl transition-all duration-300 group overflow-hidden">
        {/* Floating decorative elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-3 right-6 w-16 h-16 bg-white/10 rounded-full opacity-50 group-hover:opacity-70 transition-opacity"></div>
          <div className="absolute bottom-4 left-4 w-10 h-10 bg-white/5 rounded-full opacity-30 group-hover:opacity-50 transition-opacity"></div>
        </div>
        
        <CardContent className="p-5 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-full bg-white/20 group-hover:bg-white/30 transition-colors duration-300">
                <Icon name="MessageCircle" size={22} className="text-white group-hover:scale-110 transition-transform duration-300" />
              </div>
              <div>
                <p className="font-bold text-lg">💬 Чат поддержки</p>
                <p className="text-sm opacity-90 flex items-center gap-1">
                  <Icon name="Heart" size={12} />
                  Есть вопросы? Мы поможем!
                </p>
                <p className="text-xs opacity-75 mt-1">Всегда на связи с вами</p>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="border-2 border-white/40 text-white hover:bg-white/20 px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 group-hover:scale-105 backdrop-blur-sm"
              onClick={() => window.open('https://forms.yandex.ru/u/687f5b9a84227c08790f3222/', '_blank')}
            >
              <Icon name="MessageSquare" size={18} className="mr-2" />
              Написать
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Footer */}
      <div className="text-center py-6 space-y-3">
        <div className="flex items-center justify-center gap-2 text-slate-600">
          <Icon name="Heart" size={16} className="text-gorkhon-pink animate-pulse" />
          <p className="text-sm font-medium">
            Сделано с любовью для жителей Горхона
          </p>
          <Icon name="Heart" size={16} className="text-gorkhon-pink animate-pulse" />
        </div>
        
        <div className="space-y-1">
          <p className="text-xs text-slate-400">
            © 2025 Горхон.Online • Платформа 360°
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1">
              <Icon name="Users" size={10} />
              Для соседей
            </span>
            <span className="flex items-center gap-1">
              <Icon name="Globe" size={10} />
              С заботой
            </span>
            <span className="flex items-center gap-1">
              <Icon name="Sparkles" size={10} />
              Всегда рядом
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;