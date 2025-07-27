import Icon from '@/components/ui/icon';

interface ProfileInterestsProps {
  interests: string[];
  isEditing: boolean;
  onAddInterest: (interest: string) => void;
  onRemoveInterest: (interest: string) => void;
}

const ProfileInterests = ({ 
  interests, 
  isEditing, 
  onAddInterest, 
  onRemoveInterest 
}: ProfileInterestsProps) => {
  const availableInterests = [
    'Спорт', 'Музыка', 'Кино', 'Чтение', 'Путешествия',
    'Кулинария', 'Фотография', 'Искусство', 'Технологии', 'Природа',
    'Садоводство', 'Рыбалка', 'Охота', 'Рукоделие', 'Танцы'
  ];

  if (!interests.length && !isEditing) {
    return null;
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-800 mb-3">Интересы</h3>
      
      {interests.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {interests.map((interest, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200"
            >
              {interest}
              {isEditing && (
                <button
                  onClick={() => onRemoveInterest(interest)}
                  className="text-blue-700 hover:text-red-600"
                >
                  <Icon name="X" size={12} />
                </button>
              )}
            </span>
          ))}
        </div>
      )}
      
      {isEditing && (
        <div className="flex flex-wrap gap-2">
          {availableInterests
            .filter(interest => !interests.includes(interest))
            .map(interest => (
            <button
              key={interest}
              onClick={() => onAddInterest(interest)}
              className="px-3 py-1 border border-gray-300 text-gray-600 rounded-full text-sm hover:bg-gray-50 transition-colors"
            >
              + {interest}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProfileInterests;