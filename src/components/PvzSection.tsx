import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";

interface PvzPhoto {
  url: string;
  caption: string;
}

interface PvzItem {
  name: string;
  address: string;
  schedule: string;
  note: string;
  icon: string;
  photos?: PvzPhoto[];
}

interface PvzSectionProps {
  onOpenPhotoCarousel: (photos: PvzPhoto[], startIndex: number) => void;
}

const PvzSection = ({ onOpenPhotoCarousel }: PvzSectionProps) => {
  const pvzData: PvzItem[] = [
    {
      name: "ПВЗ Wildberries",
      address: "пос. Лесозаводской, ул. Трудовая, 12",
      schedule: "Ежедневно: 10:00-20:00",
      note: "",
      icon: "Package",
      photos: [
        {
          url: "https://cdn.poehali.dev/files/effd940b-46bf-46ab-b102-56fc7574bce1.png", 
          caption: "Вход в ПВЗ Wildberries"
        },
        {
          url: "https://cdn.poehali.dev/files/db11a90a-322e-4e28-acdb-1230afb19cf1.png",
          caption: "Интерьер ПВЗ Wildberries"
        },
        {
          url: "https://cdn.poehali.dev/files/dd085655-24de-4ab0-8877-256127c92015.png",
          caption: "Зона обслуживания ПВЗ Wildberries"
        },
        {
          url: "https://cdn.poehali.dev/files/93fc597d-3650-43d1-ad6c-7ce489b8e9c8.png",
          caption: "Примерочные кабины ПВЗ Wildberries"
        }
      ]
    },
    {
      name: "ПВЗ OZON",
      address: "пос. Лесозаводской, ул. Трудовая, 12",
      schedule: "Ежедневно: 10:00-20:00",
      note: "",
      icon: "Package",
      photos: [
        {
          url: "https://cdn.poehali.dev/files/4cb01698-d8de-4264-b9bc-e863b3667eb4.jpg",
          caption: "Фасад здания с ПВЗ OZON"
        },
        {
          url: "https://cdn.poehali.dev/files/528564ea-ccc2-46de-be3b-2faec284f4ea.jpg", 
          caption: "Рабочее место ПВЗ OZON"
        },
        {
          url: "https://cdn.poehali.dev/files/25a0c47e-7995-4c0b-a44e-440b27806401.jpg",
          caption: "Примерочные кабины ПВЗ OZON"
        }
      ]
    },
    {
      name: "ПВЗ OZON",
      address: "посёлок Горхон, ул. Железнодорожная, 31/2",
      schedule: "Ежедневно: 10:00 – 19:00",
      note: "",
      icon: "Package",
      photos: [
        {
          url: "https://cdn.poehali.dev/files/69129961-1abb-4f9d-add3-302072129183.png",
          caption: "ПВЗ OZON, посёлок Горхон, ул. Железнодорожная, 31/2. Автор: Команда Горхон"
        }
      ]
    },
    {
      name: "ПВЗ Wildberries",
      address: "п. Горхон, ул. Железнодорожная, д. 15",
      schedule: "Пн, Ср-Пт: 09:00-17:00 (перерыв 13:00-14:00), Сб: 09:00-16:00 (перерыв 13:00-14:00), Вт, Вс: выходной",
      note: "",
      icon: "Package",
      photos: [
        {
          url: "https://cdn.poehali.dev/files/aec305dc-bf96-4997-83aa-fdb9be3bfd4c.jpg",
          caption: "ПВЗ Wildberries, ул. Железнодорожная, 15"
        }
      ]
    }
  ];

  return (
    <Card className="animate-fade-in rounded-2xl bg-gradient-to-br from-white to-pink-50/30 border-2 border-gorkhon-pink/10 shadow-lg hover:shadow-xl transition-all duration-300">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-gorkhon-pink">
          <div className="p-2 rounded-full bg-gorkhon-pink/10 animate-pulse">
            <Icon name="Package" size={20} />
          </div>
          <div>
            <span className="text-lg font-bold">Пункты выдачи заказов</span>
            <p className="text-sm text-slate-600 font-normal">Доставка 360° прямо к вам</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {pvzData.map((pvz, index) => (
          <div key={index} className="group p-5 rounded-2xl bg-gradient-to-r from-purple-50/80 to-pink-50/80 hover:from-gorkhon-pink/5 hover:to-gorkhon-pink/10 border-2 border-purple-100/50 hover:border-gorkhon-pink/20 transition-all duration-300 hover:shadow-lg">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 group-hover:from-gorkhon-pink/20 group-hover:to-gorkhon-pink/10 transition-all duration-300">
                {pvz.name.includes("OZON") ? (
                  <img 
                    src="https://cdn.poehali.dev/files/32eb6963-076a-4663-ae00-1f8c03ea5d9b.jpg" 
                    alt="OZON Logo" 
                    className="w-8 h-8 object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                  />
                ) : pvz.name.includes("Wildberries") ? (
                  <img 
                    src="https://cdn.poehali.dev/files/38960a87-147c-4cc0-b90c-f662509e11d0.jpg" 
                    alt="Wildberries Logo" 
                    className="w-8 h-8 object-cover rounded-full group-hover:scale-110 transition-transform duration-300"
                  />
                ) : (
                  <Icon name={pvz.icon as any} size={22} className="text-purple-600 group-hover:text-gorkhon-pink group-hover:scale-110 transition-all duration-300" />
                )}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-slate-800 group-hover:text-gorkhon-pink transition-colors">{pvz.name}</h4>

                </div>
                <div className="flex items-center gap-2">
                  <Icon name="MapPin" size={14} className="text-slate-500" />
                  <p className="text-sm text-slate-600">{pvz.address}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-2 rounded-xl bg-green-50 border border-green-200/50">
                <Icon name="Clock" size={16} className="text-green-600" />
                <span className="text-sm font-semibold text-green-700">{pvz.schedule}</span>
              </div>
              
              <div className="space-y-4">
                {pvz.photos ? (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-blue-600">{pvz.note}</span>
                  </div>
                ) : pvz.note ? (
                  <div className="flex items-center gap-2">
                    <Icon name="Navigation" size={14} className="text-blue-600" />
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-sm text-blue-600 hover:text-gorkhon-blue p-0 h-auto font-normal"
                      onClick={() => {
                        const query = encodeURIComponent(pvz.address);
                        window.open(`https://yandex.ru/maps/?text=${query}`, '_blank');
                      }}
                    >
                      {pvz.note}
                    </Button>
                  </div>
                ) : null}
                
                {pvz.photos && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon name="Camera" size={16} className="text-gorkhon-pink" />
                      <p className="text-sm font-semibold text-gorkhon-pink">Фотографии ПВЗ:</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      {pvz.photos.map((photo, photoIndex) => (
                        <div 
                          key={photoIndex} 
                          className="relative cursor-pointer group/photo"
                          onClick={() => pvz.photos && onOpenPhotoCarousel(pvz.photos, photoIndex)}
                        >
                          <div className="relative overflow-hidden rounded-2xl">
                            <img 
                              src={photo.url} 
                              alt={photo.caption}
                              className="w-full h-28 object-cover border-2 border-slate-200 shadow-sm transition-all duration-300 group-hover/photo:scale-110 group-hover/photo:shadow-xl group-hover/photo:border-gorkhon-pink/30"
                              loading="lazy"
                              style={{ 
                                imageRendering: 'crisp-edges',
                                filter: 'contrast(1.05) saturate(1.1)'
                              }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover/photo:from-black/40 transition-all duration-300 rounded-2xl flex items-center justify-center">
                              <div className="p-2 rounded-full bg-white/90 opacity-0 group-hover/photo:opacity-100 transition-all duration-300 transform scale-75 group-hover/photo:scale-100">
                                <Icon name="ZoomIn" size={16} className="text-gorkhon-pink" />
                              </div>
                            </div>
                          </div>
                          <p className="text-xs text-slate-600 mt-2 font-medium leading-relaxed">{photo.caption}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        <div className="mt-6 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200/50">
          <div className="flex items-center gap-2 text-purple-800 mb-2">
            <Icon name="Truck" size={16} />
            <p className="text-sm font-semibold">Удобство 360°</p>
          </div>
          <p className="text-xs text-purple-700">Получайте заказы в удобных для вас точках!</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default PvzSection;