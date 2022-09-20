const calculator = document.querySelector('.calculator');
let history = [];
let tempNumber = '';
let operationType = '';
let isPercent = false;
let isEqual = false;


calculator.addEventListener('click', (event) => {
    const target = event.target;
    if (target.classList.contains('calcalculator__col')) {
        const data = target.dataset.type
        
        operationTypeHandling(data)
        renderTotal(tempNumber)
        renderHistory(history)
    }
})


// keyboard processing on the calculator
function operationTypeHandling(data) {
    if (data >= 0) {
        operationType = 'number'
        tempNumber = tempNumber === '0' ? data : tempNumber + data
    } else if (data === 'float') {
        operationType = 'number'
        if (!/\./.test(tempNumber)) {
            if (tempNumber) {
                tempNumber += '.'
            } else {
                tempNumber = '0.'
            }
        } 
    } else if (data === 'delete' && operationType === 'number') {
        tempNumber = tempNumber.substring(0, tempNumber.length - 1)
        tempNumber = tempNumber ? tempNumber : '0'
        isPercent = false
    } else if (['+', '-', '/', '*'].includes(data) && tempNumber) {
        operationType = data
        history.push(tempNumber, operationType)
        tempNumber = ''
    } else if (data === 'clear') {
        history = []
        tempNumber = '0'
        isPercent = false
    } else if (data === 'history') {
        console.log('history');
        openHistoryPanel()
    } else if (data === '%') {
        history.push(tempNumber)
        isPercent = true
        isEqual = false
        tempNumber = calculate(history, isPercent, isEqual)
    } else if (data === '=') {
        if (!isPercent) {
            history.push(tempNumber)
        }
        isEqual = true
        tempNumber = calculate(history, isPercent, isEqual)
        history = []
        isPercent = false
    }
}

// display values on the screen
function renderTotal(value) {
    const totalBlock = calculator.querySelector('.calcalculator__total')
    totalBlock.innerHTML = value
}


// this is the formation of html and the display of operations
function renderHistory(historyArray) {
    const historyBlock = calculator.querySelector('.calcalculator__history')
    let htmlElements = ''
        historyArray.forEach(item => {
            if (item >= 0) {
                htmlElements += `&nbsp;<span>${item}</span>`
            } else if (['+', '-', '/', '*', '%'].includes(item)) {
                item = item === '*' 
                ? '×' 
                : item === '/'
                ? '÷'
                : item
                htmlElements += `&nbsp;<strong>${item}</strong>`
            }
        })
        historyBlock.innerHTML = htmlElements
}


// values calculate
function calculate(historyArray, isPercent, isEqual) {
    let total = 0
    historyArray.forEach( (item, idx) => {
        item = parseFloat(item)
        if (idx === 0) {
            total = item
        } else if (idx - 2 >= 0 && isPercent && idx - 2 === historyArray.length - 3) {
                const x = total
                const operation = historyArray[idx - 1]
                const n = item
            if (!isEqual) {
                total = calculatePercent(x, operation, n)
            } else {
                total = calculatePercentWhenPushEqual(x, operation, n)
            }
        } else if (idx - 2 >= 0) {
            const prevItem = historyArray[idx - 1]
            if (item >= 0) {
                if (prevItem === '+') {
                    total += item
                } else if (prevItem === '-') {
                    total -= item
                } else if (prevItem === '*') {
                    total *= item
                } else if (prevItem === '/') {
                    total /= item
                } else if (prevItem === '%') {
                    total = total / 100 * item
                }
            }
        }  
    })
    return String(total)
}

// percent calc

function calculatePercent(x, operation, n) {
    let total
    if (['+', '-'].includes(operation)) {
        total = x * (n / 100)
    } else if (['*', '/'].includes(operation)) {
        total = n / 100
    } 
    return total
}


function calculatePercentWhenPushEqual(x, operation, n) {
    let total = 0 

    if (operation === '+') {
        total = x + (n / 100 * x)
    } else if (operation === '-') {
        total = x - (n / 100 * x)
    } else if (operation === '*') {
        total = x * (n / 100)
    } else if (operation === '/') {
        total =  (n / 100)
    }
    return total
}

// ligth and dark theme

const theme = document.querySelector('.theme');
theme.onclick = () => {
    if (theme.classList.contains('theme_dark')) {
        theme.classList.remove('theme_dark')
        calculator.classList.add('calculator_dark')
    } else {
        theme.classList.add('theme_dark')
        calculator.classList.remove('calculator_dark')
    }
}

