import React from 'react';
import Logo from '../Logo';
import logiSrc from '../../assets/images/sleekitech-logo.svg';

import { useTheme } from '@mui/material';

function Header() {
  const theme = useTheme();

  return (
    <header className="fixed top-0 left-0 w-full z-10" style={{
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText
    }}>
      <nav className="bg-gray-100 border-gray-200 px-4 lg:px-6 py-2.5 dark:bg-gray-800 shadow">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
          <Logo
            type="image"
            logoUrl={logiSrc}
            altText="Sleekitech Logo"
            logoHeight={40}
          />
        </div>
      </nav>
    </header>
  );
}

export default Header;