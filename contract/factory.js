import web3 from './web3';
import PayToVote from './PayToVote.json';

const instance = new web3.eth.Contract(
	PayToVote.abi,'0xdDFEB0006c91a8a8AC58a3e03a67D72Bc76CD8dC'
);

export default instance;