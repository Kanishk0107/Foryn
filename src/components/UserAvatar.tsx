import React from 'react';

interface UserAvatarProps {
  name?: string;
  avatarUrl?: string;
  role?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showStatus?: boolean;
}

export const UserAvatar: React.FC<UserAvatarProps> = ({
  name = 'User',
  avatarUrl,
  role = '',
  size = 'md',
  className = '',
  showStatus = false
}) => {
  const initial = name.charAt(0).toUpperCase();

  // Size mapping
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-7 h-7 text-xs',
    md: 'w-8 h-8 text-xs',
    lg: 'w-10 h-10 text-sm',
    xl: 'w-12 h-12 text-base'
  };

  const iconSizes = {
    xs: 'w-3.5 h-3.5',
    sm: 'w-4 h-4',
    md: 'w-4.5 h-4.5',
    lg: 'w-6 h-6',
    xl: 'w-7 h-7'
  };

  // Pentagram OS Color Scheme for Avatars
  const getColorScheme = (roleStr: string, nameStr: string) => {
    const combined = (roleStr + nameStr).toLowerCase();
    if (combined.includes('designer') || combined.includes('architect') || combined.includes('3d')) {
      return {
        bg: 'bg-[#0F1428]',
        border: 'border-[#D64062]',
        text: 'text-white',
        accent: 'bg-[#D64062]',
        hair: '#0F1428',
        skin: '#F1F5F9'
      };
    }
    if (combined.includes('sales') || combined.includes('lead') || combined.includes('client')) {
      return {
        bg: 'bg-[#D64062]',
        border: 'border-[#0F1428]',
        text: 'text-white',
        accent: 'bg-[#0F1428]',
        hair: '#0F1428',
        skin: '#F1F5F9'
      };
    }
    // Default Executive / PM / Finance / Admin
    return {
      bg: 'bg-[#0F1428]',
      border: 'border-slate-300',
      text: 'text-white',
      accent: 'bg-[#D64062]',
      hair: '#0F1428',
      skin: '#F1F5F9'
    };
  };

  const theme = getColorScheme(role, name);

  // SVG Avatars (Pentagram OS Clean Minimalist Style)
  const renderSvgAvatar = () => {
    const charCode = name.charCodeAt(0) || 0;
    const isVariantB = charCode % 2 === 0;

    if (isVariantB) {
      return (
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full rounded-full"
        >
          <circle cx="18" cy="18" r="18" fill="#0F1428" />
          {/* Head & Hair */}
          <circle cx="18" cy="14" r="6" fill="#FDFDFD" />
          <path d="M12 13C12 9.68629 14.6863 7 18 7C21.3137 7 24 9.68629 24 13C24 13.5 23.5 14 23 14C22 14 21.5 12 18 12C14.5 12 14 14 13 14C12.5 14 12 13.5 12 13Z" fill="#D64062" />
          {/* Accent Glasses */}
          <circle cx="15.5" cy="14" r="1.5" stroke="#0F1428" strokeWidth="0.8" fill="none" />
          <circle cx="20.5" cy="14" r="1.5" stroke="#0F1428" strokeWidth="0.8" fill="none" />
          <line x1="17" y1="14" x2="19" y2="14" stroke="#0F1428" strokeWidth="0.8" />
          {/* Body */}
          <path d="M9 30C9 23.9249 13.0294 19 18 19C22.9706 19 27 23.9249 27 30V36H9V30Z" fill="#1E293B" />
          <path d="M15 22L18 26L21 22" stroke="#D64062" strokeWidth="1.2" strokeLinecap="round" />
        </svg>
      );
    }

    return (
      <svg
        viewBox="0 0 36 36"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full rounded-full"
      >
        <circle cx="18" cy="18" r="18" fill="#D64062" />
        {/* Head */}
        <circle cx="18" cy="14" r="6" fill="#FDFDFD" />
        {/* Styled Hair */}
        <path d="M12 13C12 9.68629 14.6863 7 18 7C21.3137 7 24 9.68629 24 13V15H12V13Z" fill="#0F1428" />
        {/* Shoulders */}
        <path d="M8 31C8 24.3726 12.4772 19 18 19C23.5228 19 28 24.3726 28 31V36H8V31Z" fill="#0F1428" />
        <path d="M15 19L18 24L21 19" fill="#FDFDFD" />
      </svg>
    );
  };

  return (
    <div className={`relative inline-flex shrink-0 items-center justify-center ${sizeClasses[size]} ${className}`}>
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="w-full h-full rounded-full object-cover border border-slate-200 dark:border-slate-700 shadow-xs"
        />
      ) : (
        <div className="relative w-full h-full rounded-full overflow-hidden shadow-xs ring-1 ring-black/10">
          {renderSvgAvatar()}
          {/* Subtle initial letter overlay badge in bottom right corner if needed */}
          <span
            className="absolute bottom-0 right-0 px-1 py-0.2 bg-slate-950/80 text-white font-black text-[9px] rounded-tl-md flex items-center justify-center leading-none"
            style={{ fontSize: size === 'xs' ? '7px' : '9px' }}
          >
            {initial}
          </span>
        </div>
      )}

      {showStatus && (
        <span className="absolute bottom-0 right-0 block w-2 h-2 rounded-full bg-[#D64062] ring-2 ring-white dark:ring-slate-900" />
      )}
    </div>
  );
};
