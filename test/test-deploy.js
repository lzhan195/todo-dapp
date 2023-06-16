const {expect} = require("chai");
const {ethers} = require("hardhat");

describe("Task Contract", function(){
  let TaskContract;
  let taskcontract;
  let owner;

  const NUM_TOTAL_TASKS=5;
  let totalTasks;

  beforeEach( async function(){
    TaskContract = await ethers.getContractFactory("ToDoTask");
    [owner] = await ethers.getSigners();
    taskContract = await TaskContract.deploy();

    totalTasks = [];

    for(let i=0; i < NUM_TOTAL_TASKS; i++){
      let task = {
        'taskText':"Task number :-"+i,
        'isDeleted':false
      };
      await taskContract.addTask(task.taskText, task.isDeleted);
      totalTasks.push(task);
    }
  })

  describe("Add Task", function(){
    it("Should emit AddTask Event",async function(){
      let task ={
        "taskText":"New Task",
        "isDeleted":false,
      }
      await expect(await taskContract.addTask(task.taskText,task.isDeleted)).to.emit(taskContract,"AddTask").withArgs(owner.address,NUM_TOTAL_TASKS);
    })
  })

  describe("Get All Tasks", function(){
    it("Should return the correct number of total tasks",async function(){
      const allMyTasks = await taskContract.getMyTasks();
      expect(allMyTasks.length).to.equal(NUM_TOTAL_TASKS);
    })
  })

  describe("Delete Task",function(){
    it("Should Emit DeleteTask Event", async function(){
      const TASK_ID = 0;
      const TASK_DELETED = true;
      await expect(taskContract.deleteTask(TASK_ID,TASK_DELETED)).to.emit(taskContract,'DeleteTask').withArgs(TASK_ID,TASK_DELETED);
    })
  })
})