'use strict';

const displayNumber = document.getElementById('displayNumber');
const buttons = document.querySelectorAll('[id*=btn]');
const operator = document.querySelectorAll('[id*=operator]');
const displayTime = document.getElementById('displayTime');
const displayDate = document.getElementById('displayDate');

let newNumber = true; 
let operation;  
let lastNumber;

function getCurrentDateTime() {

    const currentDateTime = new Date();
    const date = currentDateTime.toLocaleDateString();
    const time = currentDateTime.toLocaleTimeString();
    return {date, time};
}

function setDateTimeToDisplay() {

    const {date, time} = getCurrentDateTime();
    displayTime.textContent = time;
    displayDate.textContent = date;
}
window.onload = setDateTimeToDisplay;
setInterval(setDateTimeToDisplay, 1000);

const updateDisplay = (texto) => {

    if (newNumber) {

        displayNumber.textContent = texto.toLocaleString('BR');  
        newNumber = false;

    } else {

        // BR para o caso das vírgulas.
        displayNumber.textContent += texto.toLocaleString('BR');
    }
}
  
const insertNumber = (evento) => {

    updateDisplay(evento.target.textContent);

}
buttons.forEach(buttons => buttons.addEventListener('click', insertNumber)); 



const pendingOperation = () => operation !== undefined;

const calc = () => {
    if (pendingOperation()) {
        
        const currentNumber = parseFloat(displayNumber.textContent.replace(',','.'));
        newNumber = true;

        // Eval faz os cálculos
        const resultado = eval (`${lastNumber}${operation}${currentNumber}`);
        updateDisplay(resultado);

        /* ANTIGO
        if (operation == '+') {
            updateDisplay(lastNumber + currentNumber);
        } else if (operation == '-') {
            updateDisplay(lastNumber - currentNumber);
        } else if (operation == '*') {
            updateDisplay(lastNumber * currentNumber);
        } else if (operation == '/') {
            updateDisplay(lastNumber / currentNumber);
        }
        */
    }
}

const selectOperator = (evento) => {
    if (!newNumber) { // se NÃO for novo operador -> vai calcular().
        calc();
        newNumber = true; // após o cálculo e o clique em um operador -> torna-se um novo número.
        operation = evento.target.textContent; // captura o operador clicado.
        lastNumber = parseFloat(displayNumber.textContent.replace(',','.')); // captura o último n° que está no display.
    }
}
operator.forEach(operator => operator.addEventListener('click', selectOperator));

// IGUAL
const calcEqual = () => {

    calc();
    operation = undefined;

}
document.getElementById('equal').addEventListener('click', calcEqual);

// Apagar última operação
const deleteFunction = () => {

    displayNumber.textContent = '0';

}
document.getElementById('delete').addEventListener('click', deleteFunction);

// Apagar display
const deleteAll = () => {

    deleteFunction();
    operation = undefined;
    newNumber = true;
    lastNumber = undefined;

}
document.getElementById('deleteAll').addEventListener('click', deleteAll);

// Porcentagem
const calcPercent = (value) => {

    value = parseFloat(displayNumber.textContent); 
    var percent = parseFloat(value) / 100;
    
    displayNumber.textContent = percent;  
}
document.getElementById('operatorPercent').addEventListener('click', calcPercent)
 
// Backspace
const removeLastNumber = () => {

    displayNumber.textContent = displayNumber.textContent.slice(0, -1);

} 
document.getElementById('backspace').addEventListener('click', removeLastNumber);

// Vírgula
const existeDecimal = () => displayNumber.textContent.indexOf(',') !== -1;
const existeValor = () => displayNumber.textContent.length > 0;

const decimal = () => {

    if (!existeDecimal()) {

        if (existeValor()) {
            updateDisplay(',');
        } else {
            updateDisplay('0,');
        }
    }
}
document.getElementById('decimal').addEventListener('click', decimal);

// Inverter sinal
const invertSign = () => {

    newNumber = true;
    updateDisplay(displayNumber.textContent * -1);
}
document.getElementById('invertSign').addEventListener('click', invertSign);

// Mapear teclado
const mapKeyBoard = {

    'c'         : 'deleteAll',
    'space'     : 'delete',                
    'Backspace' : 'backspace',     
    '7'         : 'btnSeven',      
    '8'         : 'btnEight',              
    '9'         : 'btnNine',   
    '*'         : 'operatorMultiplication',
    '4'         : 'btnFour',
    '5'         : 'btnFive',               
    '6'         : 'btnSix',      
    '-'         : 'operatorSubtraction',
    '1'         : 'btnOne',                
    '2'         : 'btnTwo',                
    '3'         : 'btnThree',              
    '+'         : 'operatorSum',
    '0'         : 'btnZero',               
    ','         : 'decimal',         
    '/'         : 'operatorDivision',      
    '='         : 'equal',
    'Enter'     : 'equal' 
}

const mapKey = (evento) => {

    const tecla = evento.key;
    const teclaPermitida = () => Object.keys(mapKeyBoard).indexOf(tecla) !== -1;
    if (teclaPermitida()) document.getElementById(mapKeyBoard[tecla]).click();

}
document.addEventListener('keydown', mapKey);