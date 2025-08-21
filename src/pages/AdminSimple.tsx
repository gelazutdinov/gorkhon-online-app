const AdminSimple = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Админ-панель
        </h1>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Добро пожаловать!</h2>
          <p className="text-gray-600">
            Админ-панель успешно загружена. Роутинг работает корректно.
          </p>
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <p className="text-blue-700">
              <strong>Доступ:</strong> smm@gelazutdinov.ru
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSimple;