// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
  //add minter variable
  address public minter;


  //add minter changed event
  //solidity allows events such as transfer events, approval events, etc (erc 20 standard)'
  //smart contracts have event logs, and we want to log every time a minter has changed
  event MinterChanged(address indexed from, address to);

  constructor() public payable ERC20("Decentralized Bank Currency", "DBC") {
    //asign initial minter
    minter = msg.sender;
  }

  //Add pass minter role function
  //fxn for changing who the minter is
  //we will be the minter but we need the ability to transfer the role to the bank
  function passMinterRole(address dBank) public returns (bool){
    //makes sure that we are the minter
    require(msg.sender == minter, 'Error: Only the owner can change pass minter role');
    //lets the new minter be the dbank
    minter = dBank;
    emit MinterChanged(msg.sender, dBank);
    return true;
  }

  function mint(address account, uint256 amount) public {
    //check if msg.sender have minter role
    require(msg.sender == minter,'Error: msg.sender does not have minter role');
		_mint(account, amount);
	}
}