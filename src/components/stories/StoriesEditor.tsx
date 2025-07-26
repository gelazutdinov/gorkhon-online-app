import React from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { StoryElement, PanelType } from './types';
import { PHOTO_FILTERS, TEXT_STYLES, TEXT_COLORS, STICKER_CATEGORIES, MUSIC_TRACKS } from './constants';

interface StoriesEditorProps {
  selectedImage: string;
  selectedFilter: string;
  storyElements: StoryElement[];
  activePanel: PanelType;
  selectedMusic?: any;
  textInput: string;
  selectedTextStyle: string;
  selectedTextColor: string;
  onBack: () => void;
  onPublish: () => void;
  onFilterChange: (filterId: string) => void;
  onPanelChange: (panel: PanelType) => void;
  onTextInputChange: (text: string) => void;
  onTextStyleChange: (style: string) => void;
  onTextColorChange: (color: string) => void;
  onAddText: () => void;
  onAddSticker: (sticker: any) => void;
  onAddMusic: (track: any) => void;
  onRemoveMusic: () => void;
}

const StoriesEditor: React.FC<StoriesEditorProps> = ({
  selectedImage,
  selectedFilter,
  storyElements,
  activePanel,
  selectedMusic,
  textInput,
  selectedTextStyle,
  selectedTextColor,
  onBack,
  onPublish,
  onFilterChange,
  onPanelChange,
  onTextInputChange,
  onTextStyleChange,
  onTextColorChange,
  onAddText,
  onAddSticker,
  onAddMusic,
  onRemoveMusic
}) => {
  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Header */}
      <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={onBack}
          className="text-white hover:bg-white/20"
        >
          <Icon name="ArrowLeft" size={20} />
        </Button>
        <h1 className="text-white font-medium">Редактировать</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={onPublish}
          className="text-white hover:bg-white/20"
        >
          Опубликовать
        </Button>
      </div>

      {/* Story Preview */}
      <div className="relative w-full h-full pt-16 pb-32">
        <div className="relative w-full h-full flex items-center justify-center">
          <img 
            src={selectedImage}
            alt="Story preview"
            className={`w-full h-full object-cover ${PHOTO_FILTERS.find(f => f.id === selectedFilter)?.className || ''}`}
          />
          
          {/* Story Elements */}
          {storyElements.map(element => (
            <div
              key={element.id}
              className="absolute cursor-move"
              style={{
                left: `${element.x}%`,
                top: `${element.y}%`,
                transform: 'translate(-50%, -50%)'
              }}
            >
              {element.type === 'text' && (
                <div
                  className={`text-center px-3 py-1 rounded ${element.style?.animation || ''}`}
                  style={element.style}
                >
                  {element.content}
                </div>
              )}
              {element.type === 'sticker' && (
                <div className="flex items-center gap-1 bg-white/90 px-2 py-1 rounded-full text-sm">
                  <span>{element.stickerType}</span>
                  <span className="text-gray-800">{element.content}</span>
                </div>
              )}
            </div>
          ))}

          {/* Music Widget */}
          {selectedMusic && (
            <div className="absolute bottom-20 left-4 flex items-center gap-3 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-full">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <span className="text-lg">{selectedMusic.cover}</span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">{selectedMusic.title}</p>
                <p className="text-white/70 text-xs">{selectedMusic.artist}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={onRemoveMusic}
                className="text-white hover:bg-white/20 ml-2"
              >
                <Icon name="X" size={16} />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Filters Bar */}
      {activePanel === 'filters' && (
        <div className="absolute bottom-32 left-0 right-0 p-4">
          <div className="flex gap-3 overflow-x-auto pb-2">
            {PHOTO_FILTERS.map(filter => (
              <button
                key={filter.id}
                onClick={() => onFilterChange(filter.id)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                  selectedFilter === filter.id ? 'border-white' : 'border-transparent'
                }`}
              >
                <img 
                  src={selectedImage}
                  alt={filter.name}
                  className={`w-full h-full object-cover ${filter.className}`}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Tools Bar */}
      <div className="absolute bottom-16 left-4 right-4 flex justify-center gap-6">
        <Button
          variant={activePanel === 'text' ? 'default' : 'secondary'}
          size="sm"
          onClick={() => onPanelChange(activePanel === 'text' ? null : 'text')}
          className="flex flex-col items-center gap-1 h-auto py-2"
        >
          <Icon name="Type" size={20} />
          <span className="text-xs">Текст</span>
        </Button>
        <Button
          variant={activePanel === 'stickers' ? 'default' : 'secondary'}
          size="sm"
          onClick={() => onPanelChange(activePanel === 'stickers' ? null : 'stickers')}
          className="flex flex-col items-center gap-1 h-auto py-2"
        >
          <Icon name="Smile" size={20} />
          <span className="text-xs">Стикеры</span>
        </Button>
        <Button
          variant={activePanel === 'music' ? 'default' : 'secondary'}
          size="sm"
          onClick={() => onPanelChange(activePanel === 'music' ? null : 'music')}
          className="flex flex-col items-center gap-1 h-auto py-2"
        >
          <Icon name="Music" size={20} />
          <span className="text-xs">Музыка</span>
        </Button>
      </div>

      {/* Text Panel */}
      {activePanel === 'text' && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-4 rounded-t-2xl">
          <div className="space-y-4">
            <input
              type="text"
              value={textInput}
              onChange={(e) => onTextInputChange(e.target.value)}
              placeholder="Введите текст..."
              className="w-full px-4 py-2 bg-white/10 text-white placeholder-white/50 rounded-lg border border-white/20"
            />
            
            <div className="flex gap-2 overflow-x-auto">
              {TEXT_STYLES.map(style => (
                <button
                  key={style.id}
                  onClick={() => onTextStyleChange(style.id)}
                  className={`flex-shrink-0 px-3 py-2 rounded-lg text-sm ${
                    selectedTextStyle === style.id ? 'bg-white text-black' : 'bg-white/20 text-white'
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>

            <div className="flex gap-2 overflow-x-auto">
              {TEXT_COLORS.map(color => (
                <button
                  key={color}
                  onClick={() => onTextColorChange(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedTextColor === color ? 'border-white' : 'border-white/30'
                  }`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            <Button onClick={onAddText} className="w-full">
              Готово
            </Button>
          </div>
        </div>
      )}

      {/* Stickers Panel */}
      {activePanel === 'stickers' && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-4 rounded-t-2xl max-h-96 overflow-y-auto">
          <div className="space-y-4">
            {Object.entries(STICKER_CATEGORIES).map(([category, stickers]) => (
              <div key={category}>
                <h3 className="text-white font-medium mb-2">{category}</h3>
                <div className="grid grid-cols-3 gap-2">
                  {stickers.map(sticker => (
                    <button
                      key={sticker.id}
                      onClick={() => onAddSticker(sticker)}
                      className="flex items-center gap-2 p-2 bg-white/10 rounded-lg text-white hover:bg-white/20"
                    >
                      <span>{sticker.emoji}</span>
                      <span className="text-sm">{sticker.text}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Music Panel */}
      {activePanel === 'music' && (
        <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-4 rounded-t-2xl">
          <div className="space-y-3">
            {MUSIC_TRACKS.map(track => (
              <button
                key={track.id}
                onClick={() => onAddMusic(track)}
                className="w-full flex items-center gap-3 p-3 bg-white/10 rounded-lg text-white hover:bg-white/20"
              >
                <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                  <span className="text-xl">{track.cover}</span>
                </div>
                <div className="flex-1 text-left">
                  <p className="font-medium">{track.title}</p>
                  <p className="text-sm text-white/70">{track.artist} • {track.duration}с</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default StoriesEditor;