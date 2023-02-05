const view = (function(){

    const DOMStrings = {
        form: "#budget-form",
        inputType: "#input__type",
        inputDescription: "#input__description",
        inputValue: "#input__value",
        formBtn: "#submit-btn",
        incomeList: '#income__list',
        expensesList: '#expenses__list',
        itemsContainer: '#items-container',
        budgetLabel: '#budget-value',
        incomeLabel: '#income-value',
        expenseLabel: '#expense-value',
        expensePercentsLabel: '#expense-percents',
        itemPercentsLabel: '#item-percents',
        monthLabel: '#month',
        yearLabel: '#year',
    }

    function displayDate() {
        const date = new Date();

        const monthIndex = date.getMonth();
        const year = date.getFullYear();

        const monthsList = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];

        document.querySelector(DOMStrings.monthLabel).innerText = monthsList[monthIndex];
        document.querySelector(DOMStrings.yearLabel).innerText = year;

    }

    function getDOMStrings() {
        return DOMStrings;
    }

    function getInputData() {
        return {
            type: document.querySelector(DOMStrings.inputType).value,
            description: document.querySelector(DOMStrings.inputDescription).value,
            value: +document.querySelector(DOMStrings.inputValue).value,
        }
    }

    function checkInputValue() {

        const input = document.querySelector(DOMStrings.inputValue);

        if (input.value.indexOf(".") != '-1') {
            input.value = input.value.substring(0, input.value.indexOf(".") + 3);
        }

    }

    function getItemId(listItem) {

        const itemId = listItem.id.split('-');

        return  {
            type: itemId[0],
            id: +itemId[1]
        }
    }

    function addItem(itemObj) {
        
        let newItemHTML;

        if (itemObj.type === 'inc') {

            newItemHTML = `<li id="inc-${itemObj.id}" class="budget-list__item item item--income">
                                <div class="item__title">${itemObj.description}</div>
                                <div class="item__right">
                                    <div class="item__amount">${formatNumber(itemObj.value, 'inc')}</div>
                                    <button class="item__remove" data-delete>
                                        <img
                                            src="./img/circle-green.svg"
                                            alt="delete"
                                        />
                                    </button>
                                </div>
                            </li>`;

            document.querySelector(DOMStrings.incomeList).insertAdjacentHTML('afterbegin', newItemHTML);

        } else if (itemObj.type === 'exp'){

            newItemHTML = `<li id="exp-${itemObj.id}" class="budget-list__item item item--expense">
                                <div class="item__title">${itemObj.description}</div>
                                <div class="item__right">
                                    <div class="item__amount">
                                        ${formatNumber(itemObj.value, 'exp')}
                                        <div class="item__badge">
                                            <div id="item-percents" class="badge badge--dark">
                                                15%
                                            </div>
                                        </div>
                                    </div>
                                    <button class="item__remove" data-delete>
                                        <img src="./img/circle-red.svg" alt="delete" />
                                    </button>
                                </div>
                            </li>`;

            document.querySelector(DOMStrings.expensesList).insertAdjacentHTML('afterbegin', newItemHTML);
        }

        document.querySelector(DOMStrings.inputDescription).value = '';
        document.querySelector(DOMStrings.inputDescription).focus();
        document.querySelector(DOMStrings.inputValue).value = '';

    }

    function deleteItem(itemIdString) {
        document.querySelector(`#${itemIdString}`).remove();
    }

    function updateBudget(budgetObj) {

        document.querySelector('#income-value').innerText = formatNumber(budgetObj.incSum, 'inc');
        document.querySelector('#expense-value').innerText = formatNumber(budgetObj.expSum, 'exp');

        if (budgetObj.budget >= 0) {
            document.querySelector('#budget-value').innerText = formatNumber(budgetObj.budget, 'inc');
        } else if (budgetObj.budget < 0) {
            document.querySelector('#budget-value').innerText = formatNumber(budgetObj.budget, 'exp');
        }
        if (budgetObj.expPercents !== -1) {
            document.querySelector('#expense-percents').style.visibility = 'visible';
            document.querySelector('#expense-percents').innerText = budgetObj.expPercents + "%";
        } else {
            document.querySelector('#expense-percents').style.visibility = 'hidden';
        }

    }

    function updateItemsPercents(expenseList) {

        expenseList.forEach((expItem) => {

            const listItem = document.querySelector(`#exp-${expItem.id}`);

            if (expItem.percents !== -1){

                listItem.querySelector('.item__badge').style.display = 'block';
                listItem.querySelector(DOMStrings.itemPercentsLabel).innerText = expItem.percents + '%';

            } else listItem.querySelector('.item__badge').style.display = 'none';
        })

    }

    function fillPageFromLocalStorage() {
        if (localStorage.getItem('data')) {

            const dataFromLocalStorage = JSON.parse(localStorage.getItem('data'));
    
            dataFromLocalStorage.allItems['exp'].forEach(expItem => addItem(expItem));
            dataFromLocalStorage.allItems['inc'].forEach(incItem => addItem(incItem));

        }
    }

    function formatNumber(number, type) {

        if (number === 0) return number.toFixed(2);

        number = Math.abs(number).toFixed(2);

        const numSplit = number.split('.');

        const intPart = numSplit[0];
        const decimalPart = numSplit[1];

        let numString = intPart.toString();
        let newNum = '';
        
        let counter = 0;

        for (let i = numString.length - 1; i >= 0; i--){
            if (counter === 3) {
                newNum = ' ' + newNum;
                counter = 0;
            }
            newNum = numString[i] + newNum;
            counter++;
        }

        newNum += '.' + decimalPart;

        return (type === 'inc') ? '+ ' + newNum : '- ' + newNum;
    }

    return {
        getDOMStrings,
        getInputData,
        getItemId,
        addItem,
        deleteItem,
        updateBudget,
        updateItemsPercents,
        fillPageFromLocalStorage,
        formatNumber,
        checkInputValue,
        displayDate,
    }

}());