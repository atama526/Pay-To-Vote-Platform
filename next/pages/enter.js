import React, { Component, useState, useContext } from 'react';
import Layout from '../components/Layout';
import Link from 'next/link'
import '../styles/Home.module.css'
import { withRouter, NextRouter } from 'next/router'
import { MyContext } from '../components/Layout'
import { shortenAddress, checkIfWalletIsConnected} from '../utils';
import web3 from '../../contract/web3';
import instance from '../../contract/factory';
import Router from 'next/router'

//flag that helps to display a button in the section to show your account details everytime the page is refreshed
let buttonFlag = true


class Enter extends Component {
	
	state = {
		vote: '',
		errorMessage: '',
		loading: false,
		name: "",
		address: "",
		aux: 102,
		name1: ""		
	};

	//gets the current account and keeps it in the "address" state
	async componentDidMount() {
		const accounts = await web3.eth.getAccounts();
		const address = accounts[0];
		this.setState({address})
	}
	
	//Calls the api documents and filters it to display the name saved in the DB for the current account
	checkDetails = async (event) => {
		event.preventDefault()
		if (!window.ethereum) return alert("Please install Metamask");
		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'});
		const address = accounts[0].toLowerCase(); 
		const response = await fetch('/express/', { })
		const json = await response.json();
		const users = json.Users_registered 
		
		
		const results = users.filter( obj => {
			return obj.address == address
		})
		results[0] ? this.setState({name1: results[0].name}) : this.setState({name1: ""}); 		
		buttonFlag = false;
	}
		
	//calls the vote function and pays finney
	onSubmit = async (event) => {
		event.preventDefault();
		this.setState({loading: true})

		try {
			const accounts = await web3.eth.getAccounts();
			await instance.methods.vote().send({
				from: accounts[0],
				value: web3.utils.toWei(this.state.vote, 'finney')
			})

		} catch (err) {
			this.setState({ errorMessage: err.message})
		}
		this.setState({loading: false})
		window.location.href="/address"
	}	
	
	//Calls the routes to save a name of the user in the db. The account addressed is also saved in the mongo DB
	saveText = async event => {
    	event.preventDefault()
    	if (!window.ethereum) return alert("Please install Metamask");
    	const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'}); 
    	const signature = await web3.eth.personal.sign(this.state.name, accounts[0])
    	console.log(signature); 
    	const addressReco = await web3.eth.personal.ecRecover(this.state.name,signature)
    	    	   	
    	const res = await fetch('/express/save', {
      		body: JSON.stringify({
      			id: accounts[0].substr(0,8),
        		name: this.state.name,
        		address: accounts[0],
        		signature: signature 
      		}),
      		headers: {
        		'Content-Type': 'application/json'
      		},
      		method: 'POST'
    	})    	
    	Router.reload()
    	
  	}

	render() {
		return (	
			<Layout> 
				<div className="bg-slate-900 flex-row h-screen ">  
      				<div className=" object-right p-8 mb-1 mt-3 rounded-xl shadow-md"> 
        			{!this.state.loading &&	<h1 className="text-7xl text-gray-300 text-center tracking-widest font-bold "> SUBMIT YOUR VOTE </h1> }
        			{this.state.loading &&	<h1 className="text-7xl text-gray-300 text-center tracking-widest font-bold "> LOADING YOUR VOTE... </h1>}
      				</div>
      				<div className= "bg-slate-900 w-full h-full flex flex-wrap">
						
						<div className= "bg-slate-900 w-1/2 h-full flex flex-wrap">
							<div className= "w-full h-64 mx-28 mt-20 border-t border-r border-b border-l border-gray-700 lg:border-t lg:border-gray-700 bg-slate-800 rounded-xl mx-4 ml-8 p-4 flex flex-col items-center justify-between leading-normal">
								<div className="">
									<h1 className= "text-5xl text-white font-bold text-center"> Contribute Finney </h1>
									<h3 className= "text-xl text-gray-500 font-bold text-center mb-2"> Pay to be the winner of the vote <br /> 
										<p className= "text-xl text-center mb-2"> (1000 Finney = 1 Ether) </p>
									</h3> 
								</div>

								<form className="mb-24" onSubmit={this.onSubmit} error={!!this.state.errorMessage} >
									<div className="relative px-12 mx-16">
										<input type="text" 
											id="floating_outlined" 
											value={this.state.vote} 
											className="block  px-2.5 pb-2.5 pt-4 w-72 text-1xl text-bold text-white bg-transparent rounded-lg border-2 border-gray-300 appearance-none dark:text-white dark:border-gray-600 dark:focus:border-blue-500 focus:outline-none focus:ring-0 focus:border-blue-600 peer" 
											placeholder="" 
											onChange={event => this.setState({vote: event.target.value }) } 
										/>				
										<label className="absolute text-sm text-white bg-slate-800 dark:text-gray-400 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white dark:bg-gray-800 pl-16  peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 left-1">Enter Amount (Finney)</label>
									</div>
									<div className="flex justify-center">
										<button className= "bg-blue-500 hover:bg-blue-700 text-white text-2xl font-bold py-2 px-10 border border-blue-700 rounded mt-4"> VOTE </button>
									</div>
								</form>
							</div>
						</div>

						<div className= "w-1/2 h-full flex ">
							
							<div className= "w-96 h-64 ml-28 mt-20 border-t border-r border-b border-l border-gray-700 lg:border-t lg:border-gray-700 bg-slate-800 rounded-xl  p-4 flex flex-col justify-between leading-normal">
								<div className="">
									<h1 className= "text-3xl text-gray-400 font-bold text-center mt-6"> Set your Name (Optional) </h1>
								</div>
								<form 
									className="w-full max-w-sm mb-16"
									onSubmit= {this.saveText} >
								
  									<div className="flex items-center border-b border-gray-300 py-2">
   									 	<input className="appearance-none bg-transparent border-none w-full text-white mr-3 py-1 px-2 leading-tight focus:outline-none" 
   									 	type="text" 
   									 	placeholder="Jane Doe"
   									 	value={this.state.name}
   									 	onChange={event => this.setState({name: event.target.value})} 
   									 	
    									/>
    									<button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 border border-blue-700 rounded mt-4">
      										Set
    									</button>
      								</div>
								</form>
							</div>
							<div className="bg-orange-500 border-orange-400 h-56 p-8 border-2 rounded-xl ml-16 mt-28 mr-8 shadow-md divide-y">
          						<h1 className="text-3xl text-white text-left font-bold"> Your Account: </h1>
          							{ buttonFlag &&
                   		                <form onSubmit= { this.checkDetails }>
					                      <button 
					                        className="bg-blue-700 hover:bg-blue-800 text-white font-bold py-2 px-3 border border-blue-500 items-center ml-5 mt-5 rounded my-2">
					                              Check Details
					                      </button>
					                    </form>
                  					} { !buttonFlag &&
          						<div>
          							<h1 className="text-1xl text-gray-800 font-bold"> {shortenAddress(this.state.address)} </h1>						
          							<h1 className= "text-2xl text-white text-left font-bold mt-4 "> Your Name:  </h1>
									<p className="text-1xl text-gray-800 font-bold"> {this.state.name1} </p> 
								</div>
								}
							</div>
						</div>
					</div>
      			</div>
      			
			</Layout>
	 	);
	}
}



export default Enter;
