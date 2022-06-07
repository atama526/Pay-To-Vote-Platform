import React, { useState, useContext, useEffect } from 'react';
import { shortenAddress, toFinney, checkIfWalletIsConnected, ethereum } from '../utils';
import factory from '../../contract/factory';
import Link from 'next/link'
import Router from 'next/router'

const Header = ({childToParent}) => {
	
	const [defaultAccount, setDefaultAccount] = useState('0');
	const [accountConnected, setAccountConnected] = useState(false)
	const [myBalance, setMyBalance] = useState('')	
	useEffect( () => {
		connectWallet();
	})

	const connectWallet = async () => {
		
		if (!window.ethereum) return alert("Please install Metamask");
		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'});
		const balance = await factory.methods.balance(accounts[0]).call();
		setDefaultAccount(accounts[0]);
		console.log(accounts[0]);
		setAccountConnected(true)
		childToParent(accounts[0], balance);
	}

	const accountChange = async (newAccount) => {
		setDefaultAccount(newAccount[0])
		const newBalance = await factory.methods.balance(newAccount[0]).call();
		childToParent(newAccount[0], newBalance);
		Router.reload()
	}

	if (typeof window !== "undefined" && typeof window.ethereum !== "undefined") {
		window.ethereum.on('accountsChanged',accountChange);
	}
		
	return (		
		<nav className="bg-slate-900 w-3/4 border-gray-400  border-2 rounded-full shadow-md  ml-64 px-16 py-2.5 rounded dark:bg-gray-800">
			<div className="container flex flex-wrap justify-between items-center mx-auto">
			{ connectWallet }
				<a href="/" className="flex items-center">
					<span className="self-center text-xl whitespace-nowrap text-gray-300 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Home</span>
				</a>
				<div className="flex md:order-2">
					<a href="https://ropsten.etherscan.io/address/0xdDFEB0006c91a8a8AC58a3e03a67D72Bc76CD8dC">
						<button type="button" className=" text-white font-semibold font-bold bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-blue-300  rounded-full text-sm px-5 py-2.5 text-center mr-1 md:mr-0 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 border-2 border-orange-400"> See Contract (Etherscan) </button>
					</a>
				</div>
				<div className="hidden justify-between items-center w-full md:flex md:w-auto md:order-1 mr-32" id="mobile-menu-4">
					<ul className="flex flex-col mt-4 md:flex-row md:space-x-32 md:mt-0 md:text-sm md:font-medium">
						<li>
						<Link href= {{pathname: "/enter", query: defaultAccount}}>
        					<a  className="block py-2 pr-4 pl-3 mt-4  text-xl  text-gray-300 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700"> Vote</a>
      					</Link>
      					</li>
      					<li>

        					<a href="/address" className="block py-2 pr-4 pl-3 text-xl  text-gray-300 border-b border-gray-100 hover:bg-gray-50 md:hover:bg-transparent md:border-0 md:hover:text-white md:p-0 md:dark:hover:text-white dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">My account <br /> {shortenAddress(defaultAccount)} </a>     					    						      								      							      				     						
      					</li>
      				</ul>
      			</div>
      		</div>
      		
      	</nav>
      	
    )
};			



export default Header;	