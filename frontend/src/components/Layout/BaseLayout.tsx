// base.html
// src/components/Layout/BaseLayout.tsx
import React from 'react';

interface BaseLayoutProps {
  children: React.ReactNode;
}

const BaseLayout: React.FC<BaseLayoutProps> = ({ children }) => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Live Stream</title>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
};

export default BaseLayout;
