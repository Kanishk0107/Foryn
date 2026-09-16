import React, { useState } from 'react';
import { AnimatePresence } from 'motion/react';
import { LogoLoadingOverlay } from './LogoLoadingOverlay';
import { Component as SignInCard2 } from './ui/sign-in-card-2';

interface AuthCardProps {
  onLoginSuccess: (userEmail: string, role?: string) => void;
  onOpenForgotPassword: () => void;
  onLaunchGuestDemo?: () => void;
}

export const AuthCard: React.FC<AuthCardProps> = ({
  onLoginSuccess,
  onOpenForgotPassword,
  onLaunchGuestDemo
}) => {
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Authenticating session...');

  const triggerLoginWithIntro = (action: () => void, _message: string) => {
    action();
  };

  const handleLoginSuccess = (userEmail: string, role?: string) => {
    triggerLoginWithIntro(
      () => onLoginSuccess(userEmail, role),
      'Authenticating Foryn Studio account...'
    );
  };

  const handleGoogleSignIn = () => {
    triggerLoginWithIntro(
      () => onLoginSuccess('architect.designer@google.com', 'Architect'),
      'Connecting Google OAuth Account...'
    );
  };

  const handleGuestDemoClick = () => {
    triggerLoginWithIntro(
      () => onLaunchGuestDemo(),
      'Initializing Guest CAD Workstation...'
    );
  };

  return (
    <>
      {/* Full-Screen Animated Logo Loading Overlay */}
      <AnimatePresence>
        {isLoggingIn && <LogoLoadingOverlay statusText={loadingMessage} />}
      </AnimatePresence>

      <div className="w-full flex items-center justify-center">
        <SignInCard2
          onLoginSuccess={handleLoginSuccess}
          onOpenForgotPassword={onOpenForgotPassword}
          onLaunchGuestDemo={handleGuestDemoClick}
          onGoogleSignIn={handleGoogleSignIn}
        />
      </div>
    </>
  );
};
