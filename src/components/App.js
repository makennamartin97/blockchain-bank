import { Container, Navbar,Tabs, Tab, Row, Col} from 'react-bootstrap'
//import Navbar from 'react-bootstrap/Navbar'
import dBank from '../abis/dBank.json'
import React, { Component } from 'react';
import Token from '../abis/Token.json';
import dbank from '../dbank.png';
import Web3 from 'web3';
import './App.css';

//h0m3w0rk - add new tab to check accrued interest

class App extends Component {

  async componentWillMount() {
    await this.loadBlockchainData(this.props.dispatch)
  }

  async loadBlockchainData(dispatch) {
    //check if user has metamask installed
    if(typeof window.ethereum !== 'undefined'){
      const web3 = new Web3(window.ethereum) //metamask gives us window.eth.........
      //get net id to see if they're on main network or ganache etc
      const netID = await web3.eth.net.getId()
      //console.log(netID)
      //fetch all the accounts we're connected to 
      const accounts = await web3.eth.getAccounts()
      console.log('ACCOUNTS:', accounts[0])
      //console.log(accounts[0])
      //load balance, if account exists
      if(typeof accounts[0] !== 'undefined'){
        const balance = await web3.eth.getBalance(accounts[0])
        this.setState({account: accounts[0], balance: balance, web3: web3})
      }else{
        window.alert("Please login with MetaMask")
      }

    //load contracts
      try {
      //(jsonInterface is the abi, json array of data)
      //token
      //new web3.eth.Contract(jsonInterface[, address][, options])
      //below creates javascript versions of the bank and token and saves it all to the react state object
        const token = new web3.eth.Contract(Token.abi, Token.networks[netID].address);
      //bank
        const dbank= new web3.eth.Contract(dBank.abi, dBank.networks[netID].address);
      //save address for bank
        const dBankAddress = dBank.networks[netID].address;
        this.setState({token: token, dbank: dbank, dBankAddress: dBankAddress});
        console.log("bank address:", dBankAddress)
      }catch (e){
        console.log('Error:', e);
        window.alert('Contracts not deployed to the current network');
      }
      
    }else{
      window.alert('Please install MetaMask')
    }
    
    //metamask gives us window.ethereum 

    //check if MetaMask exists

      //assign to values to variables: web3, netId, accounts

      //check if account is detected, then load balance&setStates, elsepush alert

      //in try block load contracts

    //if MetaMask not exists push alert
    
  }

  async deposit(amount) {
    //check if this.state.dbank is ok
    if(this.state.dbank !== 'undefined'){
      try{
        //in try block call dBank deposit();
        await this.state.dbank.methods.deposit().send({value: amount.toString(), from: this.state.account})
      }catch(e){
        console.log("Error", e)
      }
      
    }
      
  }

  async withdraw(e) {
    //prevent button from default click
    //check if this.state.dbank is ok
    //in try block call dBank withdraw();
  }

  constructor(props) {
    super(props)
    this.state = {
      web3: 'undefined',
      account: '',
      token: null,
      dbank: null,
      balance: 0,
      dBankAddress: null
    }
  }

  render() {
    return (
      <Container>
      
        <Navbar bg="dark" variant="dark">
          <Container className="d-flex bd-highlight">
          <Navbar.Brand className="p-2 w-100 ">

           <img src={dbank} alt="logo" height="32"/>
            {'  '}Makenna Bank
          </Navbar.Brand>
          <Navbar.Collapse>
          <Navbar.Text className="p-2 flex-shrink-1">
          

            Account: {this.state.account}
          </Navbar.Text>
          </Navbar.Collapse>
          </Container>
  
   
       
       
        </Navbar>
        <div className="container-fluid mt-5 text-center">
        <br></br>
          <h1>Welcome to Makenna Bank</h1>
          <br></br>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center justify-content-center">
              <div className="content mr-auto ml-auto">
              <Tabs defaultActiveKey="profile" id="uncontrolled-tab-example">
                
                <Tab eventKey="deposit" title="Deposit">
                  <br></br>
                  <div>Deposit(Minimum 0.01 ETH):</div>
                  <form onSubmit={(e)=>{
                    e.preventDefault() //prevents from refreshing
                    let amount = this.depositAmount.value
                    amount = amount * 10**18 //convert to wei
                    this.deposit(amount)
                  }}>
                  <input
                  id="depositAmt"
                  step="0.01"
                  type="number"
                  className="form-control"
                  placeholder="amount"
                  required
                  ref={(input)=> {this.depositAmount = input}}
                  />
                  <button type="submit" className="btn btn-primary">Deposit</button>
                  </form>
                </Tab>
                <Tab eventKey="withdraw" title="Withdraw">
                  <br></br>
                  <div>Withdraw(Minimum 0.01 ETH):</div>
                  <form onSubmit={(e)=>{}}>
                  <input
                  id="withdrawAmt"
                  step="0.01"
                  type="number"
                  className="form-control"
                  placeholder="amount"
                  required
                  ref={(input)=> {this.withdrawAmount = input}}
                  />
                  <button type="submit" className="btn btn-primary">Withdraw</button>
                  </form>

                </Tab>
              </Tabs>
              </div>
            </main>
          </div>
        </div>
        </Container>
      
    );
  }
}

export default App;