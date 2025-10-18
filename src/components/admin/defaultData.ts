import { ImportantNumber, WorkScheduleItem, PvzItem, HelpItem } from './types';

export const getDefaultNumbers = (): ImportantNumber[] => [
  { name: "ФАП Горхон", person: "Аяна Анатольевна", phone: "89244563184", icon: "Phone" },
  { name: "Участковый", person: "Алексей", phone: "+7999-275-34-13", icon: "Shield" },
  { name: "Скорая помощь", person: "Служба экстренного вызова", phone: "112", icon: "Ambulance" },
  { name: "Скорая помощь (новый)", person: "Дополнительный номер", phone: "73013645103", icon: "Ambulance" },
  { name: "Диспетчер РЭС", person: "Электроснабжение", phone: "+73012344083", icon: "Zap" },
  { name: "МФЦ Заиграево", person: "Многофункциональный центр", phone: "+73013641101", icon: "Building" },
  { name: "Соц.защита Заиграево", person: "Социальная защита населения", phone: "+73013641220", icon: "Heart" },
  { name: "Регистратура поликлиники", person: "Заиграево", phone: "+79245559003", icon: "Stethoscope" },
  { name: "Нотариус Заиграево", person: "Нотариальные услуги", phone: "+73013641614", icon: "FileText" },
  { name: "Судебные приставы", person: "Заиграевский район", phone: "83013641010", icon: "Scale" },
  { name: "Вакуумная машина", person: "Кондаков К.Ю., Горхон", phone: "+79834539902", icon: "Truck" },
  { name: "Почта Горхон", person: "Елена", phone: "8-914-843-45-93", icon: "Mail" },
  { name: "Миграционная служба ГАИ", person: "Пн 9:00-12:30, Вт-Чт 9:00-15:00, Пт выходной", phone: "8-3013-64-15-70", icon: "Car" }
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
