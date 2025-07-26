import React, { useState, useEffect } from 'react';
import { User, Story, StoryElement, ViewType, PanelType } from './stories/types';
import { INITIAL_USERS, TEXT_STYLES } from './stories/constants';
import StoriesMain from './stories/StoriesMain';
import StoriesCreator from './stories/StoriesCreator';
import StoriesEditor from './stories/StoriesEditor';
import StoriesViewer from './stories/StoriesViewer';

const InstagramStories: React.FC = () => {
  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [stories, setStories] = useState<Story[]>([]);
  const [currentView, setCurrentView] = useState<ViewType>('main');
  const [selectedStory, setSelectedStory] = useState<Story | null>(null);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  
  // Creation/editing state
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [selectedFilter, setSelectedFilter] = useState('original');
  const [storyElements, setStoryElements] = useState<StoryElement[]>([]);
  const [activePanel, setActivePanel] = useState<PanelType>('filters');
  
  // Text editing
  const [textInput, setTextInput] = useState('');
  const [selectedTextStyle, setSelectedTextStyle] = useState('classic');
  const [selectedTextColor, setSelectedTextColor] = useState('#FFFFFF');
  const [selectedTextSize, setSelectedTextSize] = useState(24);
  const [selectedTextAnimation, setSelectedTextAnimation] = useState('');
  
  // Music
  const [selectedMusic, setSelectedMusic] = useState<any>(null);

  // Load user avatar from localStorage
  useEffect(() => {
    const savedAvatar = localStorage.getItem('userAvatar');
    if (savedAvatar) {
      setUsers(prev => prev.map(user => 
        user.id === 'current_user' 
          ? { ...user, avatar: savedAvatar }
          : user
      ));
    }
  }, []);

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setSelectedImage(imageUrl);
        
        // Save as user avatar
        localStorage.setItem('userAvatar', imageUrl);
        setUsers(prev => prev.map(user => 
          user.id === 'current_user' 
            ? { ...user, avatar: imageUrl, hasStory: true }
            : user
        ));
        
        setCurrentView('edit');
      };
      reader.readAsDataURL(file);
    }
  };

  const addTextElement = () => {
    if (!textInput.trim()) return;
    
    const newElement: StoryElement = {
      id: Date.now().toString(),
      type: 'text',
      content: textInput,
      x: 50,
      y: 30,
      style: {
        fontSize: selectedTextSize,
        color: selectedTextColor,
        ...TEXT_STYLES.find(s => s.id === selectedTextStyle)?.style,
        animation: selectedTextAnimation
      }
    };
    
    setStoryElements(prev => [...prev, newElement]);
    setTextInput('');
    setActivePanel(null);
  };

  const addStickerElement = (sticker: any) => {
    const newElement: StoryElement = {
      id: Date.now().toString(),
      type: 'sticker',
      content: sticker.text,
      x: Math.random() * 60 + 20,
      y: Math.random() * 60 + 20,
      stickerType: sticker.emoji
    };
    
    setStoryElements(prev => [...prev, newElement]);
    setActivePanel(null);
  };

  const addMusicElement = (track: any) => {
    setSelectedMusic(track);
    setActivePanel(null);
  };

  const publishStory = () => {
    if (!selectedImage) return;
    
    const newStory: Story = {
      id: Date.now().toString(),
      userId: 'current_user',
      imageUrl: selectedImage,
      timestamp: Date.now(),
      elements: storyElements,
      filter: selectedFilter,
      music: selectedMusic
    };
    
    setStories(prev => [...prev, newStory]);
    setUsers(prev => prev.map(user => 
      user.id === 'current_user' 
        ? { ...user, hasStory: true }
        : user
    ));
    
    // Reset state
    setCurrentView('main');
    setSelectedImage('');
    setStoryElements([]);
    setSelectedMusic(null);
    setSelectedFilter('original');
  };

  const viewStory = (userId: string) => {
    const userStories = stories.filter(s => s.userId === userId);
    if (userStories.length > 0) {
      setSelectedStory(userStories[0]);
      setCurrentStoryIndex(0);
      setCurrentView('view');
    }
  };

  // Render based on current view
  if (currentView === 'view' && selectedStory) {
    return (
      <StoriesViewer
        selectedStory={selectedStory}
        users={users}
        onClose={() => setCurrentView('main')}
      />
    );
  }

  if (currentView === 'edit' && selectedImage) {
    return (
      <StoriesEditor
        selectedImage={selectedImage}
        selectedFilter={selectedFilter}
        storyElements={storyElements}
        activePanel={activePanel}
        selectedMusic={selectedMusic}
        textInput={textInput}
        selectedTextStyle={selectedTextStyle}
        selectedTextColor={selectedTextColor}
        onBack={() => setCurrentView('create')}
        onPublish={publishStory}
        onFilterChange={setSelectedFilter}
        onPanelChange={setActivePanel}
        onTextInputChange={setTextInput}
        onTextStyleChange={setSelectedTextStyle}
        onTextColorChange={setSelectedTextColor}
        onAddText={addTextElement}
        onAddSticker={addStickerElement}
        onAddMusic={addMusicElement}
        onRemoveMusic={() => setSelectedMusic(null)}
      />
    );
  }

  if (currentView === 'create') {
    return (
      <StoriesCreator
        onImageUpload={handleImageUpload}
        onCancel={() => setCurrentView('main')}
      />
    );
  }

  // Main Stories View
  return (
    <StoriesMain
      users={users}
      onCreateStory={() => setCurrentView('create')}
      onViewStory={viewStory}
    />
  );
};

export default InstagramStories;