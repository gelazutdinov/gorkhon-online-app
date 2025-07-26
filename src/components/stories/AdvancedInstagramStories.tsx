import { useState, useCallback } from 'react';
import { Story, TextElement, StickerElement, MusicElement, AdvancedInstagramStoriesProps } from './advanced-types';
import AdvancedStoriesMain from './AdvancedStoriesMain';
import AdvancedStoriesViewer from './AdvancedStoriesViewer';
import AdvancedStoriesCreator from './AdvancedStoriesCreator';
import AdvancedStoriesEditor from './AdvancedStoriesEditor';

const AdvancedInstagramStories = ({ currentUser }: AdvancedInstagramStoriesProps) => {
  const [stories, setStories] = useState<Story[]>([]);
  const [selectedStoryIndex, setSelectedStoryIndex] = useState<number | null>(null);
  const [progress, setProgress] = useState(0);
  const [showStoryCreator, setShowStoryCreator] = useState(false);
  
  // Story Creator State
  const [creatorStep, setCreatorStep] = useState<'capture' | 'edit'>('capture');
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState('none');
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [stickerElements, setStickerElements] = useState<StickerElement[]>([]);
  const [selectedMusic, setSelectedMusic] = useState<MusicElement | null>(null);
  const [activeTextEditor, setActiveTextEditor] = useState<string | null>(null);
  const [activeStickerPanel, setActiveStickerPanel] = useState<string | null>(null);

  const handleImageCapture = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setCapturedImage(e.target?.result as string);
        setCreatorStep('edit');
      };
      reader.readAsDataURL(file);
    }
  };

  const addTextElement = () => {
    const newText: TextElement = {
      id: Date.now().toString(),
      text: 'Новый текст',
      x: 50,
      y: 50,
      style: 'classic',
      color: '#ffffff',
      size: 'medium',
      animation: 'fade'
    };
    setTextElements([...textElements, newText]);
    setActiveTextEditor(newText.id);
  };

  const updateTextElement = (id: string, updates: Partial<TextElement>) => {
    setTextElements(textElements.map(el => el.id === id ? { ...el, ...updates } : el));
  };

  const addSticker = (category: string, content: string) => {
    const newSticker: StickerElement = {
      id: Date.now().toString(),
      type: category as any,
      content,
      x: Math.random() * 60 + 20,
      y: Math.random() * 60 + 20,
      size: 1,
      rotation: 0
    };
    setStickerElements([...stickerElements, newSticker]);
    setActiveStickerPanel(null);
  };

  const publishStory = () => {
    if (!capturedImage || !currentUser) return;

    const newStory: Story = {
      id: Date.now().toString(),
      userId: currentUser.id || 'user',
      userName: currentUser.name || 'Пользователь',
      userAvatar: currentUser.avatar || '👤',
      image: capturedImage,
      text: textElements,
      stickers: stickerElements,
      music: selectedMusic || undefined,
      timestamp: new Date(),
      viewed: false
    };

    setStories([...stories, newStory]);
    
    // Сбрасываем состояние
    resetCreatorState();
  };

  const resetCreatorState = () => {
    setShowStoryCreator(false);
    setCreatorStep('capture');
    setCapturedImage('');
    setTextElements([]);
    setStickerElements([]);
    setSelectedMusic(null);
    setSelectedFilter('none');
    setActiveTextEditor(null);
    setActiveStickerPanel(null);
  };

  const openStoryViewer = (index: number) => {
    setSelectedStoryIndex(index);
    setProgress(0);
  };

  const closeStoryViewer = () => {
    setSelectedStoryIndex(null);
    setProgress(0);
  };

  const handlePreviousStory = () => {
    if (selectedStoryIndex !== null && selectedStoryIndex > 0) {
      setSelectedStoryIndex(selectedStoryIndex - 1);
      setProgress(0);
    }
  };

  const handleNextStory = () => {
    if (selectedStoryIndex !== null) {
      if (selectedStoryIndex < stories.length - 1) {
        setSelectedStoryIndex(selectedStoryIndex + 1);
        setProgress(0);
      } else {
        closeStoryViewer();
      }
    }
  };

  return (
    <div className="space-y-4">
      {/* Главная лента историй */}
      <AdvancedStoriesMain
        stories={stories}
        currentUser={currentUser}
        onCreateStory={() => setShowStoryCreator(true)}
        onStoryClick={openStoryViewer}
      />

      {/* Просмотрщик историй */}
      {selectedStoryIndex !== null && (
        <AdvancedStoriesViewer
          stories={stories}
          selectedStoryIndex={selectedStoryIndex}
          progress={progress}
          selectedFilter={selectedFilter}
          onClose={closeStoryViewer}
          onPrevious={handlePreviousStory}
          onNext={handleNextStory}
          setProgress={setProgress}
        />
      )}

      {/* Создатель историй */}
      {showStoryCreator && (
        <div className="fixed inset-0 bg-black z-50">
          {creatorStep === 'capture' ? (
            <AdvancedStoriesCreator
              onImageCapture={handleImageCapture}
              onClose={() => setShowStoryCreator(false)}
            />
          ) : (
            <AdvancedStoriesEditor
              capturedImage={capturedImage}
              selectedFilter={selectedFilter}
              textElements={textElements}
              stickerElements={stickerElements}
              selectedMusic={selectedMusic}
              activeTextEditor={activeTextEditor}
              activeStickerPanel={activeStickerPanel}
              onFilterChange={setSelectedFilter}
              onAddText={addTextElement}
              onUpdateText={updateTextElement}
              onAddSticker={addSticker}
              onMusicSelect={setSelectedMusic}
              onMusicRemove={() => setSelectedMusic(null)}
              onTextEditorClose={() => setActiveTextEditor(null)}
              onStickerPanelToggle={setActiveStickerPanel}
              onBack={() => setCreatorStep('capture')}
              onPublish={publishStory}
            />
          )}
        </div>
      )}
    </div>
  );
};

export default AdvancedInstagramStories;