import {getbeneficiaries ,finduserbyaccount,findbeneficiarieByid,getCardsByUserId,findCardByNumber} from "../models/database.js";
const user = JSON.parse(sessionStorage.getItem("currentUser"));
// DOM elements
const greetingName = document.getElementById("greetingName");
const currentDate = document.getElementById("currentDate");
const solde = document.getElementById("availableBalance");
const incomeElement = document.getElementById("monthlyIncome");
const expensesElement = document.getElementById("monthlyExpenses");
const activecards = document.getElementById("activeCards");
const transactionsList = document.getElementById("recentTransactionsList");
const transferBtn = document.getElementById("quickTransfer");
const transferSection = document.getElementById("transfer-section");
const closeTransferBtn = document.getElementById("closeTransferBtn");
const cancelTransferBtn = document.getElementById("cancelTransferBtn");
const beneficiarySelect = document.getElementById("beneficiary");
const sourceCard = document.getElementById("sourceCard");
const submitTransferBtn=document.getElementById("submitTransferBtn");

// Guard
if (!user) {
  alert("User not authenticated");
  window.location.href = "/index.html";
}



// Retrieve dashboard data
const getDashboardData = () => {
  const monthlyIncome = user.wallet.transactions
    .filter(t => t.type === "credit")
    .reduce((total, t) => total + t.amount, 0);

  const monthlyExpenses = user.wallet.transactions
    .filter(t => t.type === "debit")
    .reduce((total, t) => total + t.amount, 0);

  return {
    userName: user.name,
    currentDate: new Date().toLocaleDateString("fr-FR"),
    availableBalance: `${user.wallet.balance} ${user.wallet.currency}`,
    activeCards: user.wallet.cards.length,
    monthlyIncome: `${monthlyIncome} MAD`,
    monthlyExpenses: `${monthlyExpenses} MAD`,
  };
};

function renderDashboard(){
const dashboardData = getDashboardData();
if (dashboardData) {
  greetingName.textContent = dashboardData.userName;
  currentDate.textContent = dashboardData.currentDate;
  solde.textContent = dashboardData.availableBalance;
  incomeElement.textContent = dashboardData.monthlyIncome;
  expensesElement.textContent = dashboardData.monthlyExpenses;
  activecards.textContent = dashboardData.activeCards;
}
// Display transactions
transactionsList.innerHTML = "";
user.wallet.transactions.forEach(transaction => {
  const transactionItem = document.createElement("div");
  transactionItem.className = "transaction-item";
  transactionItem.innerHTML = `
    <div>${transaction.date}</div>
    <div>${transaction.amount} MAD</div>
    <div>${transaction.type}</div>
  `;
  transactionsList.appendChild(transactionItem);
});

}
renderDashboard();

// Transfer popup
function closeTransfer() {
    transferSection.classList.add("hidden"); 
  transferSection.classList.remove("active");
  document.body.classList.remove("popup-open");
}

function handleTransfersection() {
    transferSection.classList.remove("hidden");
  transferSection.classList.add("active");
  document.body.classList.add("popup-open");
}

// Beneficiaries
const beneficiaries = getbeneficiaries(user.id);

function renderBeneficiaries() {
  beneficiaries.forEach((beneficiary) => {
    const option = document.createElement("option");
    option.value = beneficiary.id;
    option.textContent = beneficiary.name;
    beneficiarySelect.appendChild(option);
  });
}
renderBeneficiaries();
function renderCards() {
  user.wallet.cards.forEach((card) => {
    const option = document.createElement("option");
    option.value = card.numcards;
    option.textContent = card.type+"****"+card.numcards;
    sourceCard.appendChild(option);
  });
}

renderCards();

//###################################  Transfer  #####################################################//

// check function 

/* function checkUser(numcompte, callback) {
  setTimeout(() => {
    const destinataire = finduserbyaccount(numcompte);
    if (destinataire) {
      callback(destinataire);
    } else {
      console.log("Destinataire non trouvé");
    }
  }, 500);
}

function checkSolde(exp, amount, callback) {
  setTimeout(() => {
    const solde = exp.wallet.balance;
    if (solde >= amount) {
      callback("Solde suffisant");
    } else {
      callback("Solde insuffisant");
    }
  }, 400);
}

function updateSolde(exp, destinataire, amount, callback) {
  setTimeout(() => {  
    exp.wallet.balance -= amount;
    destinataire.wallet.balance += amount;
    callback("Solde mis à jour");
  }, 300);
}


function addtransactions(exp, destinataire, amount, callback) {
  setTimeout(() => { 
    // Transaction pour l'expéditeur (débit)
    const transactionDebit = {
      id: Date.now(),
      type: "debit",
      amount: amount,
      from: exp.name,
      to: destinataire.name,
      date: new Date().toLocaleDateString()
    };

    // Transaction pour le destinataire (crédit)
    const transactionCredit = {
      id: Date.now() + 1,
      type: "credit",
      amount: amount,
      from: exp.name,
      to: destinataire.name,
      date: new Date().toLocaleDateString()
    };

    user.wallet.transactions.push(transactionDebit);
    destinataire.wallet.transactions.push(transactionCredit);
    renderDashboard();
    callback("Transaction enregistrée");
  }, 200);
}


export function transferer(exp, numcompte, amount) {
  console.log("\n DÉBUT DU TRANSFERT ");

  // Étape 1: Vérifier le destinataire
  checkUser(numcompte, function afterCheckUser(destinataire) {
    console.log("Étape 1: Destinataire trouvé -", destinataire.name);

    // Étape 2: Vérifier le solde
    checkSolde(exp, amount, function afterCheckSolde(soldemessage) {
      console.log(" Étape 2:", soldemessage);

      if (soldemessage.includes("Solde suffisant")) {
        // Étape 3: Mettre à jour les soldes
        updateSolde(exp, destinataire, amount, function afterUpdateSolde(updatemessage) {
          console.log(" Étape 3:", updatemessage);

          // Étape 4: Enregistrer la transaction
          addtransactions(exp, destinataire, amount, function afterAddTransactions(transactionMessage) {
            console.log(" Étape 4:", transactionMessage);
            console.log(`Transfert de ${amount} réussi!`);
          });
        });
      }
    });
  });
}


function handleTransfer(e) {
 e.preventDefault();
  const beneficiaryId = document.getElementById("beneficiary").value;
  const beneficiaryAccount=findbeneficiarieByid(user.id,beneficiaryId).account;
  const sourceCard = document.getElementById("sourceCard").value;

  const amount = Number(document.getElementById("amount").value);

  
  transferer(user, beneficiaryAccount, amount);

} */

function checkUser(numcompte){
     return new Promise((resolve,reject)=>{
        setTimeout(()=>{
            const beneficiary=finduserbyaccount(numcompte);
            if(beneficiary){
                resolve(beneficiary);
            }
            else{
                reject("beneficiary not found");
            }
     },2000);
     });
}


function checkSolde(expediteur,amount){
  return new Promise((resolve,reject)=>{
    setTimeout(()=>{
      if(expediteur.wallet.balance>amount){
        resolve("Sufficient balance");
      }else{
        reject("Insufficient balance");
      }
    },3000);
  });
}

function updateSolde(expediteur,destinataire,amount){
    return new Promise((resolve)=>{
        setTimeout(()=>{
            expediteur.wallet.balance-=amount;
            destinataire.wallet.balance+=amount;
            resolve("update balance done");
        },200);
    });
}

function addtransactions(expediteur,destinataire,amount){
    return new Promise((resolve)=>{
        setTimeout(()=>{
        // create credit transaction
    const credit={
        id:Date.now(),
        type:"credit",
        amount: amount,
        date: Date.now().toLocaleString(),
        from: expediteur.name
    }
    //create debit transaction
    const debit={
        id:Date.now(),
        type:"debit",
        amount: amount,
        date: Date.now().toLocaleString(),
        to: destinataire.name, 
    }
    expediteur.wallet.transactions.push(debit);
    destinataire.wallet.transactions.push(credit);
   resolve("transaction added successfully");
   },3000)
    });
   
}

// **************************************transfer***************************************************//

function transfer(expediteur, numcompte, amount){
    checkUser(numcompte) //p0
    .then((destinataire) => { //p1
        return checkSolde(expediteur, amount) //p2
            .then(() => destinataire); //je renvoie la destinataire pour la suite de traitement
    }).then((destinataire) => {
        return updateSolde(expediteur, destinataire, amount)
            .then(() => destinataire);
    }).then((destinataire) => {
        return addtransactions(expediteur, destinataire, amount);
    }).then((message) => {
        // sauvegarder les données
        sessionStorage.setItem("currentUser", JSON.stringify(expediteur));
        // refresh dashboard
        renderDashboard();
        // fermer popup (optionnel)
        closeTransfer();
        alert("Transfert réussi !");
    }).catch((error) => {
        alert(error);
    });
}


function handleTransfer(e) {
 e.preventDefault();
  const beneficiaryId = document.getElementById("beneficiary").value;
  const beneficiaryAccount=findbeneficiarieByid(user.id,beneficiaryId).account;
  const sourceCard = document.getElementById("sourceCard").value;

  const amount = Number(document.getElementById("amount").value);
  

  transfer(user, beneficiaryAccount, amount);

} 

// Events
  transferBtn.addEventListener("click", handleTransfersection);
  closeTransferBtn.addEventListener("click", closeTransfer);
  cancelTransferBtn.addEventListener("click", closeTransfer);
  submitTransferBtn.addEventListener("click",handleTransfer)


  //=========== tp1 partie recharger ==========================================
  /*function afficherFormulaireRecharge(user){
    const mesCartes=getCardsByUserId(user);
    const sectionForm=document.createElement("div");
    sectionForm.id="formulaireRecharger";
    sectionForm.innerHTML=`
      <div class="section-Recharge">
        <h2>Recharger mon compte </h2>
        <label>Choisir une carte</label>
        <select id="select-card">

        </select>
        <label>Entrer le montant (MAD)</label>
        <input type="number" placeholder="exemple:500" id="montantRecharge">
        <button id="submitRecharge">Valider</button>
        <button id="cancelRecharge">Annuler</button>
      </div>
    `;
    const selectCard=sectionForm.querySelector("#")
  }


//fonction pour remplir le select
function renderRechargeCards() {
    const mesCartes = getCardsByUserId(user.id);
    paymentCardSelect.innerHTML = '<option value="" disabled selected>Sélectionner une carte</option>';
    mesCartes.forEach(card => {
        const option = document.createElement("option");
        option.value = card.numcards; 
        option.textContent = `${card.type.toUpperCase()} (**** ${card.numcards.slice(-4)}) - Solde: ${card.balance} MAD`;
        paymentCardSelect.appendChild(option);
    });
}


function openRechargePopup() {
    rechargePopup.classList.remove("hidden");
    rechargePopup.classList.add("active"); 
    document.body.classList.add("popup-open");
    renderRechargeCards();
}

function closeRechargePopup() {
    rechargePopup.classList.add("hidden");
    rechargePopup.classList.remove("active");
    document.body.classList.remove("popup-open");
}


// Événements pour la Recharge
quickTopupBtn.addEventListener("click", openRechargePopup);
closeRechargeBtn.addEventListener("click", closeRechargePopup);
cancelRechargeBtn.addEventListener("click", closeRechargePopup);

*/




const openRechargeBtn = document.getElementById("quickTopup"); 
const rechargePopup = document.getElementById("rechargePopup");
const closeRechargeBtn = document.getElementById("closeRechargeBtn");
const cancelRechargeBtn = document.getElementById("cancelRechargeBtn");
const rechargeForm = document.getElementById("rechargeForm");
const paymentCardSelect = document.getElementById("paymentCard");
const rechargeAmountInput = document.getElementById("rechargeAmount");

//fonction pour remplir le select
function renderRechargeCards() {
    const mesCartes = getCardsByUserId(user.id);
    paymentCardSelect.innerHTML = '<option value="" disabled selected>Sélectionner une carte</option>';
    mesCartes.forEach(card => {
        const option = document.createElement("option");
        option.value = card.numcards; 
        option.textContent = `${card.type.toUpperCase()} (**** ${card.numcards.slice(-4)}) - Solde: ${card.balance} MAD`;
        paymentCardSelect.appendChild(option);
    });
}


function closeRecharge() {
    rechargePopup.classList.add("hidden"); 
    rechargePopup.classList.remove("active");  
    document.body.classList.remove("popup-open"); 
    rechargeForm.reset();
}


function handleRechargeSection() {
    rechargePopup.classList.remove("hidden"); 
    rechargePopup.classList.add("active"); 
    document.body.classList.add("popup-open"); 
    renderRechargeCards(); 
}


function handleRecharge(e) {
    e.preventDefault(); 
    const cardNum = paymentCardSelect.value;
    const amount = Number(rechargeAmountInput.value);
    if (!cardNum) {
        alert("Veuillez sélectionner une carte.");
        return;
    }
    if (amount <= 0 || isNaN(amount)) {
        alert("Veuillez entrer un montant valide.");
        return;
    }
    const selectedCard = findCardByNumber(user.id, cardNum);
    if (!selectedCard) {
        alert("Carte introuvable.");
        return;
    }
    if (selectedCard.balance < amount) {
        alert("Solde insuffisant sur cette carte.");
        return;
    }
    selectedCard.balance -= amount; 
    user.wallet.balance += amount;  

    const transactionRecharge = {
        id: Date.now().toString(),
        type: "credit", 
        amount: amount,
        date: new Date().toLocaleDateString("fr-FR"),
        from: `Carte ${selectedCard.type.toUpperCase()}`,
        to: "Mon Portefeuille"
    };
    user.wallet.transactions.push(transactionRecharge);
    sessionStorage.setItem("currentUser", JSON.stringify(user));
    renderDashboard();
    closeRecharge();
    alert(`Succès ! Votre compte a été rechargé de ${amount} MAD.`);
}


openRechargeBtn.addEventListener("click", handleRechargeSection);
closeRechargeBtn.addEventListener("click", closeRecharge);
cancelRechargeBtn.addEventListener("click", closeRecharge);

