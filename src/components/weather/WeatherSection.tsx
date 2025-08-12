import Icon from '@/components/ui/icon';

const WeatherSection = () => {
  const currentWeather = {
    temperature: -15,
    condition: 'Облачно с прояснениями',
    feelsLike: -18,
    humidity: 68,
    windSpeed: 3,
    windDirection: 'СЗ',
    pressure: 762,
    visibility: 8
  };

  const forecast = [
    { day: 'Завтра', temp: { min: -18, max: -12 }, condition: 'Снег', icon: 'CloudSnow' },
    { day: 'Среда', temp: { min: -20, max: -15 }, condition: 'Ясно', icon: 'Sun' },
    { day: 'Четверг', temp: { min: -16, max: -10 }, condition: 'Облачно', icon: 'Cloud' },
    { day: 'Пятница', temp: { min: -14, max: -8 }, condition: 'Снег', icon: 'CloudSnow' },
    { day: 'Суббота', temp: { min: -12, max: -6 }, condition: 'Ясно', icon: 'Sun' }
  ];

  const getWeatherIcon = (condition: string) => {
    if (condition.includes('снег') || condition.includes('Снег')) return 'CloudSnow';
    if (condition.includes('дождь') || condition.includes('Дождь')) return 'CloudRain';
    if (condition.includes('ясно') || condition.includes('Ясно')) return 'Sun';
    if (condition.includes('облачно') || condition.includes('Облачно')) return 'Cloud';
    return 'Cloud';
  };

  return (
    <div className="space-y-6 pb-24">
      {/* Заголовок */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Погода в Горхоне
        </h1>
        <p className="text-gray-600">Актуальные данные на сегодня</p>
      </div>

      {/* Текущая погода */}
      <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-indigo-600 rounded-3xl p-6 sm:p-8 text-white shadow-2xl relative overflow-hidden">
        {/* Декоративные элементы */}
        <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full"></div>
        
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="text-5xl sm:text-6xl font-light mb-2">
                {currentWeather.temperature}°
              </div>
              <div className="text-lg text-white/90 mb-1">
                {currentWeather.condition}
              </div>
              <div className="text-sm text-white/70">
                Ощущается как {currentWeather.feelsLike}°
              </div>
            </div>
            <div className="text-right">
              <Icon name={getWeatherIcon(currentWeather.condition) as any} size={64} className="text-white/80 mb-2" />
              <div className="text-xs text-white/60">
                Обновлено: {new Date().toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Детальная информация */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Droplets" size={20} className="text-blue-600" />
            <span className="text-sm text-gray-600">Влажность</span>
          </div>
          <div className="text-xl font-semibold text-gray-900">{currentWeather.humidity}%</div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Wind" size={20} className="text-gray-600" />
            <span className="text-sm text-gray-600">Ветер</span>
          </div>
          <div className="text-xl font-semibold text-gray-900">{currentWeather.windSpeed} м/с</div>
          <div className="text-xs text-gray-500">{currentWeather.windDirection}</div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Gauge" size={20} className="text-purple-600" />
            <span className="text-sm text-gray-600">Давление</span>
          </div>
          <div className="text-xl font-semibold text-gray-900">{currentWeather.pressure}</div>
          <div className="text-xs text-gray-500">мм рт.ст.</div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-2">
            <Icon name="Eye" size={20} className="text-green-600" />
            <span className="text-sm text-gray-600">Видимость</span>
          </div>
          <div className="text-xl font-semibold text-gray-900">{currentWeather.visibility} км</div>
        </div>
      </div>

      {/* Прогноз на 5 дней */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Прогноз на 5 дней</h3>
        <div className="space-y-4">
          {forecast.map((day, index) => (
            <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0">
              <div className="flex items-center gap-4">
                <div className="w-12 text-gray-600 font-medium">
                  {day.day}
                </div>
                <Icon name={day.icon as any} size={24} className="text-gray-600" />
                <span className="text-gray-700">{day.condition}</span>
              </div>
              <div className="flex items-center gap-2 text-right">
                <span className="text-gray-500 text-sm">{day.temp.min}°</span>
                <span className="text-gray-900 font-semibold">{day.temp.max}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Информация об источнике */}
      <div className="bg-gray-50 rounded-2xl p-4 text-center">
        <div className="flex items-center justify-center gap-2 text-gray-600 text-sm">
          <Icon name="Info" size={16} />
          <span>Данные обновляются каждый час</span>
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Источник: Гидрометцентр России
        </div>
      </div>
    </div>
  );
};

export default WeatherSection;