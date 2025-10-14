import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface Contact {
  id: string;
  title: string;
  phone: string;
  description?: string;
  isEmergency?: boolean;
}

const ContactManagement = () => {
  const [contacts, setContacts] = useState<Contact[]>(() => {
    const stored = localStorage.getItem('gorkhon_contacts');
    if (stored) return JSON.parse(stored);
    return [
      { id: '1', title: 'ФАП Горхон', phone: '+7 (XXX) XXX-XX-XX', description: 'Медицинская помощь', isEmergency: false },
      { id: '2', title: 'Скорая помощь', phone: '112', description: 'Экстренная медицинская помощь', isEmergency: true },
      { id: '3', title: 'Участковый', phone: '+7 (XXX) XXX-XX-XX', description: 'Охрана правопорядка', isEmergency: false },
      { id: '4', title: 'Диспетчер РЭС', phone: '+7 (XXX) XXX-XX-XX', description: 'Вопросы электроснабжения', isEmergency: false },
    ];
  });

  const [editingContact, setEditingContact] = useState<Contact | null>(null);

  const saveToStorage = (updatedContacts: Contact[]) => {
    localStorage.setItem('gorkhon_contacts', JSON.stringify(updatedContacts));
    setContacts(updatedContacts);
  };

  const handleSaveContact = (contact: Contact) => {
    if (editingContact?.id && editingContact.id !== 'new') {
      const updated = contacts.map(c => c.id === contact.id ? contact : c);
      saveToStorage(updated);
    } else {
      const newContact = { ...contact, id: Date.now().toString() };
      saveToStorage([...contacts, newContact]);
    }
    setEditingContact(null);
  };

  const handleDeleteContact = (id: string) => {
    if (confirm('Удалить контакт?')) {
      saveToStorage(contacts.filter(c => c.id !== id));
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800">Управление контактами</h2>
        <button
          onClick={() => setEditingContact({ id: 'new', title: '', phone: '', description: '', isEmergency: false })}
          className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-colors"
        >
          <Icon name="Plus" size={18} />
          Добавить контакт
        </button>
      </div>

      <div className="space-y-4">
        {contacts.map(contact => (
          <div key={contact.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow bg-white">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-gray-800">{contact.title}</h3>
                  {contact.isEmergency && (
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-1 rounded-full">
                      Экстренный
                    </span>
                  )}
                </div>
                <p className="text-blue-600 font-medium mt-1">{contact.phone}</p>
                {contact.description && (
                  <p className="text-gray-600 text-sm mt-1">{contact.description}</p>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingContact(contact)}
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                >
                  <Icon name="Pencil" size={18} />
                </button>
                <button
                  onClick={() => handleDeleteContact(contact.id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                >
                  <Icon name="Trash2" size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editingContact && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setEditingContact(null)}>
          <div className="bg-white rounded-xl p-6 w-full max-w-md" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-xl font-bold mb-4">
              {editingContact.id === 'new' ? 'Добавить контакт' : 'Редактировать контакт'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Название
                </label>
                <input
                  type="text"
                  value={editingContact.title}
                  onChange={(e) => setEditingContact({ ...editingContact, title: e.target.value })}
                  placeholder="Название организации"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Телефон
                </label>
                <input
                  type="tel"
                  value={editingContact.phone}
                  onChange={(e) => setEditingContact({ ...editingContact, phone: e.target.value })}
                  placeholder="+7 (XXX) XXX-XX-XX"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Описание
                </label>
                <input
                  type="text"
                  value={editingContact.description || ''}
                  onChange={(e) => setEditingContact({ ...editingContact, description: e.target.value })}
                  placeholder="Краткое описание"
                  className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isEmergency"
                  checked={editingContact.isEmergency}
                  onChange={(e) => setEditingContact({ ...editingContact, isEmergency: e.target.checked })}
                  className="w-4 h-4 text-pink-500 rounded focus:ring-pink-500"
                />
                <label htmlFor="isEmergency" className="text-sm text-gray-700">
                  Экстренный контакт
                </label>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => handleSaveContact(editingContact)}
                  disabled={!editingContact.title || !editingContact.phone}
                  className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 text-white py-2 rounded-lg hover:from-pink-600 hover:to-purple-700 transition-all disabled:opacity-50"
                >
                  Сохранить
                </button>
                <button
                  onClick={() => setEditingContact(null)}
                  className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Отмена
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContactManagement;
