interface NotificationBadgeProps {
  count: number;
  className?: string;
}

const NotificationBadge = ({ count, className = "" }: NotificationBadgeProps) => {
  if (count === 0) return null;

  return (
    <div className={`absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-pulse ${className}`}>
      <span className="text-white text-xs font-bold">
        {count > 9 ? '9+' : count}
      </span>
    </div>
  );
};

export default NotificationBadge;