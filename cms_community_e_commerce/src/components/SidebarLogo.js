import React from 'react';
import {
  WEBSITE_NAME
} from '../constants';
import logo from '../assets/images/logo.png';

const SidebarLogo = (props) => {
  return (
    <div className="sidebar-logo">
      <img src={logo} alt="..."/>
      <h2 className="sidebar-logo-content">{props.scan?"小橙分拣":WEBSITE_NAME}</h2>
    </div>
  )
}

export default SidebarLogo
