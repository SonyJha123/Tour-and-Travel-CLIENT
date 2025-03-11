import React from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import Logo from '../Logo';
import logiSrc from '../../assets/images/sleekitech-logo.svg';
import { toggleThemeMode, updatePrimaryColor } from '../../features/theme/themeSlice';
import { Box, Button, useTheme } from '@mui/material';
// import { logout } from '../../features/auth/authSlice';

function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  // const handleLogout = () => {
  //   dispatch(logout());
  //   navigate('/login'); 
  // };
  // const isLoginPage = location.pathname === '/login' || location.pathname === '/register';

  // console.log(apiUrl)

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
          {/* <div className="ml-auto">
            <Box sx={{
              p: 3,
              bgcolor: theme.palette.background.default,
              borderRadius: theme.shape.borderRadius
            }}>
              <Button
                variant="contained"
                onClick={() => dispatch(toggleThemeMode())}
                sx={{
                  bgcolor: theme.palette.secondary.main,
                  '&:hover': { bgcolor: theme.palette.secondary.dark }
                }}
              >
                {theme.palette.mode === 'dark' ? 'Light' : 'Dark'} Mode
              </Button>
            </Box>
          </div> */}
          {/* <div className="ml-auto">
            {!isLoginPage && ( 
              <button 
                onClick={handleLogout} 
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              >
                Logout
              </button>
            )}
          </div> */}
        </div>
      </nav>
    </header>
  );
}

export default Header;