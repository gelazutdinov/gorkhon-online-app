import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface SmartDevice {
  id: string;
  name: string;
  type: 'light' | 'thermostat' | 'security' | 'appliance' | 'sensor' | 'energy';
  room: string;
  status: 'online' | 'offline' | 'error';
  isActive: boolean;
  value?: number;
  unit?: string;
  icon: string;
  color: string;
}

interface Room {
  id: string;
  name: string;
  icon: string;
  devices: number;
  temperature?: number;
  humidity?: number;
}

interface EnergyData {
  current: number;
  today: number;
  thisMonth: number;
  cost: number;
}

const SmartHome = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'devices' | 'energy' | 'security'>('overview');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const rooms: Room[] = [
    { id: 'living', name: 'Гостиная', icon: 'Sofa', devices: 8, temperature: 22, humidity: 45 },
    { id: 'kitchen', name: 'Кухня', icon: 'ChefHat', devices: 6, temperature: 24, humidity: 52 },
    { id: 'bedroom', name: 'Спальня', icon: 'BedDouble', devices: 5, temperature: 20, humidity: 43 },
    { id: 'bathroom', name: 'Ванная', icon: 'Bath', devices: 3, temperature: 26, humidity: 68 },
    { id: 'outdoor', name: 'Двор', icon: 'TreePine', devices: 4, temperature: 18, humidity: 72 }
  ];

  const devices: SmartDevice[] = [
    // Гостиная
    {
      id: '1',
      name: 'Основное освещение',
      type: 'light',
      room: 'living',
      status: 'online',
      isActive: true,
      value: 80,
      unit: '%',
      icon: 'Lightbulb',
      color: 'bg-yellow-500'
    },
    {
      id: '2',
      name: 'Термостат',
      type: 'thermostat',
      room: 'living',
      status: 'online',
      isActive: true,
      value: 22,
      unit: '°C',
      icon: 'Thermometer',
      color: 'bg-orange-500'
    },
    {
      id: '3',
      name: 'Умная колонка',
      type: 'appliance',
      room: 'living',
      status: 'online',
      isActive: false,
      icon: 'Speaker',
      color: 'bg-purple-500'
    },
    
    // Кухня
    {
      id: '4',
      name: 'Кухонное освещение',
      type: 'light',
      room: 'kitchen',
      status: 'online',
      isActive: true,
      value: 100,
      unit: '%',
      icon: 'Lightbulb',
      color: 'bg-yellow-500'
    },
    {
      id: '5',
      name: 'Умный холодильник',
      type: 'appliance',
      room: 'kitchen',
      status: 'online',
      isActive: true,
      value: 4,
      unit: '°C',
      icon: 'Refrigerator',
      color: 'bg-blue-500'
    },
    {
      id: '6',
      name: 'Датчик газа',
      type: 'sensor',
      room: 'kitchen',
      status: 'online',
      isActive: true,
      value: 0,
      unit: 'ppm',
      icon: 'Wind',
      color: 'bg-green-500'
    },
    
    // Спальня
    {
      id: '7',
      name: 'Ночник',
      type: 'light',
      room: 'bedroom',
      status: 'online',
      isActive: false,
      value: 0,
      unit: '%',
      icon: 'Moon',
      color: 'bg-indigo-500'
    },
    {
      id: '8',
      name: 'Кондиционер',
      type: 'thermostat',
      room: 'bedroom',
      status: 'offline',
      isActive: false,
      icon: 'Snowflake',
      color: 'bg-cyan-500'
    },
    
    // Безопасность
    {
      id: '9',
      name: 'Камера входной двери',
      type: 'security',
      room: 'outdoor',
      status: 'online',
      isActive: true,
      icon: 'Camera',
      color: 'bg-red-500'
    },
    {
      id: '10',
      name: 'Датчик движения',
      type: 'security',
      room: 'living',
      status: 'online',
      isActive: true,
      icon: 'Radar',
      color: 'bg-red-500'
    },
    
    // Энергия
    {
      id: '11',
      name: 'Счетчик электричества',
      type: 'energy',
      room: 'living',
      status: 'online',
      isActive: true,
      value: 2.4,
      unit: 'кВт',
      icon: 'Zap',
      color: 'bg-yellow-600'
    }
  ];

  const energyData: EnergyData = {
    current: 2.4,
    today: 24.8,
    thisMonth: 456.2,
    cost: 1826.50
  };

  const getDevicesByRoom = (roomId: string) => {
    return devices.filter(device => device.room === roomId);
  };

  const getStatusColor = (status: SmartDevice['status']) => {
    switch (status) {
      case 'online': return 'text-green-500';
      case 'offline': return 'text-gray-400';
      case 'error': return 'text-red-500';
    }
  };

  const getStatusIcon = (status: SmartDevice['status']) => {
    switch (status) {
      case 'online': return 'CheckCircle';
      case 'offline': return 'XCircle';
      case 'error': return 'AlertTriangle';
    }
  };

  const toggleDevice = (deviceId: string) => {
    // Здесь была бы логика управления устройством
    console.log('Toggle device:', deviceId);
  };

  return (
    <div className="space-y-6">
      {/* Заголовок */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white rounded-2xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">🏠 Умный дом Горхон</h1>
            <p className="text-white/90">Управление IoT устройствами и автоматизация</p>
          </div>
          <div className="text-right">
            <div className="text-sm text-white/80">Устройств подключено</div>
            <div className="text-3xl font-bold">{devices.filter(d => d.status === 'online').length}</div>
          </div>
        </div>
      </div>

      {/* Навигация */}
      <div className="bg-white rounded-xl p-2 shadow-lg border border-gray-100">
        <div className="flex rounded-lg overflow-hidden">
          {[
            { id: 'overview', label: 'Обзор', icon: 'Home' },
            { id: 'devices', label: 'Устройства', icon: 'Cpu' },
            { id: 'energy', label: 'Энергия', icon: 'Zap' },
            { id: 'security', label: 'Безопасность', icon: 'ShieldCheck' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 transition-all ${
                activeTab === tab.id
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Icon name={tab.icon as any} size={18} />
              <span className="text-sm font-medium hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Содержимое вкладок */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Комнаты */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.map((room) => (
              <div
                key={room.id}
                onClick={() => setSelectedRoom(selectedRoom === room.id ? null : room.id)}
                className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer hover:scale-105"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                      <Icon name={room.icon as any} size={24} className="text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-bold text-lg">{room.name}</h3>
                      <p className="text-sm text-gray-600">{room.devices} устройств</p>
                    </div>
                  </div>
                  <Icon 
                    name={selectedRoom === room.id ? "ChevronUp" : "ChevronDown"} 
                    size={20} 
                    className="text-gray-400" 
                  />
                </div>

                {room.temperature && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-orange-600">{room.temperature}°</div>
                      <div className="text-xs text-gray-600">Температура</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{room.humidity}%</div>
                      <div className="text-xs text-gray-600">Влажность</div>
                    </div>
                  </div>
                )}

                {/* Устройства в комнате */}
                {selectedRoom === room.id && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
                    {getDevicesByRoom(room.id).map((device) => (
                      <div key={device.id} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <div className={`w-6 h-6 ${device.color} rounded-full flex items-center justify-center`}>
                            <Icon name={device.icon as any} size={12} className="text-white" />
                          </div>
                          <span className="text-sm font-medium">{device.name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {device.value && (
                            <span className="text-xs text-gray-600">
                              {device.value}{device.unit}
                            </span>
                          )}
                          <Icon 
                            name={getStatusIcon(device.status)} 
                            size={16} 
                            className={getStatusColor(device.status)} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Быстрые действия */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="font-bold text-lg mb-4">⚡ Быстрые действия</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Все светильники', icon: 'Lightbulb', action: 'lights' },
                { label: 'Климат-контроль', icon: 'Thermometer', action: 'climate' },
                { label: 'Режим сна', icon: 'Moon', action: 'sleep' },
                { label: 'Выйти из дома', icon: 'DoorOpen', action: 'away' }
              ].map((action) => (
                <button
                  key={action.action}
                  className="p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors text-center"
                >
                  <Icon name={action.icon as any} size={24} className="text-purple-600 mx-auto mb-2" />
                  <div className="text-sm font-medium text-purple-900">{action.label}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'devices' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="font-bold text-lg mb-4">📱 Все устройства</h3>
            
            <div className="space-y-3">
              {devices.map((device) => (
                <div
                  key={device.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className={`w-12 h-12 ${device.color} rounded-xl flex items-center justify-center text-white`}>
                    <Icon name={device.icon as any} size={20} />
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium">{device.name}</div>
                    <div className="text-sm text-gray-600">
                      {rooms.find(r => r.id === device.room)?.name}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {device.value && (
                      <div className="font-bold text-sm">
                        {device.value}{device.unit}
                      </div>
                    )}
                    <div className="flex items-center gap-1 mt-1">
                      <Icon 
                        name={getStatusIcon(device.status)} 
                        size={16} 
                        className={getStatusColor(device.status)} 
                      />
                      <span className={`text-xs ${getStatusColor(device.status)}`}>
                        {device.status === 'online' ? 'Онлайн' : 
                         device.status === 'offline' ? 'Оффлайн' : 'Ошибка'}
                      </span>
                    </div>
                  </div>
                  
                  {device.status === 'online' && (
                    <button
                      onClick={() => toggleDevice(device.id)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        device.isActive ? 'bg-purple-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          device.isActive ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'energy' && (
        <div className="space-y-4">
          {/* Текущее потребление */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-1">{energyData.current}</div>
              <div className="text-sm text-gray-600">кВт сейчас</div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">{energyData.today}</div>
              <div className="text-sm text-gray-600">кВт·ч сегодня</div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">{energyData.thisMonth}</div>
              <div className="text-sm text-gray-600">кВт·ч за месяц</div>
            </div>
            
            <div className="bg-white rounded-xl p-4 shadow-lg border border-gray-100 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">{energyData.cost.toFixed(0)}</div>
              <div className="text-sm text-gray-600">₽ к оплате</div>
            </div>
          </div>

          {/* График потребления */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="font-bold text-lg mb-4">📊 Потребление энергии</h3>
            
            <div className="space-y-3">
              {[
                { category: 'Освещение', consumption: 45.2, percent: 35, color: 'bg-yellow-500' },
                { category: 'Кухонная техника', consumption: 38.8, percent: 30, color: 'bg-blue-500' },
                { category: 'HVAC системы', consumption: 32.4, percent: 25, color: 'bg-orange-500' },
                { category: 'Электроника', consumption: 12.9, percent: 10, color: 'bg-purple-500' }
              ].map((item) => (
                <div key={item.category} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">{item.category}</span>
                      <span className="text-sm text-gray-600">{item.consumption} кВт·ч</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${item.color}`}
                        style={{ width: `${item.percent}%` }}
                      ></div>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500 w-10">{item.percent}%</span>
                </div>
              ))}
            </div>
          </div>

          {/* Рекомендации по экономии */}
          <div className="bg-green-50 rounded-xl p-6 border border-green-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white">
                <Icon name="Leaf" size={24} />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg mb-2 text-green-900">🌱 Рекомендации по энергосбережению</h3>
                <div className="space-y-2">
                  <div className="text-sm text-green-800">
                    • Отключите неиспользуемые устройства - экономия до 150 кВт·ч/мес
                  </div>
                  <div className="text-sm text-green-800">
                    • Используйте таймеры для освещения - экономия до 80 кВт·ч/мес
                  </div>
                  <div className="text-sm text-green-800">
                    • Оптимизируйте температуру кондиционера - экономия до 200 кВт·ч/мес
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="space-y-4">
          {/* Статус безопасности */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg">🛡️ Статус безопасности</h3>
              <div className="flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm font-medium">Система активна</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Icon name="Camera" size={32} className="text-green-600 mx-auto mb-2" />
                <div className="font-bold text-green-700">4</div>
                <div className="text-sm text-green-600">Камеры активны</div>
              </div>
              
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Icon name="Radar" size={32} className="text-blue-600 mx-auto mb-2" />
                <div className="font-bold text-blue-700">6</div>
                <div className="text-sm text-blue-600">Датчиков движения</div>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <Icon name="Shield" size={32} className="text-purple-600 mx-auto mb-2" />
                <div className="font-bold text-purple-700">24/7</div>
                <div className="text-sm text-purple-600">Мониторинг</div>
              </div>
            </div>
          </div>

          {/* События безопасности */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="font-bold text-lg mb-4">📋 Последние события</h3>
            
            <div className="space-y-3">
              {[
                {
                  type: 'motion',
                  message: 'Обнаружено движение во дворе',
                  time: '15:42',
                  status: 'info'
                },
                {
                  type: 'door',
                  message: 'Входная дверь открыта',
                  time: '14:28',
                  status: 'success'
                },
                {
                  type: 'camera',
                  message: 'Запись с камеры сохранена',
                  time: '12:15',
                  status: 'info'
                },
                {
                  type: 'sensor',
                  message: 'Датчик дыма: норма',
                  time: '10:00',
                  status: 'success'
                }
              ].map((event, index) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    event.status === 'success' ? 'bg-green-100' :
                    event.status === 'warning' ? 'bg-yellow-100' :
                    event.status === 'error' ? 'bg-red-100' : 'bg-blue-100'
                  }`}>
                    <Icon 
                      name={
                        event.type === 'motion' ? 'Radar' :
                        event.type === 'door' ? 'DoorOpen' :
                        event.type === 'camera' ? 'Camera' : 'Sensor'
                      } 
                      size={18} 
                      className={
                        event.status === 'success' ? 'text-green-600' :
                        event.status === 'warning' ? 'text-yellow-600' :
                        event.status === 'error' ? 'text-red-600' : 'text-blue-600'
                      }
                    />
                  </div>
                  
                  <div className="flex-1">
                    <div className="font-medium text-sm">{event.message}</div>
                    <div className="text-xs text-gray-500">Сегодня в {event.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Режимы безопасности */}
          <div className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
            <h3 className="font-bold text-lg mb-4">🔒 Режимы безопасности</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { mode: 'Дома', description: 'Только внешняя охрана', active: true },
                { mode: 'Ночь', description: 'Полная охрана + тишина', active: false },
                { mode: 'Отпуск', description: 'Максимальная защита', active: false }
              ].map((mode) => (
                <button
                  key={mode.mode}
                  className={`p-4 rounded-xl transition-all text-left ${
                    mode.active 
                      ? 'bg-red-100 border-2 border-red-300 text-red-800' 
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="font-medium">{mode.mode}</div>
                  <div className="text-sm opacity-75">{mode.description}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartHome;