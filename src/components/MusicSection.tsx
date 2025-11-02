import { useState, useEffect, useRef } from 'react';
import Icon from '@/components/ui/icon';

interface Track {
  id: string;
  title: string;
  artist: string;
  url: string;
  duration: string;
}

const DEFAULT_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Калинка',
    artist: 'Народная',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    duration: '3:45'
  },
  {
    id: '2',
    title: 'Катюша',
    artist: 'Народная',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    duration: '2:58'
  },
  {
    id: '3',
    title: 'Подмосковные вечера',
    artist: 'Народная',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    duration: '3:12'
  }
];

const MusicSection = () => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const savedContent = localStorage.getItem('homePageContent');
    if (savedContent) {
      const content = JSON.parse(savedContent);
      setTracks(content.musicTracks || DEFAULT_TRACKS);
    } else {
      setTracks(DEFAULT_TRACKS);
    }
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => {
      setIsPlaying(false);
      const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id);
      if (currentIndex < tracks.length - 1) {
        playTrack(tracks[currentIndex + 1]);
      }
    };

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [currentTrack, tracks]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const playTrack = (track: Track) => {
    if (currentTrack?.id === track.id) {
      togglePlay();
    } else {
      setCurrentTrack(track);
      setIsPlaying(true);
      setTimeout(() => {
        audioRef.current?.play();
      }, 100);
    }
  };

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const skipTrack = (direction: 'next' | 'prev') => {
    const currentIndex = tracks.findIndex(t => t.id === currentTrack?.id);
    let newIndex;
    
    if (direction === 'next') {
      newIndex = currentIndex < tracks.length - 1 ? currentIndex + 1 : 0;
    } else {
      newIndex = currentIndex > 0 ? currentIndex - 1 : tracks.length - 1;
    }
    
    playTrack(tracks[newIndex]);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const downloadTrack = (track: Track) => {
    const link = document.createElement('a');
    link.href = track.url;
    link.download = `${track.artist} - ${track.title}.mp3`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Icon name="Music" size={24} />
              <h2 className="text-2xl font-bold">Горхон.Music</h2>
            </div>
            <p className="text-purple-100 text-sm">
              Бесплатная русская музыка без интернета
            </p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
            <Icon name="Radio" size={32} />
          </div>
        </div>
      </div>

      <div className="p-6">
        {currentTrack && (
          <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-5">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                <Icon name={isPlaying ? "Music2" : "Music"} size={28} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-800">{currentTrack.title}</h3>
                <p className="text-gray-600">{currentTrack.artist}</p>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs text-gray-600">
                <span>{formatTime(currentTime)}</span>
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  value={currentTime}
                  onChange={handleSeek}
                  className="flex-1 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, rgb(168 85 247) 0%, rgb(168 85 247) ${(currentTime / duration) * 100}%, rgb(233 213 255) ${(currentTime / duration) * 100}%, rgb(233 213 255) 100%)`
                  }}
                />
                <span>{formatTime(duration)}</span>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={() => skipTrack('prev')}
                  className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Icon name="SkipBack" size={20} className="text-purple-600" />
                </button>
                
                <button
                  onClick={togglePlay}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 shadow-lg flex items-center justify-center hover:shadow-xl transition-shadow"
                >
                  <Icon name={isPlaying ? "Pause" : "Play"} size={24} className="text-white" />
                </button>
                
                <button
                  onClick={() => skipTrack('next')}
                  className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
                >
                  <Icon name="SkipForward" size={20} className="text-purple-600" />
                </button>
              </div>

              <div className="flex items-center gap-2 px-4">
                <Icon name="Volume2" size={16} className="text-gray-600" />
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.1"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className="flex-1 h-1 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-gray-800">Треки</h3>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Icon name="Music" size={16} />
              <span>{tracks.length} песен</span>
            </div>
          </div>

          {tracks.map((track, index) => (
            <div
              key={track.id}
              className={`flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group ${
                currentTrack?.id === track.id ? 'bg-purple-50' : ''
              }`}
              onClick={() => playTrack(track)}
            >
              <div className="w-8 h-8 rounded-md bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center flex-shrink-0">
                {currentTrack?.id === track.id && isPlaying ? (
                  <Icon name="Volume2" size={16} className="text-white animate-pulse" />
                ) : (
                  <span className="text-white text-sm font-bold">{index + 1}</span>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${
                  currentTrack?.id === track.id ? 'text-purple-600' : 'text-gray-800'
                }`}>
                  {track.title}
                </p>
                <p className="text-sm text-gray-500 truncate">{track.artist}</p>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{track.duration}</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    downloadTrack(track);
                  }}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-white rounded-lg"
                  title="Скачать"
                >
                  <Icon name="Download" size={16} className="text-purple-600" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex gap-3">
            <Icon name="Info" size={20} className="text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-blue-800">
              <p className="font-semibold mb-1">Работает без интернета!</p>
              <p className="text-blue-700">
                После первого прослушивания музыка кешируется в браузере и доступна офлайн.
                Нажмите на трек чтобы скачать его на устройство.
              </p>
            </div>
          </div>
        </div>
      </div>

      <audio ref={audioRef} src={currentTrack?.url} preload="auto" />
    </div>
  );
};

export default MusicSection;
