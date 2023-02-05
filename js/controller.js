const controller = (function(model, view){

    function setupEventListeners() {
        const DOMStrings = view.getDOMStrings(); 
        document.querySelector(DOMStrings.form).addEventListener('submit', addItem);
        document.querySelector(DOMStrings.inputValue).addEventListener('input', view.checkInputValue);
        document.querySelector(DOMStrings.itemsContainer).addEventListener('click', deleteItem);
    }

    function addItem(event) {
        event.preventDefault();

        const inputData = view.getInputData();

        if (inputData.description !== '' && inputData.value !== 0) {

            const newItem = model.addItem(inputData.type, inputData.description, inputData.value);

            view.addItem(newItem);

        }

        updateBudget();
    }

    function deleteItem(event) {
        if (event.target.closest('[data-delete]')){
            
            const listItem = event.target.closest('.budget-list__item');

            const itemIdObj = view.getItemId(listItem);

            model.deleteItem(itemIdObj.type, itemIdObj.id);

            view.deleteItem(listItem.id);

            updateBudget();
        }

    }

    function updateBudget() {

        model.updateBudget();

        const budgetObj = model.getBudget();

        view.updateBudget(budgetObj);

        updateItemsPercents();
    }

    function updateItemsPercents() {

        model.updateItemsPercents();

        const expenseList = model.getExpenseList();
        view.updateItemsPercents(expenseList);
    }


    return {
        init: function(){
            view.displayDate();
            setupEventListeners();
            model.fillDataFromLocalStorage();
            view.fillPageFromLocalStorage();
            updateBudget();
        }
    }

}(model, view));

controller.init();