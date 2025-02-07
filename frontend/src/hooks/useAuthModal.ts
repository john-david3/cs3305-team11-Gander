import { useState, useEffect } from 'react';

export function useAuthModal() {
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    if (showAuthModal) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [showAuthModal]);

  return {
    showAuthModal,
    setShowAuthModal,
  };
}