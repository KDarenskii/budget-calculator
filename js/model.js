const model = (function(){

    class Expense {
        constructor(type, description, value, id) {
            this.type = type;
            this.description = description;
            this.value = value;
            this.id = id;
            this.percents = -1;
        }
    }
    class Income {
        constructor(type, description, value, id) {
            this.type = type;
            this.description = description;
            this.value = value;
            this.id = id;
        }
    }

    const data = {
        allItems: {
            inc: [],
            exp: []
        },
        budgetInfo: {
            incSum: 0,
            expSum: 0,
            budget: 0,
            expPercents: -1,
        }
    }

    function addItem(type, description, value) {

        const id = generateItemId(type);

        let newItem;

        if (type === 'inc') {
            newItem = new Income(type, description, value, id);
        } else if (type === 'exp'){
            newItem = new Expense(type, description, value, id);
        }

        data.allItems[type].push(newItem);

        saveDataToLocalStorage();

        return newItem;
    }

    function updateItemsPercents() {
        
        if (data.budgetInfo.expSum !== 0 && data.budgetInfo.incSum !== 0) {

            data.allItems['exp'].forEach((expItem) => {

                expItem.percents = parseInt((expItem.value / data.budgetInfo.incSum) * 100);

            });

        } else {

            data.allItems['exp'].forEach((expItem) => {
                expItem.percents = -1;
            });

        }
    }

    function deleteItem(type, id) {

        const itemIndex = data.allItems[type].findIndex((listItem) => listItem.id === id);

        data.allItems[type].splice(itemIndex, 1);

        saveDataToLocalStorage();
    }

    function updateBudget() {

        const incomeSum = calculateSum('inc');
        data.budgetInfo.incSum = incomeSum;
        
        const expenseSum = calculateSum('exp');
        data.budgetInfo.expSum = expenseSum;

        data.budgetInfo.budget = incomeSum - expenseSum;

        if (incomeSum !== 0 && expenseSum !== 0) {
            data.budgetInfo.expPercents = parseInt((expenseSum / incomeSum) * 100);
        } else {
            data.budgetInfo.expPercents = -1;
        }

        saveDataToLocalStorage();
    }

    function getBudget() {
        return data.budgetInfo;
    }

    function getExpenseList() {
        return data.allItems.exp;
    }

    function calculateSum(type) {
        let sum = 0;
        for (let i = 0; i < data.allItems[type].length; i++) {
            sum += data.allItems[type][i].value;
        }
        return sum;
    }

    function generateItemId(type) {

        let id;

        if (data.allItems[type].length > 0) {

            const lastIndex = data.allItems[type].length - 1;

            id = data.allItems[type][lastIndex].id + 1;
            
        } else id = 0;

        return id;

    }

    function saveDataToLocalStorage() {
        localStorage.setItem('data', JSON.stringify(data));
    }

    function fillDataFromLocalStorage() {
        if (localStorage.getItem('data')) {

            const dataFromLocalStorage = JSON.parse(localStorage.getItem('data'));
    
            dataFromLocalStorage.allItems['exp'].forEach(expItem => addItem(expItem.type, expItem.description, expItem.value));
            dataFromLocalStorage.allItems['inc'].forEach(incItem => addItem(incItem.type, incItem.description, incItem.value));

        }
    }

    return {
        addItem,
        deleteItem,
        updateBudget,
        getBudget,
        getExpenseList,
        updateItemsPercents,
        fillDataFromLocalStorage,
    }

}());