import React from 'react';
import Icon from '@/components/ui/icon';
import { Button } from '@/components/ui/button';
import { Story, User } from './types';
import { PHOTO_FILTERS } from './constants';

interface StoriesViewerProps {
  selectedStory: Story;
  users: User[];
  onClose: () => void;
}

const StoriesViewer: React.FC<StoriesViewerProps> = ({
  selectedStory,
  users,
  onClose
}) => {
  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* Progress bar */}
      <div className="absolute top-4 left-4 right-4 flex gap-1 z-10">
        <div className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
          <div className="h-full bg-white rounded-full animate-[progress_5s_linear_forwards]" />
        </div>
      </div>

      {/* Header */}
      <div className="absolute top-8 left-4 right-4 flex items-center justify-between z-10 mt-6">
        <div className="flex items-center gap-3">
          <img 
            src={users.find(u => u.id === selectedStory.userId)?.avatar} 
            alt="Avatar"
            className="w-8 h-8 rounded-full border border-white/50"
          />
          <div>
            <p className="text-white text-sm font-medium">
              {users.find(u => u.id === selectedStory.userId)?.username}
            </p>
            <p className="text-white/70 text-xs">
              {Math.floor((Date.now() - selectedStory.timestamp) / 1000 / 60)}м
            </p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="text-white hover:bg-white/20"
        >
          <Icon name="X" size={20} />
        </Button>
      </div>

      {/* Story Content */}
      <div className="relative w-full h-full flex items-center justify-center">
        <img 
          src={selectedStory.imageUrl}
          alt="Story"
          className={`w-full h-full object-cover ${PHOTO_FILTERS.find(f => f.id === selectedStory.filter)?.className || ''}`}
        />
        
        {/* Story Elements */}
        {selectedStory.elements.map(element => (
          <div
            key={element.id}
            className="absolute"
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
        {selectedStory.music && (
          <div className="absolute bottom-20 left-4 flex items-center gap-3 bg-black/50 backdrop-blur-sm px-3 py-2 rounded-full">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-lg">{selectedStory.music.cover}</span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">{selectedStory.music.title}</p>
              <p className="text-white/70 text-xs">{selectedStory.music.artist}</p>
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <button
        className="absolute left-0 top-0 w-1/3 h-full z-10"
        onClick={onClose}
      />
      <button
        className="absolute right-0 top-0 w-1/3 h-full z-10"
        onClick={onClose}
      />
    </div>
  );
};

export default StoriesViewer;