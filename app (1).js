var hash;

App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    return App.initWeb3();
  },

  // },

  initWeb3: async function() {
     // Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.request({ method: 'eth_requestAccounts' });
      } catch (error) {
        // User denied account access...
        console.error("User denied account access")
        $('.showAccount').text('No connect');
        $('.panel-pet').eq(0).find('button').text('Metamask no connect').attr('disabled', true);
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
     // console.error("User Ganache")
    }
     // App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    web3 = new Web3(App.web3Provider);
     const accounts = await window.ethereum.request({ method: 'eth_accounts' })
    .catch((err) => {
      if (err.code === 4001) {
        // EIP-1193 userRejectedRequest error
        // If this happens, the user rejected the connection request.
        console.log('Please connect to MetaMask.');
      } else {
        console.error(err);
        $('.showAccount').text('No connect');
      }
    });
    const account = accounts[0];
    $('.showAccount').text(account);
    console.log(account);

    return App.initContract();

  },


   initContract: async function() {
    
      web3.eth.defaultAccount = web3.eth.accounts[0];
    
      var contract_address = '0xA67dC38E1084F87B5aeF96B7F8091b5224a08717';
      $(Dcontr).text(contract_address);
      var abi =[
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_Hash",
        "type": "string"
      }
    ],
    "name": "Consulta",
    "outputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_Name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_Hash",
        "type": "string"
      }
    ],
    "name": "Creacion_Registro",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];
      //var CoursesContract = web3.eth.contract(abi);
      //App.contracts.contract888CN = CoursesContract.at(contract_address);
      App.contracts.contractV = new web3.eth.Contract(abi,contract_address);
      console.log(App.contracts.contractV);
       

      /*contract888CN.metods.name(function(error, result){
      if(!error){
        console.log(result);
        console.log("contract nice");
        }
        else
          console.error(error);
        });
*/
    return App.bindEvents();
  },

  bindEvents: function() {
    const ethereumButton = document.querySelector('.enableEthereumButton');
    ethereumButton.addEventListener('click', () => {
      App.getAccount();
    });
    $(document).on('click', '.tbnCons', App.Consulta);
    $(document).on('click', '.tbnCnot', App.CrearRegistro);
    window.ethereum.on('accountsChanged', App.handleAccountsChanged);
  },

   getAccount: async function() {
   const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
      .catch((err) => {
        if (err.code === 4001) {
          // EIP-1193 userRejectedRequest error
          // If this happens, the user rejected the connection request.
          console.log('Please connect to MetaMask.');
          $('.showAccount').text('No connect');
          $('.panel-pet').eq(0).find('button').text('Metamask no conect').attr('disabled', true);
        } else {
          console.error(err);
        }
        const account = accounts[0];
        $('.showAccount').text(account);
      });
  },
  handleAccountsChanged:function(accounts) {
    if (accounts.length === 0) {
      // MetaMask is locked or the user has not connected any accounts.
      console.log('Please connect to MetaMask.');
      $('.showAccount').text('No connect');
      $('.panel-pet').eq(0).find('button').text('Metamask no conect').attr('disabled', true);
      const account = accounts[0];
      // Reload your interface with accounts[0].
      // Update the account displayed (see the HTML for the connect button)
      showAccount.innerHTML = 'No found wallet';
    } else  {
      const account = accounts[0];
      $('.showAccount').text(account);
       $('.panel-pet').eq(0).find('button').text('Mint:0.0061 ETH').attr('disabled', false);
    }
  },
  
  Consulta:async function(){
    var Idv = $('#Tivc').val();
    console.log(App.contracts.contractV);
    const providersAccounts = await web3.eth.getAccounts();
       const defaultAccount = providersAccounts[0];
       //console.log;
       try {
        // Get the current value of my number
        const DataE = await App.contracts.contractV.methods.Consulta(Idv).call();
        console.log(DataE);
        if (DataE == ""){
          alert("Este codigo no existe");
        }
        else{
          alert("la empresa con NIT: "+ DataE + " tiene registro activo");
        }
        

    } catch (error) {
        console.error(error);
    }
   
  },

  
  CrearRegistro:async function(event){
    var Nit = $('#Tnit').val();
    var selectedFile =  document.getElementById('fileUpload1').files[0];
    var preview = document.getElementById("preview1");
    console.log(selectedFile);
    if (selectedFile) {
           var fileReader = new FileReader();
          fileReader.onload = function(event) {
              preview.setAttribute('src', event.target.result);
              hash = sha256(event.target.result);
              // se demora un tiempo en hash
           }
          fileReader.readAsDataURL(selectedFile);

    }
    console.log(App.contracts.contractV);
    const providersAccounts = await web3.eth.getAccounts();
       const defaultAccount = providersAccounts[0];
       try {
        console.log(Nit+"°"+hash)
        await App.contracts.contractV.methods.Creacion_Registro(Nit,hash).send({
          from: defaultAccount,
          data: App.contracts.contractV.methods.Creacion_Registro(Nit,hash).encodeABI()
        });
        $(Chash).text("el Codigo Validador de la empresa es: "+hash);
    } catch (error) {
        console.error(error);
    }
  },
  
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
