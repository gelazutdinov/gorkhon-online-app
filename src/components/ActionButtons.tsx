import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const ActionButtons = () => {
  return (
    <div className="space-y-6">
      {/* Medical Link */}
      <Card className="animate-fade-in bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100 border-2 border-blue-200/60 rounded-2xl md:rounded-3xl hover:shadow-xl transition-all duration-300 group overflow-hidden relative">
        {/* Декоративные элементы */}
        <div className="absolute top-0 right-0 w-20 h-20 md:w-32 md:h-32 bg-gradient-to-br from-blue-300/20 to-indigo-300/20 rounded-full -translate-y-10 translate-x-10 md:-translate-y-16 md:translate-x-16 group-hover:scale-125 transition-transform duration-500"></div>
        
        <CardContent className="p-4 md:p-6 relative z-10">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-3 md:p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 group-hover:shadow-lg transition-all duration-300 flex-shrink-0">
              <Icon name="Stethoscope" size={24} className="md:w-7 md:h-7 text-white group-hover:scale-110 transition-transform duration-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-blue-800 text-lg md:text-xl mb-1">Запись к врачу</p>
              <p className="text-sm md:text-base text-blue-600/80 mb-1 leading-tight">
                Чат с Заиграевской ЦРБ
              </p>
              <p className="text-xs md:text-sm text-blue-500/70 font-medium">Быстро и удобно</p>
            </div>
          </div>
          
          {/* Кнопка на всю ширину на мобильных */}
          <div className="mt-4 md:mt-5">
            <Button 
              size="lg"
              className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm md:text-base border-0"
              onClick={() => window.open('https://t.me/ZaigrCRB/8', '_blank')}
            >
              <Icon name="Calendar" size={18} className="mr-2" />
              Записаться
              <Icon name="ExternalLink" size={14} className="ml-2 opacity-70" />
            </Button>
          </div>
        </CardContent>
      </Card>



      {/* Footer */}
      <div className="text-center py-4 md:py-6 space-y-3 md:space-y-4">
        <div className="flex items-center justify-center gap-2 text-slate-600 px-4">
          <Icon name="Heart" size={14} className="md:w-4 md:h-4 text-gorkhon-pink animate-pulse" />
          <p className="text-sm md:text-base font-medium text-center leading-tight">
            Сделано с любовью для жителей Горхона
          </p>
          <Icon name="Heart" size={14} className="md:w-4 md:h-4 text-gorkhon-pink animate-pulse" />
        </div>
        
        <div className="space-y-2 md:space-y-3 px-4">
          <p className="text-xs md:text-sm text-slate-400">
            © 2025 Горхон.Online • Платформа 360°
          </p>
          <div className="flex items-center justify-center gap-3 md:gap-4 text-xs md:text-sm text-slate-400 flex-wrap">
            <span className="flex items-center gap-1">
              <Icon name="Users" size={10} className="md:w-3 md:h-3" />
              Для жителей
            </span>
            <span className="flex items-center gap-1">
              <Icon name="Globe" size={10} className="md:w-3 md:h-3" />
              С заботой
            </span>
            <span className="flex items-center gap-1">
              <Icon name="Sparkles" size={10} className="md:w-3 md:h-3" />
              Всегда рядом
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;