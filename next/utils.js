import web3 from '../contract/web3';
import React, { useState, useContext, useEffect } from 'react';

//Function to reduce the length of the hash of a Metamask Address only the first 5 characters and the last 4 Characters are displayed
export const shortenAddress = (address) => `${address.slice(0,5)}...${address.slice(address.length-4)}`; 

//Function to show wei amount in Finney
export const toFinney = (balance) => web3.utils.fromWei(balance,'finney');


//Checks if the ethereum wallet is connected, displays message if not
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

