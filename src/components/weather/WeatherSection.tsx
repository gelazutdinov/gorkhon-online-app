import { useWeather, getWindDirection } from '@/hooks/useWeather';
import Icon from '@/components/ui/icon';

const WeatherSection = () => {
  const { current, forecast, loading, error, lastUpdated, refetch } = useWeather();

  if (loading) {
    return (
      <div className="space-y-6 pb-24">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Погода в Горхоне
          </h1>
          <p className="text-gray-600">Загружаем актуальные данные...</p>
        </div>
        
        <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-3xl p-8 text-white shadow-2xl">
          <div className="flex items-center justify-center py-12">
            <Icon name="Loader" size={48} className="animate-spin text-white/80" />
          </div>
        </div>
      </div>
    );
  }

  if (!current) {
    return (
      <div className="space-y-6 pb-24">
        <div className="text-center mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Погода в Горхоне
          </h1>
          <p className="text-red-600">Не удалось загрузить данные о погоде</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24">
      {/* Заголовок */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Погода в Горхоне
        </h1>
        <div className="flex items-center justify-center gap-2 text-sm">
          <Icon 
            name={error ? "WifiOff" : "Wifi"} 
            size={16} 
            className={error ? "text-orange-500" : "text-green-600"}
          />
          <p className={error ? "text-orange-600" : "text-green-600"}>
            {error || 'Актуальные данные'}
          </p>
        </div>
        {lastUpdated && (
          <p className="text-xs text-gray-500 mt-1">
            Обновлено: {lastUpdated.toLocaleTimeString('ru-RU', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </p>
        )}
      </div>

      {/* Текущая погода */}
      <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        {/* Декоративные элементы */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1 min-w-0 pr-4">
              <div className="text-4xl sm:text-5xl lg:text-6xl font-light mb-2 truncate">
                {current.temperature > 0 ? '+' : ''}{current.temperature}°
              </div>
              <div className="text-base sm:text-lg text-white/90 mb-1 truncate">
                {current.description}
              </div>
              <div className="text-sm text-white/70 truncate">
                Ощущается как {current.feelsLike > 0 ? '+' : ''}{current.feelsLike}°
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <Icon name={current.icon as any} size={48} className="text-white/80 mb-2 sm:w-16 sm:h-16" />
            </div>
          </div>

          {/* Кнопка обновления */}
          <button
            onClick={refetch}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
            title="Обновить данные"
          >
            <Icon name="RefreshCw" size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Детальная информация */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100 min-h-[80px] flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Droplets" size={16} className="text-blue-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-gray-600 truncate">Влажность</span>
          </div>
          <div className="text-lg sm:text-xl font-semibold text-gray-900">{current.humidity}%</div>
        </div>

        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100 min-h-[80px] flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Wind" size={16} className="text-gray-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-gray-600 truncate">Ветер</span>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-semibold text-gray-900">{current.windSpeed} м/с</div>
            <div className="text-xs text-gray-500">{getWindDirection(current.windDeg)}</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100 min-h-[80px] flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Gauge" size={16} className="text-purple-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-gray-600 truncate">Давление</span>
          </div>
          <div>
            <div className="text-lg sm:text-xl font-semibold text-gray-900">{current.pressure}</div>
            <div className="text-xs text-gray-500">мм рт.ст.</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-3 sm:p-4 shadow-sm border border-gray-100 min-h-[80px] flex flex-col justify-between">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Eye" size={16} className="text-green-600 flex-shrink-0" />
            <span className="text-xs sm:text-sm text-gray-600 truncate">Видимость</span>
          </div>
          <div className="text-lg sm:text-xl font-semibold text-gray-900">{current.visibility} км</div>
        </div>
      </div>

      {/* Прогноз на 5 дней */}
      <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm border border-gray-100">
        <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">Прогноз на 5 дней</h3>
        <div className="space-y-3 sm:space-y-4">
          {forecast.map((day, index) => (
            <div key={index} className="flex items-center justify-between py-2 sm:py-3 border-b border-gray-100 last:border-b-0 min-h-[60px]">
              <div className="flex items-center gap-2 sm:gap-4 flex-1 min-w-0">
                <div className="w-8 sm:w-12 text-gray-600 font-medium text-sm flex-shrink-0">
                  {day.day}
                </div>
                <Icon name={day.icon as any} size={20} className="text-gray-600 flex-shrink-0" />
                <div className="flex flex-col min-w-0 flex-1">
                  <span className="text-sm sm:text-base text-gray-700 truncate">{day.description}</span>
                  <div className="flex items-center gap-2 sm:gap-3 text-xs text-gray-500">
                    <span className="flex items-center gap-1 flex-shrink-0">
                      <Icon name="Droplets" size={10} />
                      {day.humidity}%
                    </span>
                    <span className="flex items-center gap-1 flex-shrink-0">
                      <Icon name="Wind" size={10} />
                      {day.windSpeed} м/с
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 text-right flex-shrink-0 ml-2">
                <span className="text-gray-500 text-xs sm:text-sm">
                  {day.tempMin > 0 ? '+' : ''}{day.tempMin}°
                </span>
                <span className="text-gray-900 font-semibold text-sm sm:text-base">
                  {day.tempMax > 0 ? '+' : ''}{day.tempMax}°
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Информация об источнике */}
      <div className={`rounded-2xl p-4 text-center ${
        error 
          ? 'bg-orange-50 border border-orange-200' 
          : 'bg-green-50 border border-green-200'
      }`}>
        <div className="flex items-center justify-center gap-2 text-sm">
          <Icon 
            name={error ? "AlertTriangle" : "Globe"} 
            size={16} 
            className={error ? "text-orange-600" : "text-green-600"}
          />
          <span className={error ? "text-orange-700" : "text-green-700"}>
            {error ? 'Локальные данные' : 'Данные получены из интернета'}
          </span>
        </div>
        <div className="text-xs mt-1">
          <span className={error ? "text-orange-600" : "text-green-600"}>
            Источник: {error ? 'Локальная база данных' : 'wttr.in Weather API'}
          </span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Обновление каждый час автоматически
        </div>
      </div>
    </div>
  );
};

export default WeatherSection;