import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import Icon from "@/components/ui/icon";
import { useEffect } from "react";

interface Photo {
  url: string;
  caption: string;
}

interface PhotoCarouselProps {
  selectedImageIndex: number | null;
  selectedPvzPhotos: Photo[];
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const PhotoCarousel = ({ 
  selectedImageIndex, 
  selectedPvzPhotos, 
  onClose, 
  onNext, 
  onPrev 
}: PhotoCarouselProps) => {
  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (selectedImageIndex === null) return;
      
      switch (event.key) {
        case 'ArrowLeft':
          onPrev();
          break;
        case 'ArrowRight':
          onNext();
          break;
        case 'Escape':
          onClose();
          break;
      }
    };

    if (selectedImageIndex !== null) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedImageIndex, onNext, onPrev, onClose]);
  
  return (
    <Dialog open={selectedImageIndex !== null} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 bg-black/95 max-h-[100dvh] md:max-h-screen overflow-hidden">
        <VisuallyHidden>
          <DialogTitle>Просмотр фото</DialogTitle>
        </VisuallyHidden>
        {selectedImageIndex !== null && selectedPvzPhotos.length > 0 && selectedPvzPhotos[selectedImageIndex] && (
          <div className="relative flex items-center justify-center min-h-0">
            <img
              src={selectedPvzPhotos[selectedImageIndex].url}
              alt={selectedPvzPhotos[selectedImageIndex].caption}
              className="w-full h-auto max-h-[90vh] sm:max-h-[80vh] object-contain touch-pan-x touch-pan-y"
              loading="lazy"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
            
            {/* Navigation buttons */}
            {selectedPvzPhotos.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white min-touch z-10"
                  onClick={onPrev}
                >
                  <Icon name="ChevronLeft" size={20} className="sm:w-6 sm:h-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white min-touch z-10"
                  onClick={onNext}
                >
                  <Icon name="ChevronRight" size={20} className="sm:w-6 sm:h-6" />
                </Button>
              </>
            )}
            
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 sm:top-4 sm:right-4 bg-black/50 hover:bg-black/70 text-white min-touch z-10"
              onClick={onClose}
            >
              <Icon name="X" size={20} className="sm:w-6 sm:h-6" />
            </Button>
            
            {/* Photo indicators */}
            {selectedPvzPhotos.length > 1 && (
              <div className="absolute top-2 left-1/2 -translate-x-1/2 flex gap-1 sm:gap-2 z-10">
                {selectedPvzPhotos.map((_, index) => (
                  <div
                    key={index}
                    className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full transition-all duration-300 ${
                      index === selectedImageIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            )}
            
            {/* Photo info */}
            <div className="absolute bottom-2 sm:bottom-4 left-2 right-2 sm:left-4 sm:right-4 text-center z-10 safe-area-bottom">
              <p className="text-white text-xs sm:text-sm bg-black/70 px-3 sm:px-4 py-2 rounded-lg backdrop-blur-sm break-words">
                {selectedPvzPhotos[selectedImageIndex].caption}
              </p>
              {selectedPvzPhotos.length > 1 && (
                <p className="text-white/80 text-xs mt-2 bg-black/50 px-2 sm:px-3 py-1 rounded-full inline-block">
                  {selectedImageIndex + 1} из {selectedPvzPhotos.length}
                </p>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default PhotoCarousel;