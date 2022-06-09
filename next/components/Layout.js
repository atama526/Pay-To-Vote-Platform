import React, {createContext, useState} from 'react';
import Header from './Header';

//Layout component that is displayed on the top of all pages in the app. Use as a wrapper

export const MyContext = createContext();

const Layout = (props) => {
	const [myAccount, setMyAccount] = useState('')
	const [myBalance, setMyBalance] = useState('')
	
	
	const childToParent = (childData, balance) => {
		setMyAccount(childData);
		setMyBalance(balance)		
	}		
	return (
		
		<div className="bg-slate-900 pt-8">
			<Header childToParent={childToParent}/>  			
			{props.children}			
		</div>
	)
};

export default Layout;
