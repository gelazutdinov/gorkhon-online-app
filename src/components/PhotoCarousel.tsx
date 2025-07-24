import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
      <DialogContent className="max-w-4xl w-full p-0 bg-black/95">
        {selectedImageIndex !== null && selectedPvzPhotos.length > 0 && selectedPvzPhotos[selectedImageIndex] && (
          <div className="relative">
            <img
              src={selectedPvzPhotos[selectedImageIndex].url}
              alt={selectedPvzPhotos[selectedImageIndex].caption}
              className="w-full h-auto max-h-[80vh] object-contain"
              loading="lazy"
              onError={(e) => {
                console.error('Failed to load image:', selectedPvzPhotos[selectedImageIndex].url);
                e.currentTarget.style.display = 'none';
              }}
            />
            
            {/* Navigation buttons */}
            {selectedPvzPhotos.length > 1 && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={onPrev}
                >
                  <Icon name="ChevronLeft" size={24} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white"
                  onClick={onNext}
                >
                  <Icon name="ChevronRight" size={24} />
                </Button>
              </>
            )}
            
            {/* Close button */}
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white"
              onClick={onClose}
            >
              <Icon name="X" size={24} />
            </Button>
            
            {/* Photo indicators */}
            {selectedPvzPhotos.length > 1 && (
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex gap-2">
                {selectedPvzPhotos.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === selectedImageIndex 
                        ? 'bg-white scale-125' 
                        : 'bg-white/50 hover:bg-white/75'
                    }`}
                  />
                ))}
              </div>
            )}
            
            {/* Photo info */}
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <p className="text-white text-sm bg-black/70 px-4 py-2 rounded-lg backdrop-blur-sm">
                {selectedPvzPhotos[selectedImageIndex].caption}
              </p>
              {selectedPvzPhotos.length > 1 && (
                <p className="text-white/80 text-xs mt-2 bg-black/50 px-3 py-1 rounded-full inline-block">
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