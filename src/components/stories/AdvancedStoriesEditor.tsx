import Icon from '@/components/ui/icon';
import { TextElement, StickerElement, MusicElement } from './advanced-types';
import { filters, textStyles, stickerCategories, musicTracks, textColors } from './advanced-constants';

interface AdvancedStoriesEditorProps {
  capturedImage: string;
  selectedFilter: string;
  textElements: TextElement[];
  stickerElements: StickerElement[];
  selectedMusic: MusicElement | null;
  activeTextEditor: string | null;
  activeStickerPanel: string | null;
  onFilterChange: (filter: string) => void;
  onAddText: () => void;
  onUpdateText: (id: string, updates: Partial<TextElement>) => void;
  onAddSticker: (category: string, content: string) => void;
  onMusicSelect: (music: MusicElement) => void;
  onMusicRemove: () => void;
  onTextEditorClose: () => void;
  onStickerPanelToggle: (panel: string | null) => void;
  onBack: () => void;
  onPublish: () => void;
}

const AdvancedStoriesEditor = ({
  capturedImage,
  selectedFilter,
  textElements,
  stickerElements,
  selectedMusic,
  activeTextEditor,
  activeStickerPanel,
  onFilterChange,
  onAddText,
  onUpdateText,
  onAddSticker,
  onMusicSelect,
  onMusicRemove,
  onTextEditorClose,
  onStickerPanelToggle,
  onBack,
  onPublish
}: AdvancedStoriesEditorProps) => {
  const renderTextElement = (textEl: TextElement) => {
    const sizeClasses = {
      small: 'text-lg',
      medium: 'text-2xl',
      large: 'text-4xl'
    };

    const animationClasses = {
      fade: 'animate-fade-in',
      slide: 'animate-slide-in',
      pulse: 'animate-pulse',
      rotate: 'animate-spin',
      zoom: 'animate-zoom-in'
    };

    return (
      <div
        key={textEl.id}
        className={`absolute cursor-move ${sizeClasses[textEl.size]} ${animationClasses[textEl.animation || 'fade']}`}
        style={{
          left: `${textEl.x}%`,
          top: `${textEl.y}%`,
          color: textEl.color,
          fontFamily: textEl.style === 'classic' ? 'Arial' :
                     textEl.style === 'modern' ? 'Helvetica' :
                     textEl.style === 'neon' ? 'Impact' :
                     textEl.style === 'typewriter' ? 'Courier' : 'Arial',
          fontWeight: textEl.style === 'modern' ? '300' : 'bold',
          letterSpacing: textEl.style === 'modern' ? '2px' : 'normal',
          textShadow: textEl.style === 'neon' ? `0 0 10px ${textEl.color}` :
                     textEl.style === 'shadow' ? '2px 2px 4px rgba(0,0,0,0.8)' : 'none',
          background: textEl.style === 'gradient' ? 'linear-gradient(45deg, #ff6b6b, #4ecdc4)' : 'none',
          WebkitBackgroundClip: textEl.style === 'gradient' ? 'text' : 'initial',
          WebkitTextFillColor: textEl.style === 'gradient' ? 'transparent' : 'initial'
        }}
        onClick={() => onStickerPanelToggle(null)}
      >
        {textEl.text}
      </div>
    );
  };

  const renderStickerElement = (sticker: StickerElement) => {
    return (
      <div
        key={sticker.id}
        className="absolute cursor-move"
        style={{
          left: `${sticker.x}%`,
          top: `${sticker.y}%`,
          transform: `rotate(${sticker.rotation || 0}deg) scale(${sticker.size})`,
          fontSize: sticker.type === 'emoji' ? '2rem' : '1.2rem'
        }}
      >
        {sticker.content}
      </div>
    );
  };

  return (
    <div className="w-full h-full flex flex-col">
      {/* Верхняя панель */}
      <div className="flex items-center justify-between p-4 text-white bg-black/50 backdrop-blur-sm">
        <button onClick={onBack}>
          <Icon name="ArrowLeft" size={24} />
        </button>
        <h3 className="font-semibold">Редактировать</h3>
        <button
          onClick={onPublish}
          className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full text-sm font-medium"
        >
          Опубликовать
        </button>
      </div>

      {/* Превью */}
      <div className="flex-1 relative overflow-hidden">
        <img 
          src={capturedImage}
          alt=""
          className="w-full h-full object-cover"
          style={{ filter: selectedFilter === 'none' ? 'none' : filters.find(f => f.name === selectedFilter)?.filter }}
        />
        
        {/* Текстовые элементы */}
        {textElements.map(renderTextElement)}
        
        {/* Стикеры */}
        {stickerElements.map(renderStickerElement)}

        {/* Музыкальный виджет */}
        {selectedMusic && (
          <div className="absolute bottom-20 left-4 right-4">
            <div className="bg-black/50 backdrop-blur-sm rounded-xl p-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                <span className="text-lg">{selectedMusic.cover}</span>
              </div>
              <div className="flex-1">
                <div className="text-white font-medium text-sm">
                  {selectedMusic.title}
                </div>
                <div className="text-white/70 text-xs">
                  {selectedMusic.artist}
                </div>
              </div>
              <button
                onClick={onMusicRemove}
                className="text-white/70 hover:text-white"
              >
                <Icon name="X" size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Нижняя панель инструментов */}
      <div className="bg-black/90 backdrop-blur-sm p-4">
        {/* Фильтры */}
        <div className="flex gap-2 mb-4 overflow-x-auto">
          {filters.map((filter) => (
            <button
              key={filter.name}
              onClick={() => onFilterChange(filter.name)}
              className={`flex-shrink-0 w-12 h-12 rounded-lg border-2 transition-all ${
                selectedFilter === filter.name
                  ? 'border-purple-500 bg-purple-500/20'
                  : 'border-white/30'
              }`}
              style={{ 
                backgroundImage: `url(${capturedImage})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: filter.filter
              }}
            />
          ))}
        </div>

        {/* Основные инструменты */}
        <div className="flex items-center justify-around text-white">
          <button
            onClick={onAddText}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Icon name="Type" size={20} />
            </div>
            <span className="text-xs">Текст</span>
          </button>

          <button
            onClick={() => onStickerPanelToggle(activeStickerPanel ? null : 'emoji')}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Icon name="Smile" size={20} />
            </div>
            <span className="text-xs">Стикеры</span>
          </button>

          <button
            onClick={() => onStickerPanelToggle(activeStickerPanel === 'music' ? null : 'music')}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Icon name="Music" size={20} />
            </div>
            <span className="text-xs">Музыка</span>
          </button>

          <button
            onClick={() => onStickerPanelToggle(activeStickerPanel === 'location' ? null : 'location')}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Icon name="MapPin" size={20} />
            </div>
            <span className="text-xs">Место</span>
          </button>

          <button
            onClick={() => onStickerPanelToggle(activeStickerPanel === 'gif' ? null : 'gif')}
            className="flex flex-col items-center gap-1"
          >
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <Icon name="Image" size={20} />
            </div>
            <span className="text-xs">GIF</span>
          </button>
        </div>
      </div>

      {/* Панели редактирования */}
      {/* Текстовый редактор */}
      {activeTextEditor && (
        <div className="absolute bottom-32 left-0 right-0 bg-black/90 backdrop-blur-sm p-4">
          <div className="space-y-3">
            <input
              type="text"
              value={textElements.find(t => t.id === activeTextEditor)?.text || ''}
              onChange={(e) => onUpdateText(activeTextEditor, { text: e.target.value })}
              className="w-full bg-white/20 text-white placeholder-white/70 px-4 py-2 rounded-lg border border-white/30"
              placeholder="Введите текст"
            />
            
            {/* Стили текста */}
            <div className="flex gap-2 overflow-x-auto">
              {textStyles.map((style) => (
                <button
                  key={style.id}
                  onClick={() => onUpdateText(activeTextEditor, { style: style.id as any })}
                  className={`flex-shrink-0 px-3 py-1 rounded-full text-sm ${
                    textElements.find(t => t.id === activeTextEditor)?.style === style.id
                      ? 'bg-purple-500 text-white'
                      : 'bg-white/20 text-white/70'
                  }`}
                >
                  {style.name}
                </button>
              ))}
            </div>

            {/* Цвета */}
            <div className="flex gap-2">
              {textColors.map((color) => (
                <button
                  key={color}
                  onClick={() => onUpdateText(activeTextEditor, { color })}
                  className="w-8 h-8 rounded-full border-2 border-white/50"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>

            <button
              onClick={onTextEditorClose}
              className="w-full py-2 bg-purple-500 text-white rounded-lg"
            >
              Готово
            </button>
          </div>
        </div>
      )}

      {/* Панель стикеров */}
      {activeStickerPanel && activeStickerPanel !== 'music' && (
        <div className="absolute bottom-32 left-0 right-0 bg-black/90 backdrop-blur-sm p-4 max-h-48 overflow-y-auto">
          <div className="grid grid-cols-4 gap-3">
            {stickerCategories[activeStickerPanel as keyof typeof stickerCategories]?.map((sticker, index) => (
              <button
                key={index}
                onClick={() => onAddSticker(activeStickerPanel!, sticker)}
                className="p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-center"
              >
                <span className="text-xl">{sticker}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Панель музыки */}
      {activeStickerPanel === 'music' && (
        <div className="absolute bottom-32 left-0 right-0 bg-black/90 backdrop-blur-sm p-4 max-h-48 overflow-y-auto">
          <div className="space-y-2">
            {musicTracks.map((track) => (
              <button
                key={track.id}
                onClick={() => {
                  onMusicSelect(track);
                  onStickerPanelToggle(null);
                }}
                className="w-full flex items-center gap-3 p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors text-left"
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
                  <span className="text-lg">{track.cover}</span>
                </div>
                <div className="flex-1">
                  <div className="text-white font-medium text-sm">{track.title}</div>
                  <div className="text-white/70 text-xs">{track.artist}</div>
                </div>
                <div className="text-white/50 text-xs">{track.duration}с</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvancedStoriesEditor;