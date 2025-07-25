import Icon from '@/components/ui/icon';

const DoctorAppointment = () => {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <div className="bg-green-100 p-3 rounded-full">
            <Icon name="Stethoscope" size={24} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">Запись к врачу</h2>
        </div>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          Записывайтесь на прием к врачу в поликлинику поселка. 
          Онлайн-запись поможет вам выбрать удобное время.
        </p>

        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-3 mb-3">
            <Icon name="Calendar" size={20} className="text-green-600" />
            <span className="font-semibold text-gray-800">Режим работы</span>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <div>Пн-Пт: 8:00 - 16:00</div>
            <div>Сб: 9:00 - 13:00</div>
            <div>Вс: выходной</div>
          </div>
        </div>

        <div className="grid gap-3">
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Icon name="Phone" size={16} className="text-blue-500" />
            <span>Справки: +7 (XXX) XXX-XX-XX</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <Icon name="MapPin" size={16} className="text-red-500" />
            <span>ул. Центральная, д. 1</span>
          </div>
        </div>

        <div className="mt-6 p-4 bg-yellow-50 rounded-xl border border-yellow-200">
          <div className="flex items-center gap-2 mb-2">
            <Icon name="Info" size={16} className="text-yellow-600" />
            <span className="font-medium text-yellow-800">Важно</span>
          </div>
          <p className="text-xs text-yellow-700">
            При себе иметь паспорт и медицинский полис. 
            За 15 минут до приема явиться в регистратуру.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DoctorAppointment;