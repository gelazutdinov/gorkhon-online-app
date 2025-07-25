import { useUser } from '@/hooks/useUser';
import { UserProfile } from '@/hooks/useUser';

interface TrackableComponentProps {
  feature: keyof UserProfile['stats']['featuresUsed'];
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const TrackableComponent = ({ feature, children, className, onClick }: TrackableComponentProps) => {
  const { trackFeatureUse } = useUser();

  const handleClick = () => {
    trackFeatureUse(feature);
    if (onClick) {
      onClick();
    }
  };

  return (
    <div className={className} onClick={handleClick}>
      {children}
    </div>
  );
};

export default TrackableComponent;