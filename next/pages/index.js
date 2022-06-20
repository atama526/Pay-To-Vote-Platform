import React, { Component } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import Link from 'next/link'
import styles from '../styles/Home.module.css'
import { getName } from '../../lib/misc.js'
import Router from 'next/router'
import factory from '../../contract/factory';
import { shortenAddress, toFinney, checkIfWalletIsConnected } from '../utils';
import Layout from '../components/Layout';

export default function Home(props) {
    
  

  return (
    <Layout>
    
    <div className="bg-slate-900 flex-row  h-screen">  
      <div className=" object-right bg-slate-900 p-8 mb-1 mt-3 rounded-xl shadow-md"> 
        <h1 className="text-7xl text-gray-300 text-center tracking-widest font-bold "> PAY TO VOTE </h1>
      </div>
      <div className= " bg-slate-900 flex flex-wrap flex-row justify-between items-end px-28 ">
        
        <div className = "bg-slate-800 rounded-xl ml-32 h-64 w-1/2 border-2 border-slate-700 text-center mb-48">
          <h1 className= "text-5xl text-white font-bold text-center py-4"> Would you like to win?
          </h1>
          <h3 className= "text-2xl text-gray-500 font-bold text-center mb-4"> Contribute Finney to be the winner of the vote <br /> ( 1000 Finney = 1 Ether ) 
          </h3>
          <Link href="/enter">
            <a>
              <button 
              className= " bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-10 border border-blue-700 rounded mt-4"> 
              Enter 
              </button>
            </a>
          </Link>
        </div>
        <div className="bg-orange-500 p-8 border-2 border-orange-400 rounded-xl shadow-md divide-gray-200 divide-y-2 ">
          <h1 className="text-3xl text-white text-center font-bold"> WINNER </h1>
          <div className="mb-4 mt-5 divide-solid border-2 border-gray-500 rounded-2xl pb-2">

              <p className="text-xl text-white font-bold px-4">Name: {(props.winnerName)}</p>
              <p className="text-xl text-white font-bold px-4">Address: {shortenAddress(props.winnerAddress)}</p>
              <p className="text-xl text-white font-bold px-4">Balance: {toFinney(props.winnerBalance)} Finney </p>                                       
          </div>
        <div>          
            <h1 className= "text-2xl text-center text-gray-800 font-bold mb-2"> Runners up </h1>
            <p className="text-1xl text-gray-800 font-bold ">1. { props.secondName } <br /> {shortenAddress(props.secondAddress)} <br />
            Balance: {toFinney(props.secondBalance)} Finney 
            </p>
            <p className="text-1xl font-bold text-gray-800 my-2">2. { props.thirdName } <br /> {shortenAddress(props.thirdAddress)} <br />
            Balance: {toFinney(props.thirdBalance)} Finney
            </p>
            <p className="text-1xl text-gray-800 font-bold ">3. { props.fourthName } <br /> {shortenAddress(props.forthAddress)} <br />
            Balance: {toFinney(props.forthBalance)} Finney 
            
            </p>
          </div>
        </div>
      </div>
    </div>
  
    </Layout>
  )
}




export async function getServerSideProps() {
  
  //Call a variable from the contract that keeps track of how many different accounts have voted
  
  const votersCount = await instance.methods.getVotersCount().call()
  
  
    //calls the topBalances function and returns the firs 4 (winners) 
    let topVoters = await Promise.all(
      Array(parseInt(votersCount)).fill().map((element, index) => {
        return instance.methods.topBalances(index).call();
      })
    );
  topVoters.push({balance:"0", addr:"0x000000"},{balance:"0", addr:"0x000000"},{balance:"0", addr:"0x000000"},{balance:"0", addr:"0x0000000"});
  let addrs = topVoters.map(a => a.addr);
  
  return {
    props: {
      votersCount: votersCount,
      winnerAddress: topVoters[0].addr,
      winnerName: await getName(addrs[0]),
      winnerBalance: topVoters[0].balance,
      secondAddress: topVoters[1].addr,
      secondName: await getName(addrs[1]),
      secondBalance: topVoters[1].balance,
      thirdAddress: topVoters[2].addr,
      thirdName: await getName(addrs[2]),
      thirdBalance: topVoters[2].balance,
      forthAddress: topVoters[3].addr,
      fourthName: await getName(addrs[3]),
      forthBalance: topVoters[3].balance
      
      
      
    }
  }
    
  
}
