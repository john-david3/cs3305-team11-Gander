import React from 'react';
import PasswordResetForm from '../components/Auth/PasswordResetForm';

const ForgotPasswordPage: React.FC = () => {
  const doNothing = (): void => {};

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Forgot Password</h1>
      <PasswordResetForm onSubmit={doNothing} />
    </div>
  );
};

export default ForgotPasswordPage;
