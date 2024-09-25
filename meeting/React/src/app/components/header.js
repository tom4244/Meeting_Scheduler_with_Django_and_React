import React, { Component } from "react";
import { useAtom } from 'jotai';
import { useNavigate } from "react-router-dom";
import setAuthorizationToken from '../utils/setAuthorizationToken';
import { isAuthAtom, usernameAtom } from '../app.js';
import "./styles/header.scss";
import axios from 'axios';

function HeaderMenu() {

    const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthAtom);
	  const [username, setUsername] = useAtom(usernameAtom);
    const navigate = useNavigate();
  	const LogoImage = () => (
      <div className='logoImgStyle' onClick={() => { navigate('/') }} />
    );
  
    const SignUp = () => (
      <div className='signUpLink 'onClick={() => { navigate('/signup') }}>
    	    Sign up
      </div>
    );
    	
    const LogIn = () => (
      <div className='logInLink 'onClick={() => { navigate('/login') }}>
    	   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Log in&nbsp;&nbsp;
      </div>
    );
  
    const logout = () => {
      return axios.post('logout/')
      .then(res => {
        console.log("logout res: ", res);
      })
      .catch((error) => {
        console.log("logout function error: ", error)
      })
    }

     const LogOut = () => (
      <div className='logOutLink 'onClick={() => { 
    	setUsername("");
    	setIsAuthenticated(false);
		  logout();
		  navigate('/');
      console.log("logged out");
			}}>
    	   &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Log out&nbsp;&nbsp;
      </div>
    );

	  if (isAuthenticated === true) {
	  	  return (
        	<header>
        	  <LogoImage />
	  	  	  <LogOut />
        	</header>
        );
	  	} else {
	  	    return (
          	<header>
          	  <LogoImage />
            	<div className='membership'>
                 <SignUp />
                 <LogIn />
            	</div>
          	</header>
          );
	      }
}

export default HeaderMenu;

