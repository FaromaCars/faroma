import React from 'react';
import Logo from '../assets/faromalogo preload.png'

const Preloader = () => {
  return (
    <div className="preloader">
      <div className="loader">
        <img src={Logo} alt="logo" />
      </div> 
    </div>
  );
};

export default Preloader;
