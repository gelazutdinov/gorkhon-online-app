import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import Icon from "@/components/ui/icon";

interface PhotoCarouselProps {
  selectedImageIndex: number | null;
  selectedPvzPhotos: {url: string; caption: string}[];
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
  return (
    <Dialog open={selectedImageIndex !== null} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl w-full p-0 bg-black/95">
        {selectedImageIndex !== null && selectedPvzPhotos[selectedImageIndex] && (
          <div className="relative">
            <img
              src={selectedPvzPhotos[selectedImageIndex].url}
              alt={selectedPvzPhotos[selectedImageIndex].caption}
              className="w-full h-auto max-h-[80vh] object-contain"
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
            
            {/* Photo info */}
            <div className="absolute bottom-4 left-4 right-4 text-center">
              <p className="text-white text-sm bg-black/50 px-3 py-1 rounded">
                {selectedPvzPhotos[selectedImageIndex].caption}
              </p>
              {selectedPvzPhotos.length > 1 && (
                <p className="text-white/70 text-xs mt-1">
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