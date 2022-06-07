import web3 from '../contract/web3';
import React, { useState, useContext, useEffect } from 'react';

export const shortenAddress = (address) => `${address.slice(0,5)}...${address.slice(address.length-4)}`; 

export const toFinney = (balance) => web3.utils.fromWei(balance,'finney');



export const checkIfWalletIsConnected = async () => {
	if (!window.ethereum) return alert("Please install Metamask");
	const accounts = await window.ethereum.request({ method: 'eth_accounts'});
	if (accounts.length) {
		let account = (accounts[0]);		
	} else { 
		console.log("No accounts found");
	}
	return (account)
}

