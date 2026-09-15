import React from 'react';
import { ForynLoadingExperience } from './loading/ForynLoadingExperience';

interface LogoLoadingOverlayProps {
  statusText?: string;
  onComplete?: () => void;
  isError?: boolean;
  onRetry?: () => void;
  realProgress?: number;
}

export const LogoLoadingOverlay: React.FC<LogoLoadingOverlayProps> = ({
  statusText = 'Turning Ideas Into Beautiful Spaces',
  onComplete,
  isError = false,
  onRetry,
  realProgress
}) => {
  return (
    <ForynLoadingExperience
      statusHeadline={statusText}
      onComplete={onComplete}
      isError={isError}
      onRetry={onRetry}
      realProgress={realProgress}
    />
  );
};

