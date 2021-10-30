// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TodoList {

    uint public taskCount;




    struct Task {
     uint id;
     string title;
     bool completed;   
    }

    mapping (uint => Task) public tasks;

    event TaskCreated(
        uint id,
        string title,
        bool completed
    );


    constructor () {
        createTask("Believe");
    }

    function createTask(string memory title) public {
        taskCount++;
        tasks[taskCount] = Task(
            taskCount,
            title,
            false
        );
        emit TaskCreated(taskCount, title, false);
    }
        

    function changeState(uint id) public {
       Task memory task =  tasks[id];
       task.completed = !task.completed;
       tasks[id] = task;
    }



}