import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAtom } from 'jotai';
import { addFlashMessage } from '../components/listFlashMessages';
import { isAuthAtom } from '../app.js';

const [ isAuthenticated, setIsAuthenticated ] = useAtom(isAuthAtom);
const navigate = useNavigate();

export default function(ComposedComponent) {
	function Authenticate() {

		if (!isAuthenticated) {
			addFlashMessage({
				type: 'error',
				text: 'Please log in to access that page'
			});
			navigate('/login');
			}
			
		  return (
				<ComposedComponent {...this.props} />
			);
	}

	return(Authenticate);

};
