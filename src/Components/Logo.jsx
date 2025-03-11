import React from 'react';

const Logo = ({ type = 'image', logoText = '', logoUrl = '', altText = 'Logo', logoHeight = 40 }) => {
  return (
    <div className="logo-container">
      {type === 'image' ? (
        <img src={logoUrl} alt={altText} style={{ height: logoHeight }} />
      ) : (
        <span className="logo-text" style={{ fontSize: logoHeight }}>
          {logoText}
        </span>
      )}
    </div>
  );
};

export default Logo;
