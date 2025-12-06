import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

const ActionButtons = () => {
  return (
    <div className="space-y-6">
      {/* Medical Link */}
      <Card className="animate-fade-in bg-gradient-to-br from-blue-50 via-indigo-50 to-blue-100/80 border-0 rounded-2xl md:rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 group overflow-hidden relative">
        {/* Декоративные элементы */}
        <div className="absolute top-0 right-0 w-24 h-24 md:w-40 md:h-40 bg-gradient-to-br from-blue-400/15 to-indigo-400/15 rounded-full -translate-y-12 translate-x-12 md:-translate-y-20 md:translate-x-20 group-hover:scale-150 transition-transform duration-700"></div>
        <div className="absolute bottom-0 left-0 w-20 h-20 md:w-32 md:h-32 bg-gradient-to-tr from-indigo-400/10 to-transparent rounded-full translate-y-10 -translate-x-10 md:translate-y-16 md:-translate-x-16 group-hover:scale-125 transition-transform duration-700"></div>
        
        <CardContent className="p-5 md:p-7 relative z-10">
          <div className="flex items-center gap-3 md:gap-4">
            <div className="p-3.5 md:p-4 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/30 group-hover:shadow-xl group-hover:shadow-blue-500/40 transition-all duration-300 flex-shrink-0 group-hover:scale-110">
              <Icon name="Stethoscope" size={26} className="md:w-8 md:h-8 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-blue-900 text-xl md:text-2xl mb-1 tracking-tight">Запись к врачу</p>
              <p className="text-sm md:text-base text-blue-700 mb-1.5 leading-tight font-medium">
                Чат с Заиграевской ЦРБ
              </p>
              <p className="text-xs md:text-sm text-blue-600/80 font-medium">Быстро и удобно</p>
            </div>
          </div>
          
          {/* Кнопка на всю ширину на мобильных */}
          <div className="mt-5 md:mt-6">
            <Button 
              size="lg"
              className="w-full md:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-7 py-3.5 rounded-xl font-bold shadow-xl shadow-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/40 hover:scale-105 transition-all duration-300 text-base md:text-lg border-0"
              onClick={() => window.open('https://t.me/ZaigrCRB/8', '_blank')}
            >
              <Icon name="Calendar" size={20} className="mr-2.5" />
              Записаться
              <Icon name="ExternalLink" size={16} className="ml-2.5 opacity-80" />
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