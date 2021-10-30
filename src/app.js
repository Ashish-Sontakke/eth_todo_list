App = {
    loading: false,
    contracts : {},
    load: async () => {
        await App.loadWeb3();
        await App.loadAccount();
        await App.loadContract();
        await App.render();
    },

    loadWeb3:  async () => {
        if (typeof web3 !== 'undefined') {
        //   App.web3Provider = web3.ethereum
        //   web3 = new Web3(web3.web3Provider);
        } else {
          window.alert("Please connect to Metamask.")
        }
        // Modern dapp browsers...
        if (window.ethereum) {
        //   window.web3 = new Web3(ethereum)
          try {
            // Request account access if needed
           const recievedAccounts =  await ethereum.request({ method: 'eth_requestAccounts' });
           console.log(`recieved accounts: ${recievedAccounts}`) 
           // Acccounts now exposed
          } catch (error) {
              console.log(`recieved accounts error:  ${error}`);
            // User denied account access...
          }
        }
        // Legacy dapp browsers...
        else if (window.web3) {
          App.web3Provider = web3.currentProvider
        //   window.web3 = new web3.ethereum;
          // Acccounts always exposed
        }
        // Non-dapp browsers...
        else {
          console.log('Non-Ethereum browser detected. You should consider trying MetaMask!')
        }
      },

      loadAccount: async () => {
        const accounts = await ethereum.request({ method: 'eth_accounts' }); 
        console.log(`load account accounts ${accounts}`);
        App.account = accounts[0];
        console.log(App.account);
    },


    loadContract: async () => {
        const todoList = await $.getJSON('TodoList.json');
        console.log(App.todoListContract);
        App.contracts.TodoList = TruffleContract(todoList);
        App.contracts.TodoList.setProvider(ethereum);

        App.todoList = await App.contracts.TodoList.deployed();
        console.log(App.todoList);
    },


 render: async () => {
        // Prevent double render
        if (App.loading) {
          return
        }
    
        // Update app loading state
        App.setLoading(true)
    
        // Render Account
        $('#account').html(App.account)
    
        // Render Tasks
        await App.renderTasks()
    
        // Update loading state
        App.setLoading(false)
      },

      
  setLoading: (boolean) => {
    App.loading = boolean
    const loader = $('#loader')
    const content = $('#content')
    if (boolean) {
      loader.show()
      content.hide()
    } else {
      loader.hide()
      content.show()
    }
  },


  renderTasks: async () => {
    // Load the total task count from the blockchain
    const taskCount = await App.todoList.taskCount()
    const $taskTemplate = $('.taskTemplate')

    // Render out each task with a new task template
    for (var i = 1; i <= taskCount; i++) {
      // Fetch the task data from the blockchain
      const task = await App.todoList.tasks(i)
      const taskId = task[0].toNumber()
      const taskContent = task[1]
      const taskCompleted = task[2]

      // Create the html for the task
      const $newTaskTemplate = $taskTemplate.clone()
      $newTaskTemplate.find('.content').html(taskContent)
      $newTaskTemplate.find('input')
                      .prop('name', taskId)
                      .prop('checked', taskCompleted)
                      .on('click', App.changeState)

      // Put the task in the correct list
      if (taskCompleted) {
        $('#completedTaskList').append($newTaskTemplate)
      } else {
        $('#taskList').append($newTaskTemplate)
      }

      // Show the task
      $newTaskTemplate.show()
    }
  },

  createTask: async() => {
      App.setLoading(true);
      const content = $('#newTask').val();
      console.log(content);
      console.log(App.account);
    const response =  await  App.todoList.createTask(content,{from:  App.account});
     console.log(response);
    window.location.reload();
    },


    changeState: async (e) => {
    App.setLoading(true)
    const taskId = e.target.name;
    await App.todoList.changeState(taskId,{from: App.account})  
    
    window.location.reload();  
}

    }


$(() => {
  $(window).load(() => {
    App.load()
  })
})