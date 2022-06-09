import React, { Component } from 'react';
import Layout from '../components/Layout';
import factory from '../../contract/factory';
import { shortenAddress, toFinney, checkIfWalletIsConnected } from '../utils';
import web3 from '../../contract/web3';


let buttonFlag = true; 

class Address extends Component {
  
  state = {
    myAddress: "",
    txHash: [],
    txValue: [],
    addrChanged: false,
    myBalance: "",
    votersCount:"",
    winnerAddr:"",
    winnerBalance:""
  };
  
  
//Sets current winner and gets its current value and address into a state
  async componentDidMount() {
    const votersCount = await factory.methods.getVotersCount().call()
    let topVoter = await factory.methods.topBalances(0).call(); 
    this.setState({votersCount: votersCount, winnerAddr:topVoter.addr, winnerBalance: topVoter.balance })
    if (!window.ethereum) return alert("Please install Metamask");
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'});
    
   //Gets current account and balance
    this.setState({myAddress: accounts[0]});
    const myBalance = await factory.methods.balance(accounts[0]).call();
    this.setState({ myBalance });
  }

  //CAll the events from the smart contract, the events keep record of the transactions hash and the value, this is filtered by address
  getTx = async (event) => {
    event.preventDefault();

    if (!window.ethereum) return alert("Please install Metamask");
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'});
    let events = await factory.getPastEvents('NewTx',{
      filter: {from: accounts[0] },
      fromBlock: 12312502
    });

    const items = events.map( (a)=> { 
      return {
        header: a.transactionHash,
        value: a.returnValues.amount
      }; 
    });  
    console.log(items)

    let txHash = await events.map(a => a.transactionHash)
    let txValue = await events.map(a => a.returnValues.amount)
    this.setState({txHash:txHash, txValue:txValue})
    buttonFlag = false;
  }


  render()  {

    return (

      <Layout>
       
        <div className="bg-slate-900 flex-row  h-screen">  
          <div className=" object-right bg-slate-900 p-8 mb-1 mt-3 rounded-xl shadow-md"> 
            <h1 className="text-7xl text-gray-300 text-center tracking-widest font-bold  "> ACCOUNT DETAILS </h1>
          </div>
          <div className= "bg-slate-900 w-full h-full flex flex-wrap">
            <div className= "bg-slate-900 w-1/3 h-full flex flex-wrap justify-between items-center pl-32 pb-56">
              <div className="bg-orange-500 p-8 border-4 border-orange-400 rounded-xl shadow-md divide-y-4 divide-gray-800 pl-2 ">
                <h1 className="text-3xl text-gray-100 text-center font-bold ml-4 px-4"> Current Balance </h1>
                <div className="mb-4 mt-5 divide-solid border-2 border-black rounded-2xl pb-2">
                  <p className="text-xl text-gray-100 font-bold px-4">Your Address: {shortenAddress(this.state.myAddress)}  </p>                 
                  <p className="text-xl text-gray-100 font-bold px-4">Your Balance: {toFinney(this.state.myBalance)} Finney </p>                                      
                </div>
                <div>
                  <h1 className= "text-2xl text-center font-bold mb-2"> Current Winner </h1>
                  <p className="text-1xl font-bold">Address: {shortenAddress(this.state.winnerAddr)}  </p>
                  <p className="text-1xl font-bold underline my-2"> Balance: {toFinney(this.state.winnerBalance)} Finney </p>                  
                </div>
              </div>
            </div>
            <div className= "bg-slate-900 w-2/3 h-full flex   pt-16 pl-48 pb-72 ">              
              <div className="bg-slate-800 h-full flex flex-col justify-center  p-8 border-2 border-gray-700 rounded-xl shadow-md pl-2 mb-4 ">
                <div className= "mb-6 pt-4 items-center" >
                  <h1 className="text-3xl text-center text-white font-bold mt-2"> My Transactions </h1>                                  
                  <h1 className= "text-2xl text-center text-gray-500 font-bold mb-2"> (See on Etherscan) </h1>
                  { buttonFlag && !this.state.addrChanged &&   
                    <form onSubmit= { this.getTx }>
                      <button 
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-6 border border-blue-700 items-center ml-8 rounded my-2"                        
                      >
                              Check Transactions
                      </button>
                    </form>
                  }
                  { !buttonFlag &&
                    <div className="flex items-center">
                    <p className="ml-4 text-1xl font-bold text-gray-500  text-center"> Value <br /> (Finney) </p> <p className="ml-8 pb-6 text-gray-500 text-1xl font-bold"> Hash </p> 
                    </div>
                  }                  
                  <div className= "flex flex-row items-center mb-2">
                    <div className="bg-slate-800 w-2/5 mb-4">                                         
                      {this.state.txValue.map((item,index) => {
                        return (                    
                        <div key={index} className="flex items-center"> 
                          <p className= "text-1xl text-white text-left font-bold mb-2 mx-2"> {index+1}. </p> 
                          <p className= "text-xl text-gray-200 text-center mb-2">{toFinney(item)} </p>
                        </div>
                        
                        )  
                      })}
                      
                    </div> 
                    <div className="bg-slate-800 w-full mb-4">                                         
                      {this.state.txHash.map((item,index) => {
                        return (                    
                        <div key={index} className="flex items-center">
                          <a href={`https://ropsten.etherscan.io/tx/${item}`}> 
                            <p className= "text-1xl text-gray-200 text-center underline mb-3 ml-8">{item} </p>
                          </a>
                        </div>                       
                        )  
                      })} 
                    </div>                                      
                  </div>   
                </div>
              </div>
            </div>
          </div>
        </div>          
      </Layout>
    )
  }
}




export default Address
