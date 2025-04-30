document.addEventListener('DOMContentLoaded', () => {
    // DOM Elements
    const previousOperandElement = document.getElementById('previous-operand');
    const currentOperandElement = document.getElementById('current-operand');
    const numberButtons = document.querySelectorAll('[data-number]');
    const operatorButtons = document.querySelectorAll('[data-action]');
    
    // Calculator states
    let currentOperand = '0';
    let previousOperand = '';
    let operation = undefined;
    let shouldResetScreen = false;
    
    // Screen update
    function updateDisplay() {
        currentOperandElement.textContent = formatDisplayNumber(currentOperand);
        
        if (operation != null) {
            previousOperandElement.textContent = `${formatDisplayNumber(previousOperand)} ${operation}`;
        } else {
            previousOperandElement.textContent = '';
        }
    }
    
    // Format numbers to display
    function formatDisplayNumber(number) {
        if (number === '') return '';
        
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        
        let integerDisplay;
        
        if (isNaN(integerDigits)) {
            integerDisplay = '';
        } else {
            integerDisplay = integerDigits.toLocaleString('es', { 
                maximumFractionDigits: 0 
            });
        }
        
        if (decimalDigits != null) {
            return `${integerDisplay}.${decimalDigits}`;
        } else {
            return integerDisplay;
        }
    }
    
    // Add digit number to the screen
    function appendNumber(number) {
        if (shouldResetScreen) {
            currentOperand = '';
            shouldResetScreen = false;
        }
        
        if (number === '.' && currentOperand.includes('.')) return;
        if (currentOperand === '0' && number !== '.') {
            currentOperand = number;
        } else {
            currentOperand += number;
        }
        
        updateDisplay();
    }
    
    // Select operation
    function chooseOperation(op) {
        if (currentOperand === '') return;
        
        if (previousOperand !== '') {
            calculate();
        }
        
        operation = op;
        previousOperand = currentOperand;
        currentOperand = '';
        updateDisplay();
    }
    
    // Calculate
    function calculate() {
        let computation;
        const prev = parseFloat(previousOperand);
        const current = parseFloat(currentOperand);
        
        if (isNaN(prev) || isNaN(current)) return;
        
        switch (operation) {
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case 'x':
                computation = prev * current;
                break;
            case '÷':
                if (current === 0) {
                    alert('Error: No se puede dividir por cero');
                    clear();
                    return;
                }
                computation = prev / current;
                break;
            default:
                return;
        }
        
        currentOperand = computation.toString();
        operation = undefined;
        previousOperand = '';
        shouldResetScreen = true;
        updateDisplay();
    }
    
    // Clear
    function clear() {
        currentOperand = '0';
        previousOperand = '';
        operation = undefined;
        updateDisplay();
    }
    
    // Delete last digit
    function deleteDigit() {
        if (currentOperand.length === 1) {
            currentOperand = '0';
        } else {
            currentOperand = currentOperand.slice(0, -1);
        }
        updateDisplay();
    }
    
    
    // Event listeners
    numberButtons.forEach(button => {
        button.addEventListener('click', () => {
            addButtonClickEffect(button);
            appendNumber(button.getAttribute('data-number'));
        });
    });
    
    operatorButtons.forEach(button => {
        button.addEventListener('click', () => {
            addButtonClickEffect(button);
            const action = button.getAttribute('data-action');
            
            switch (action) {
                case 'add':
                    chooseOperation('+');
                    break;
                case 'subtract':
                    chooseOperation('-');
                    break;
                case 'multiply':
                    chooseOperation('x');
                    break;
                case 'divide':
                    chooseOperation('÷');
                    break;
                case 'calculate':
                    calculate();
                    break;
                case 'clear':
                    clear();
                    break;
                case 'delete':
                    deleteDigit();
                    break;
            }
        });
    });
    
    // Visual effect to button clicked
    function addButtonClickEffect(button) {
        button.classList.add('btn-active');
        setTimeout(() => {
            button.classList.remove('btn-active');
        }, 100);
    }
    
    // Keyboard
    document.addEventListener('keydown', (event) => {
        const key = event.key;
        
        if (/\d/.test(key)) {
            appendNumber(key);
            highlightButton(`[data-number="${key}"]`);
        } else if (key === '.') {
            appendNumber(key);
            highlightButton(`[data-number="."]`);
        } else if (key === '+') {
            chooseOperation('+');
            highlightButton('[data-action="add"]');
        } else if (key === '-') {
            chooseOperation('-');
            highlightButton('[data-action="subtract"]');
        } else if (key === '*') {
            chooseOperation('x');
            highlightButton('[data-action="multiply"]');
        } else if (key === '/') {
            event.preventDefault();
            chooseOperation('÷');
            highlightButton('[data-action="divide"]');
        } else if (key === 'Enter' || key === '=') {
            event.preventDefault();
            calculate();
            highlightButton('[data-action="calculate"]');
        } else if (key === 'Escape') {
            clear();
            highlightButton('[data-action="clear"]');
        } else if (key === 'Backspace') {
            deleteDigit();
            highlightButton('[data-action="delete"]');
        }
    });
    
    // Highlight button
    function highlightButton(selector) {
        const button = document.querySelector(selector);
        if (button) {
            addButtonClickEffect(button);
        }
    }
    
    // Init Calculator
    updateDisplay();
});