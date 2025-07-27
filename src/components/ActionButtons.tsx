import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const ActionButtons = () => {
  return (
    <div className="space-y-6">
      {/* Medical Link */}
      <Card className="animate-fade-in bg-gradient-to-r from-gorkhon-blue/5 to-gorkhon-green/5 border-2 border-gorkhon-blue/20 rounded-2xl hover:shadow-lg transition-all duration-300 group">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-gorkhon-blue/10 group-hover:bg-gorkhon-blue/20 transition-colors duration-300 flex-shrink-0">
              <Icon name="Stethoscope" size={20} className="text-gorkhon-blue group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gorkhon-blue text-base">Запись к врачу</p>
              <p className="text-sm text-slate-600">
                Чат с Заиграевской ЦРБ
              </p>
              <p className="text-xs text-gorkhon-blue/70">Быстро и удобно</p>
            </div>
            <div className="flex-shrink-0">
              <Button 
                size="sm"
                className="bg-gorkhon-blue hover:bg-gorkhon-blue/90 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 text-sm"
                onClick={() => window.open('https://t.me/ZaigrCRB/8', '_blank')}
              >
                <Icon name="ExternalLink" size={14} className="mr-1" />
                Записаться
              </Button>
            </div>
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
              Для жителей
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