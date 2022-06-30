const Modal = {
    modalOverlay: document.querySelector(".modal-overlay"),
    open() {
        // Abrir modal
        // Adicionar a class active ao modal
        Modal.modalOverlay.classList.add("active");
    },
    close(){
        // fechar o modal
        // remover a class active do modal
        Modal.modalOverlay.classList.remove("active");
    }
};

const Storage = {
    //listar dados do localStorage
    //salvar no localStorage
    //preciso adaptar trasaction para o objeto Storage responsavel por manipular LocalStorage
        //adicionar ao localStorage
        //remover do localStorage
    get(){
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || [];
    },
    set(transactions){
        localStorage.setItem("dev.finances:transactions",
        JSON.stringify(transactions));
    }
};

const Transaction = {
    all: Storage.get,
    add(transaction){
        let transactions = [...Storage.get()];
        transactions.push(transaction);
        Storage.set([...transactions]);
        App.reload();
    },
    remove(index){
        let transactions = [...Storage.get()];
        transactions.splice(index,1);
        Storage.set([...transactions]);
        App.reload();
    }
};

// Eu preciso pegar as minhas transações do meu
// ojeto aqui no javascript
//e colocar lá no meu HTML
const DOM = {
    transactionsContainer: document.querySelector("#data-table tbody"),
    addTransaction(transaction, index) {
        const tr = document.createElement('tr');
        tr.innerHTML = DOM.innerHTMLTransaction(transaction,index);
        tr.dataset.index = index;
        DOM.transactionsContainer.appendChild(tr);
    },
    innerHTMLTransaction(transaction,index) {
        const html = `
            <td class="description">${transaction.nomeDoItem}</td>
            <td class="description">${transaction.unidadeDeMedida}</td>
            <td class="description">${transaction.quantidade}</td>
            <td class="description">${transaction.preco}</td>
            <td class="description">${transaction.produtoPerecivel}</td>
            <td class="date">${transaction.dateDeValidade}</td>
            <td class="date">${transaction.dataDeFabricacao}</td>
            <td><img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação"></td>
        `;
        return html;
    },
    clearTransactions(){
        DOM.transactionsContainer.innerHTML = "";
    }
};

const Utils = {
    formatAmount(value){
        value = Number(value) * 100;
        //serve para corrigir um bug quando insiro -1,10 ou -1.1
        value = Number(value.toFixed(2));

        return value;
    },
    formatDate(date){
        const splittedDate = date.split("-");
        return splittedDate[2]+"/"+splittedDate[1]+"/"+splittedDate[0];
    },
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-": "";
        value = String(value).replace(/\D/g,"");
        value = Number(value)/100;
        value = value.toLocaleString("pt-BR",{
            style: "currency",
            currency: "BRL"
        });
        return signal +" "+ value;
    }
};

const Form = {
    "nome-do-item": document.querySelector("input#nome-do-item"),
    "unidade-de-medida": document.querySelector("select#unidade-de-medida"),
    "quantidade": document.querySelector("input#quantidade"),
    "preco": document.querySelector("input#preco"),
    "produto-perecivel": document.querySelector("input#produto-perecivel"),
    "data-de-validade": document.querySelector("input#data-de-validade"),
    "data-de-fabricacao": document.querySelector("input#data-de-fabricacao"),
    getValues(){
        return {
            nomeDoItem: Form["nome-do-item"].value,
            unidadeDeMedida: Form["unidade-de-medida"].value,
            quantidade: Form["quantidade"].value,
            preco: Form["preco"].value,
            produtoPerecivel: Form["produto-perecivel"].checked,
            dateDeValidade: Form["data-de-validade"].value,
            dataDeFabricacao: Form["data-de-fabricacao"].value
        }
    },
    validateField(){
        const {
            nomeDoItem,
            UnidadeDeMedida,
            quantidade,
            preco,
            produtoPerecivel,
            dateDeValidade,
            dataDeFabricacao,
        } = Form.getValues();
        
        if( 
            false
        ) {
            throw new Error("Por favor, preencha os campos corretamente.");
        }
    },
    formatValues(){
        let {
            nomeDoItem,
            unidadeDeMedida,
            quantidade,
            preco,
            produtoPerecivel,
            dateDeValidade,
            dataDeFabricacao,
        } = Form.getValues();
        quantidade = Utils.formatAmount(quantidade);
        preco = Utils.formatCurrency(preco);
        dateDeValidade = Utils.formatDate(dateDeValidade);
        dataDeFabricacao = Utils.formatDate(dataDeFabricacao);
        return {
            nomeDoItem,
            unidadeDeMedida,
            quantidade,
            preco,
            produtoPerecivel: produtoPerecivel ? "Sim" : "Não",
            dateDeValidade,
            dataDeFabricacao,
        }
    },
    clearField(){
        [
            "nome-do-item",
            "unidade-de-medida",
            "quantidade",
            "preco",
            "produto-perecivel",
            "data-de-validade",
            "data-de-fabricacao"
        ]
            .forEach((input)=>Form[input].value = "");
    },
    submit(event) {
        // cancela o comportamento padrão do evento no navegador
        event.preventDefault(); 
        
        try{
            Form.validateField();
            const transaction = Form.formatValues();
            console.log(transaction)
            Transaction.add(transaction);
            Form.clearField();
            Modal.close();

        }catch(error){
            // alert(error.message);
            console.log(error)
        }
    }
}

const App = {
    init(){
        Transaction.all().forEach(DOM.addTransaction);
    },
    reload(){
        DOM.clearTransactions();
        App.init();
    }
};

App.init();


