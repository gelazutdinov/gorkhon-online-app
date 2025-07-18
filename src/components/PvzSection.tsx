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
      icon: "Package"
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
    <Card className="animate-fade-in rounded-2xl">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-gorkhon-blue">
          <Icon name="Package" size={20} />
          Пункты выдачи заказов
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {pvzData.map((pvz, index) => (
          <div key={index} className="p-4 rounded-2xl bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-100">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-3 rounded-2xl bg-purple-100">
                <Icon name={pvz.icon as any} size={20} className="text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium text-slate-800">{pvz.name}</h4>
                <p className="text-sm text-slate-600">{pvz.address}</p>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Icon name="Clock" size={14} className="text-green-600" />
                <span className="text-sm font-medium text-green-600">{pvz.schedule}</span>
              </div>
              
              <div className="space-y-3">
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
                    <p className="text-xs font-medium text-slate-700 mb-2">Фотографии ПВЗ:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {pvz.photos.map((photo, photoIndex) => (
                        <div 
                          key={photoIndex} 
                          className="relative cursor-pointer group"
                          onClick={() => pvz.photos && onOpenPhotoCarousel(pvz.photos, photoIndex)}
                        >
                          <img 
                            src={photo.url} 
                            alt={photo.caption}
                            className="w-full h-24 object-cover rounded-2xl border-2 border-slate-200 shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:border-purple-300"
                            loading="lazy"
                            style={{ 
                              imageRendering: 'crisp-edges',
                              filter: 'contrast(1.05) saturate(1.1)'
                            }}
                          />
                          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-2xl flex items-center justify-center">
                            <Icon name="ZoomIn" size={16} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                          <p className="text-xs text-slate-600 mt-1">{photo.caption}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default PvzSection;