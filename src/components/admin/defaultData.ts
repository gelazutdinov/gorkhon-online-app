import { ImportantNumber, WorkScheduleItem, PvzItem, HelpItem } from './types';

export const getDefaultNumbers = (): ImportantNumber[] => [
  { name: "ФАП Горхон", person: "Медпункт поселка", phone: "+7 (301-36) 9-46-25", icon: "Phone" },
  { name: "Участковый", person: "Бадмаев Баир Баторович", phone: "+7 (924) 754-32-18", icon: "Shield" },
  { name: "Экстренные службы", person: "Полиция, скорая, пожарная", phone: "112", icon: "Ambulance" },
  { name: "Диспетчер РЭС", person: "Электроснабжение 24/7", phone: "8-800-100-75-40", icon: "Zap" },
  { name: "МФЦ Заиграево", person: "Многофункциональный центр", phone: "+7 (301-36) 4-15-15", icon: "Building" },
  { name: "Почта Горхон", person: "Почтовое отделение", phone: "+7 (301-36) 9-42-31", icon: "Mail" },
  { name: "Регистратура поликлиники", person: "Заиграево", phone: "+7 (924) 555-90-03", icon: "Stethoscope" },
  { name: "Соц.защита Заиграево", person: "Социальная защита населения", phone: "+7 (301-36) 4-12-20", icon: "Heart" },
  { name: "Нотариус Заиграево", person: "Нотариальные услуги", phone: "+7 (301-36) 4-16-14", icon: "FileText" },
  { name: "Судебные приставы", person: "Заиграевский район", phone: "8 (301-36) 4-10-10", icon: "Scale" },
  { name: "Вакуумная машина", person: "Кондаков К.Ю., Горхон", phone: "+7 (983) 453-99-02", icon: "Truck" },
  { name: "Миграционная служба", person: "ГАИ Заиграево", phone: "8 (301-36) 4-15-70", icon: "Car" },
  { name: "ЕДДС района", person: "Диспетчерская служба 24/7", phone: "+7 (301-36) 4-51-03", icon: "AlertCircle" }
];

export const getDefaultTransit = (): ImportantNumber[] => [
  { name: "Диспетчер Город", person: "Заиграевский транзит", phone: "8-983-420-04-03", icon: "Bus" },
  { name: "Диспетчер Заиграево", person: "Заиграевский транзит", phone: "8-983-420-04-90", icon: "Bus" }
];

export const getDefaultHelp = (): HelpItem[] => [
  {
    title: "ФОНД поселка",
    description: "Ирина Н.П - Обязательно пишем 'ФОНД поселка'",
    contact: "408 178 109 091 606 626 11",
    icon: "Home"
  },
  {
    title: "Помощь церкви ⛪️",
    description: "Голофаева В. - Поддержка храма",
    contact: "89024562839",
    icon: "Heart"
  },
  {
    title: "Помощь бойцам 🪖",
    description: "Олеся Николаевна Н. - В теме: 'Помощь Бойцам'",
    contact: "89246210100",
    icon: "Shield"
  }
];

export const getDefaultSchedule = (): WorkScheduleItem[] => [
  { name: "Почта", schedule: "ПН, СР, ЧТ, ПТ: 9-17ч, СБ: 9-16ч. Обед: 13-14ч. ВТ, ВС - выходные", icon: "Mail" },
  { name: "Сбербанк", schedule: "ВТ, ПТ: 9-17ч. Обед: 12:30-13:30. ПН, СР, ЧТ, СБ, ВС - выходные", icon: "CreditCard" },
  { name: "МУП ЖКХ", schedule: "ПН-ПТ: 8-16ч. Обед: 12-13ч", icon: "Wrench" }
];

export const getDefaultPvz = (): PvzItem[] => [
  {
    name: "Wildberries ПВЗ",
    address: "ул. Центральная, 1",
    schedule: "Пн-Вс: 10:00-20:00",
    phone: "89012345678",
    hasFitting: true,
    photos: []
  }
];