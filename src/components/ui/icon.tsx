import React from 'react';
import * as LucideIcons from 'lucide-react';
import { LucideProps } from 'lucide-react';

interface IconProps extends LucideProps {
  name: keyof typeof LucideIcons;
  fallback?: keyof typeof LucideIcons;
}

const Icon: React.FC<IconProps> = ({ name, fallback = 'CircleAlert', ...props }) => {
  const IconComponent = LucideIcons[name] as React.FC<LucideProps>;

  if (!IconComponent) {
    const FallbackIcon = LucideIcons[fallback] as React.FC<LucideProps>;

    if (!FallbackIcon) {
      return <span className="text-xs text-gray-400">[icon]</span>;
    }

    return <FallbackIcon {...props} />;
  }

  return <IconComponent {...props} />;
};

export default Icon;