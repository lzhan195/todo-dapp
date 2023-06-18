import React, {useState, useEffect} from "react";
import {TextField, Button} from "@mui/material"
import Task from "./Task"
import "./App.css"

import { TaskContractAddress } from "./config";
import {ethers} from "ethers";
import TaskAbi from "./ToDoTask.json"


function App(){
  const [tasks,setTasks] = useState([]);
  const [input,setInput] = useState([]);
  const [currentAccount,setCurrentAccount] = useState("");
  const [correctNetwork,setCorrectNetwork] = useState(false);

  const connectWallet = async()=>{
    try{
      const {ethereum} = window;
      if(!ethereum){
        console.log("MetaMask not detected");
      }

      let chainId = await ethereum.request({method:"eth_chainId"});
      console.log(`Connected to chain: ${chainId}`);

      const sepoliaChainID = "0xaa36a7";
      if (chainId !== sepoliaChainID){
        alert("You are not connected to Sepolia network");
        return;
      }else{
        setCorrectNetwork(true);
      }

      const accounts = await ethereum.request({method:"eth_requestAccounts"});
      console.log(`Found account: ${accounts[0]}`);
      setCurrentAccount(accounts[0]);
      
    }catch(error){
      console.log("Error Connecting to MetaMask", error)
    }
  }

  const addTask = async(e)=>{
    e.preventDefault();
    let task = {
      'taskText':input,
      'isDeleted':false
    };
    try{
      if(window.ethereum){
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const TaskContract = new ethers.Contract(TaskContractAddress,TaskAbi.abi,signer);
        TaskContract.addTask(task.taskText,task.isDeleted).then(response =>{
          setTasks([...tasks,task]);
        }).catch(err=>{
          console.log("Error occured while adding a new task");
        });
      }else{
        console.log("Ethereum object does not exist!")
      }
    }catch(error){
      console.log("Error submitting the task!")
    }
    setInput("");
  }

  const deleteTask = key =>async()=>{
    try{
      if(window.ethereum){
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        const TaskContract = new ethers.Contract(TaskContractAddress,TaskAbi.abi,signer);

        let deleteTaskTx = await TaskContract.deleteTask(key,true);
        let allTasks = await TaskContract.getMyTasks();
        setTasks(allTasks);
      }else{
        console.log("Ethereum object doesnt exist!")
      }
    }
    catch(error){
      console.log(error)
    }
  }

  const getAllTasks = async()=>{
    try{
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const TaskContract = new ethers.Contract(TaskContractAddress,TaskAbi.abi,signer);

      let allTasks = await TaskContract.getMyTasks();
      setTasks(allTasks);  
    }catch(error){
      console.log(error)
    }
  }

  useEffect(()=>{
    getAllTasks();
    connectWallet();
  },[]);


  return (
    <div>
      {currentAccount ==="" ? (
        <center><button className="button" onClick={connectWallet}>Connect Wallet</button></center>
      ) : correctNetwork ? (
        <div className="App">
          <h2>Task Management App</h2>
          <form>
            <TextField id="outlined-basic" label="Make Todo" variant="outlined" style={{margin:"0px 5px"}} size="small" value={input} onChange={e=>setInput(e.target.value)} />
            <Button variant="contained" color="primary" onClick={addTask}> Add Task </Button>
          </form>
          <ul>
            {tasks.map(item=>
              <Task key={item.id} taskText={item.taskText} onClick={deleteTask(item.id)}></Task>)}
          </ul>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center mb-20 font-bold test-2xl gap-y-3">
          <div>Please connect to the Sepolia Testnet and reload the screen</div>
        </div>
      )}
    </div>
  )
}

export default App;