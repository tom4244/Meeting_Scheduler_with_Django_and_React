import React, { useState } from 'react';
import { useAtom } from 'jotai';
import validateInput from './validations/login';
import axios from 'axios';
import setAuthorizationToken from '../utils/setAuthorizationToken';
import jwtDecode from 'jwt-decode';
import { isAuthAtom, userAtom, usernameAtom, identifierAtom, passwordAtom, authAtom } from '../app.js';
import { useNavigate } from "react-router-dom";
import { flashMsgListAtom } from '../app.js';
import { nanoid } from 'nanoid';
import "./styles/header.scss";
import Cookies from 'js-cookie';

function LoginForm() {
	const [errors, setErrors] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [user, setUser] = useAtom(userAtom);
	const [username, setUsername] = useAtom(usernameAtom);
	const [identifier, setIdentifier] = useAtom(identifierAtom);
	const [password, setPassword] = useAtom(passwordAtom);
	const [auth, setAuth] = useAtom(authAtom);
	const [isAuthenticated, setIsAuthenticated] = useAtom(isAuthAtom);
  const loginData = {username, password, errors, isLoading};
	const navigate = useNavigate();
  const [flashMsgList, setFlashMsgList] = useAtom(flashMsgListAtom);
  const addFlashMessage = ({type, text}) => {
    setFlashMsgList([ ...flashMsgList,
        {
          id: nanoid(),
          type: type,
          text: text
        }
    ])
  };
  
	const isValid = () => {
  	const { errors, isValid } = validateInput(loginData);
  	if (!isValid) {
  		setErrors({ errors });
  	}
  	return isValid;
  }

  const onSubmit = (e) => {
  	e.preventDefault();
  	if (true) {  // only checks for empty fields
  		setErrors({}); 
			setIsLoading( true );
  		login(loginData)
  			.then( (user) => {
          console.log("user object in loginForm: ", user)
					const { first_name, last_name, username, email} = user;
					setUser({first_name:first_name, last_name:last_name, username:username});
					setUsername(user.username);
			    setIsAuthenticated(true);
					navigate('/mtgScheduler/userPage')
				})
  			.catch((error) => {
  				console.log("loginForm.js onSubmit error: ", error);
  			  setErrors(error);
					setIsLoading( false );
		      addFlashMessage({
            type: 'fail',
            text: 'The username or password is unknown. Please try again or sign up if you are a new user.'
          });
  			});
  	}
	}
  
	const handleUsernameChange = (e) => {
		setUsername(e.target.value);
	}

  const handlePasswordChange = (e) => {
		setPassword(e.target.value);
	}

  return (
  	<form onSubmit={onSubmit} className='loginForm'>
    	<h3 className='h3Login' htmlFor="username">Please log in</h3>
	  	{ errors.form && <p className='errorMsg'>{errors.form}</p>}
        <input className='usernameInput'
    	    name='username'
    	    placeholder='Username'
    	    value={username}
    	    error={errors.username}
    	    onChange={handleUsernameChange}
        />
        { errors.username&& <p className='errorMsg'>{errors.username}</p>}
    
        <input className='passwordInput'
    	    name='password'
	  	    autoComplete='current-password'
    	    placeholder='Password'
    	    value={password}
    	    error={errors.password}
    	    onChange={handlePasswordChange}
    	    type='password'
        />
        { errors.password && <p className='errorMsg'>{errors.password}</p>}
    
        <button className='loginButton' disabled={isLoading}>Log In</button>
  	</form>
  );
}

export function login(data, res) {
  console.log("login data: ", data);	
	return axios.post('login/', data)
		.then(res => {
      console.log("login res: ", res);	
	  	
      const user= {
	  		id: res.data.id,
	  		username: res.data.username,
	  	  first_name: res.data.first_name,
	  	  last_name: res.data.last_name
	  	}	
	  	return(user);
	})
	.catch((error) => {
		console.log("login function error: ", error);
	})
}

export default LoginForm;

