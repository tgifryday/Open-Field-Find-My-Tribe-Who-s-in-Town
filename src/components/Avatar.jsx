const colors = [
  'bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500',
  'bg-teal-500', 'bg-orange-500', 'bg-red-500', 'bg-slate-500',
];

export default function Avatar({ name, size = 'md', className = '' }) {
  const initial = name ? name.charAt(0).toUpperCase() : '?';
  const colorIndex = name ? name.charCodeAt(0) % colors.length : 0;
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  };

  return (
    <div
      className={`${colors[colorIndex]} ${sizeClasses[size]} rounded-full flex items-center justify-center text-white font-semibold shrink-0 ${className}`}
    >
      {initial}
    </div>
  );
}
