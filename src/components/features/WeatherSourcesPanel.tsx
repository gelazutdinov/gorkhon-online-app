const WeatherSourcesPanel = () => {
  return (
    <div className="bg-white rounded-lg md:rounded-2xl p-4 md:p-6 shadow-sm border border-gray-200">
      <h2 className="text-lg md:text-xl font-semibold text-gray-800 mb-4">Источники погоды</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <a 
          href="https://yandex.ru/pogoda/gorkhon"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
        >
          <div className="w-8 h-8 bg-yellow-100 rounded flex items-center justify-center">
            <span className="text-yellow-600 font-bold text-sm">Я</span>
          </div>
          <span className="text-gray-700 hover:text-blue-600">Яндекс.Погода</span>
        </a>
        
        <a 
          href="https://www.gismeteo.ru/weather-gorkhon-5135/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
        >
          <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
            <span className="text-blue-600 font-bold text-sm">G</span>
          </div>
          <span className="text-gray-700 hover:text-blue-600">Gismeteo</span>
        </a>
      </div>
    </div>
  );
};

export default WeatherSourcesPanel;