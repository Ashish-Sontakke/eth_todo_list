const { assert } = require("chai");

const TodoList = artifacts.require('./TodoList.sol');


contract("TodoList", (accounts) => {
    before(async() => {
        this.todoList = await TodoList.deployed();
    })

    it("deploys Successfully" ,async () => {
    const address = await this.todoList.address;
    console.log(address)
    assert.notEqual(address,0);
    assert.notEqual(address,"0x0");
    assert.notEqual(address,null);
    })


    it ("lists task", async () => {
    const taskCount = await this.todoList.taskCount();
    const task = await this.todoList.tasks(taskCount);
    assert.equal(taskCount,1);
    assert.equal(task.title,"Believe");

});

it ("creates tasks",async ()=> {
    const result = await this.todoList.createTask("You Must do it");
    console.log(result);
    const taskCount = await this.todoList.taskCount();
    assert.equal(taskCount,2);
    const event = result.logs[0].args;

    assert.equal(event.id,2);
    assert.equal(event.title,"You Must do it")
})


it('changesCompletionStatus',async () => {
    const result = await this.todoList.changeState(1);
    const task = await this.todoList.tasks(1);
    assert.equal(task.completed,true);
});

})