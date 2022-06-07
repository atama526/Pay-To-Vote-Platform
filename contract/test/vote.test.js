const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { Web3 } = require('web3');

let Vote;
let vote;
let owner;
let addr1;
let addr2;

beforeEach(async () => {
   Vote = await ethers.getContractFactory('PayToVote');
   [owner, addr1, addr2] = await ethers.getSigners();
   vote = await Vote.deploy();
   web3 = require('web3');	
   });

describe("Vote", () => {

  it("Deploys the contract", async () => {
    assert.isOk(vote.address,"Contract was deployed to an address");
    });

  it("A user can and vote,  voter´saddress and balance will be recorded", async () => {
    await vote.vote({value: 100});
    assert.equal(await vote.balance(owner.address), '100', "the vote was recorded in the balance for the account"); 
    assert.equal(await vote.voters(0),owner.address, "the current address was registered as voter");
  });

  it("Accepts a second voter, address and balance recorded", async () => {
     await vote.vote({value:100});	  
     await vote.connect(addr1).vote({value: web3.utils.toWei('2','ether')});
     assert.equal(await vote.balance(addr1.address),web3.utils.toWei('2', 'ether'),"Address 2 balance is correct");
     assert.equal(await vote.voters(1),addr1.address, "Second voter address registered correctly"); 
  });
  
  it("Allows a user to vote more than one time", async () => {
     await vote.vote({value: 100});
     await vote.connect(addr1).vote({value: web3.utils.toWei('2', 'ether')});
     await vote.connect(addr1).vote({value: web3.utils.toWei('2','ether')});
     assert.equal(await vote.balance(addr1.address), web3.utils.toWei('4', 'ether'));
    });

  it("Correctly keeps record of the top voters", async () => {
    await vote.vote({value: web3.utils.toWei('1','ether')});
    await vote.connect(addr1).vote({value: web3.utils.toWei('2','ether')});
    await vote.connect(addr2).vote({value: web3.utils.toWei('3','ether')});
    await vote.connect(addr1).vote({value: web3.utils.toWei('2','ether')});
    let winner = await vote.topBalances(0);
    assert.equal(winner.addr,addr1.address);
    let second = await vote.topBalances(1);
    assert.equal(second.balance,web3.utils.toWei('3','ether'));
    

  });
});

  
