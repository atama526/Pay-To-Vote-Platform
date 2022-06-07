pragma solidity >=0.7.0 <0.9.0;

contract PayToVote {

    address[] public voters;

    event NewTx(address indexed from, uint amount); 

    mapping (address => uint) public balance;
    struct TopBalance {
        uint balance;
        address addr;
    }
    TopBalance[] public topBalances;
    
    
    function vote() public payable {
        require(msg.value > 0);
        /** event to keep track of the votes by user**/
        emit NewTx(msg.sender, msg.value);
        balance[msg.sender] += msg.value;
        initArray();
        /** Call function that will keep track of the winner and 3 Runnersup **/
        top(msg.sender,msg.value);
    }
    /** Initiate the topBalances array in zero **/
    function initArray() private {
        TopBalance memory x;
        x.balance = 0;
        x.addr = address(0); 
        topBalances.push(x);
    }

    function top(address addr, uint currentValue) private {
        bool isIn;
        uint i=0;
        uint k = 0;
        /** keep track of an index if the user has voted already **/
        for(k ; k < topBalances.length ; k++) {
            if(addr == topBalances[k].addr) {
                isIn = true;
                /** Add previous balance to the new balance of the user**/
                currentValue += topBalances[k].balance; 
                break;
            }
        }
        /** Get the index of the current max element**/ 
        for(i ; i < topBalances.length ; i++) {
            if(topBalances[i].balance < currentValue) {
                break;
            }
        }
        /** shift the winners position if the user hasnt voted previously**/
        if(isIn == false) {
            voters.push(addr);
            for(uint j = topBalances.length -1; j>i ; j--) {
                topBalances[j].balance = topBalances[j-1].balance;
                topBalances[j].addr = topBalances[j-1].addr;       
            }
        } /** shift the winners position if the user has voted previously **/
         else {
            for(uint j = k ; j > i ; j--) {
                topBalances[j].balance = topBalances[j-1].balance;
                topBalances[j].addr = topBalances[j-1].addr;
            }
        }

        /** Update the new user balance in the right postition **/
        topBalances[i].balance = currentValue;
        topBalances[i].addr = addr;
    }
}