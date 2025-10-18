import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Icon from "@/components/ui/icon";
import { useState, useCallback, useMemo } from "react";

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

interface PhotoCarouselProps {
  photos: PvzPhoto[];
  onPhotoClick: (photos: PvzPhoto[], startIndex: number) => void;
}

const PhotoCarousel = ({ photos, onPhotoClick }: PhotoCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  
  // Минимальная дистанция свайпа для срабатывания
  const minSwipeDistance = 50;
  
  const nextPhoto = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);
  
  const prevPhoto = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);
  
  const goToPhoto = useCallback((index: number) => {
    setCurrentIndex(index);
  }, []);
  
  // Обработчики для свайпов
  const onTouchStart = useCallback((e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  }, []);
  
  const onTouchMove = useCallback((e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  }, []);
  
  const onTouchEnd = useCallback(() => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      nextPhoto();
    } else if (isRightSwipe) {
      prevPhoto();
    }
  }, [touchStart, touchEnd, minSwipeDistance, nextPhoto, prevPhoto]);
  
  return (
    <div className="space-y-3">
      {/* Main photo */}
      <div 
        className="relative overflow-hidden rounded-2xl group"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <img 
          src={photos[currentIndex].url}
          alt={photos[currentIndex].caption}
          className="w-full h-48 md:h-64 object-cover border-2 border-slate-200 shadow-lg cursor-pointer transition-all duration-500 hover:scale-105 hover:shadow-xl hover:border-gorkhon-pink/40 select-none"
          onClick={() => onPhotoClick(photos, currentIndex)}
          loading="lazy"
          draggable={false}
          style={{ 
            imageRendering: 'crisp-edges',
            filter: 'contrast(1.05) saturate(1.1)',
            userSelect: 'none'
          }}
        />
        
        {/* Navigation arrows - как в ВК */}
        {photos.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                prevPhoto();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/95 hover:bg-white backdrop-blur-sm shadow-lg opacity-80 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10 flex items-center justify-center border border-white/20"
            >
              <Icon name="ChevronLeft" size={20} className="text-gray-700" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                nextPhoto();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/95 hover:bg-white backdrop-blur-sm shadow-lg opacity-80 group-hover:opacity-100 transition-all duration-300 hover:scale-110 z-10 flex items-center justify-center border border-white/20"
            >
              <Icon name="ChevronRight" size={20} className="text-gray-700" />
            </button>
          </>
        )}
        
        {/* Zoom icon overlay - стиль ВК */}
        <div 
          className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-black/10 hover:from-black/50 hover:to-black/20 transition-all duration-300 rounded-2xl flex items-center justify-center cursor-pointer"
          onClick={() => {
            onPhotoClick(photos, currentIndex);
          }}
        >
          <div className="p-3 rounded-full bg-white/90 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100 pointer-events-none shadow-lg">
            <Icon name="Expand" size={18} className="text-gray-700" />
          </div>
        </div>
        
        {/* Счетчик фото как в ВК */}
        {photos.length > 1 && (
          <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-black/60 backdrop-blur-sm text-white text-xs font-medium">
            {currentIndex + 1} / {photos.length}
          </div>
        )}
      </div>
      
      {/* Индикаторы как в ВК */}
      {photos.length > 1 && (
        <div className="flex justify-center gap-1">
          {photos.map((_, index) => (
            <button
              key={index}
              onClick={() => goToPhoto(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-gorkhon-pink scale-110' 
                  : 'bg-slate-300 hover:bg-slate-400'
              }`}
            />
          ))}
        </div>
      )}
      
      {/* Caption */}
      <p className="text-xs text-slate-600 font-medium leading-relaxed text-center">
        {photos[currentIndex].caption}
      </p>
      
      {/* Превью фото как в ВК */}
      {photos.length > 3 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
          {photos.map((photo, index) => (
            <button
              key={index}
              onClick={() => goToPhoto(index)}
              className={`flex-shrink-0 w-12 h-8 sm:w-14 sm:h-9 overflow-hidden rounded-md border transition-all duration-300 ${
                index === currentIndex 
                  ? 'border-2 border-gorkhon-pink shadow-md scale-105' 
                  : 'border border-slate-200 hover:border-slate-300 opacity-70 hover:opacity-90'
              }`}
            >
              <img 
                src={photo.url}
                alt={photo.caption}
                className="w-full h-full object-cover"
                loading="lazy"
                draggable={false}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const PvzSection = ({ onOpenPhotoCarousel }: PvzSectionProps) => {
  const pvzData: PvzItem[] = useMemo(() => [
    {
      name: "Wildberries",
      address: "пос. Лесозаводской, ул. Трудовая, 12",
      schedule: "Ежедневно: 10:00-20:00",
      note: "Примерочные: 2 шт. Пункт выдачи заказов находится в центре посёлка Лесозаводской, напротив школы. Удобная парковка. Будем рады видеть Вас в нашем ПВЗ!",
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
      name: "OZON",
      address: "пос. Лесозаводской, ул. Трудовая, 12",
      schedule: "Ежедневно: 10:00-20:00",
      note: "Примерочные: 2 шт. Пункт выдачи заказов находится напротив школы, рядом со зданием бывшей амбулатории, ориентир — вывеска Ozon. До встречи на Ozon!",
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
      name: "OZON",
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
      name: "Wildberries",
      address: "п. Горхон, ул. Железнодорожная, д. 15",
      schedule: "Пн, Ср-Пт: 09:00-17:00 (перерыв 13:00-14:00), Сб: 09:00-16:00 (перерыв 13:00-14:00), Вт, Вс: выходной",
      note: "ПВЗ находится в отделении почты 671333",
      icon: "Package",
      photos: [
        {
          url: "https://cdn.poehali.dev/files/aec305dc-bf96-4997-83aa-fdb9be3bfd4c.jpg",
          caption: "ПВЗ Wildberries, ул. Железнодорожная, 15"
        }
      ]
    }
  ], []);

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
                <div className="flex items-start gap-2">
                  <Icon name="MapPin" size={14} className="text-slate-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-600 break-words">{pvz.address}</p>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-start gap-2 p-2 rounded-xl bg-green-50 border border-green-200/50">
                <Icon name="Clock" size={16} className="text-green-600 flex-shrink-0 mt-0.5" />
                <span className="text-sm font-semibold text-green-700 break-words">{pvz.schedule}</span>
              </div>
              
              <div className="space-y-4">
                {pvz.note && (
                  <div className="space-y-3">
                    {pvz.note.includes("Примерочные") && (
                      <div className="p-3 rounded-xl bg-purple-50/80 border border-purple-200/50">
                        <div className="flex items-center gap-2">
                          <Icon name="ShoppingBag" size={14} className="text-purple-600" />
                          <p className="text-sm font-bold text-purple-900">Примерочные</p>
                          <p className="text-sm text-purple-700">2 шт.</p>
                        </div>
                      </div>
                    )}
                    
                    {(pvz.note.includes("Пункт выдачи заказов находится в центре") || pvz.note.includes("напротив школы")) && !pvz.note.includes("почты") && (
                      <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Icon name="MapPin" size={14} className="text-blue-600" />
                          <p className="text-sm font-bold text-blue-900">Как добраться</p>
                        </div>
                        <p className="text-sm text-blue-700 leading-relaxed">
                          {pvz.note.includes("Пункт выдачи заказов находится в центре")
                            ? "Пункт выдачи заказов находится в центре посёлка Лесозаводской, напротив школы. Удобная парковка. Будем рады видеть Вас в нашем ПВЗ!"
                            : pvz.note}
                        </p>
                      </div>
                    )}
                    
                    {pvz.note.includes("почты") && (
                      <div className="p-3 rounded-xl bg-blue-50/80 border border-blue-200/50">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon name="MapPin" size={14} className="text-blue-600" />
                          <p className="text-sm font-bold text-blue-900">Как добраться</p>
                        </div>
                        <p className="text-sm text-blue-700">{pvz.note}</p>
                      </div>
                    )}
                  </div>
                )}
                
                {pvz.photos && (
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <Icon name="Camera" size={16} className="text-gorkhon-pink" />
                      <p className="text-sm font-semibold text-gorkhon-pink">Фотографии ПВЗ:</p>
                    </div>
                    <PhotoCarousel 
                      photos={pvz.photos} 
                      onPhotoClick={(photos, startIndex) => onOpenPhotoCarousel(photos, startIndex)}
                    />
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