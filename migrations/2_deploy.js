const Token = artifacts.require("Token");
const dBank = artifacts.require("dBank");

module.exports = async function(deployer) {
	//deploy Token (to network)
	await deployer.deploy(Token)

	//assign token into variable to get it's address
	//fetching token and assigning to  a variable
	const token = await Token.deployed()
	
	//pass token address for dBank contract(for future minting)
	//deploying the bank to the network just as we did the token, 
	//but we pass in the token address because it needs to keep track of it
	await deployer.deploy(dBank, token.address)
	//assign dBank contract into variable to get it's address
	const dbank = await dBank.deployed()
	//change token's owner/minter from deployer to dBank
	//instead of minter controlling it w4e want the bank to control it
	await token.passMinterRole(dbank.address)
};