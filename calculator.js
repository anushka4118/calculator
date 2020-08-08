function add (a, b) {
	return +(Math.round((a+b) + "e+7") + "e-7");
}

function subtract(a, b) {
	return +(Math.round((a-b) + "e+7") + "e-7");
}

function multiply(a,b) {
	return +(Math.round((a*b) + "e+7") + "e-7");
}

function divide(a, b) { 
	if (b == 0) {
		return undefined
	} else {
		return +(Math.round((a/b) + "e+7") + "e-7");
	}
}

function operate(operator, a, b) {
    return operator(a, b);
}

let functionLibrary = {
	'+': add,
	'-': subtract,
	'×': multiply,
	'÷': divide
}

let logicManager = {
	hasValue: false,
	calculatedValue: 0,
	currentOperator: (a, b) => this.calculatedValue,

	takeInitialValue: function (value) {
		this.hasValue = true;
		this.calculatedValue = value;
	},

	// Must pass a funtion that takes two arguments
	takeOperator: function (operator) {
		this.currentOperator = operator;
	},

	clearOperator: function (operator) {
		this.currentOperator = (a, b) => this.calculatedValue;
	},

	takeNextValue: function (value) {
		this.calculatedValue = this.currentOperator(this.calculatedValue, value);
		this.currentOperator = (a, b) => this.calculatedValue;
	},

	resetValues: function () {
	this.hasValue = false;
	this.calculatedValue = 0;
	this.currentOperator = (a, b) => this.calculatedValue;
	}
}

////////////////////////////////////////////////////////////////////////////////

let displayPresenter = {
	displayValue: "",
	operatorSymbol: '',
	currentNumber: "",
	currentNumberHasDecimalPoint: false,

	takeDigit: function (digit) {
		this.currentNumber += digit;

		this._updateDisplayValue();
	},

	takeDecimalPoint: function() {
		if (!this.currentNumberHasDecimalPoint) {
			this.currentNumber += '.';
			this.currentNumberHasDecimalPoint = true;

			this._updateDisplayValue();
		}
	},

	takeOperator: function (operator) {
		if (this.displayValue.substring(this.displayValue.length - 1,this.displayValue.length) === this.operatorSymbol) {
			this.backspace();
		} 

		this.operatorSymbol = operator;

		this._takeCurrentNumber();

		this.displayValue = logicManager.calculatedValue + operator;

		logicManager.takeOperator(functionLibrary[operator]);
	},

	takeEqual: function () {
		this.operatorSymbol = '';

		this._takeCurrentNumber();

		this.displayValue = logicManager.calculatedValue.toString();

	},

	_takeCurrentNumber: function () {
		if (!logicManager.hasValue) {	
			logicManager.takeInitialValue(parseFloat(this.currentNumber));
		} else {
			logicManager.takeNextValue(parseFloat(this.currentNumber));
		}

		this.currentNumber = "";
		this.currentNumberHasDecimalPoint = false;
	},

	_updateDisplayValue: function() {
		if (!this.operatorSymbol) {
			this.displayValue = this.currentNumber;
		} else {
			this.displayValue = logicManager.calculatedValue + this.operatorSymbol + this.currentNumber;
		}
	},

	resetValues: function () {
		this.displayValue = "0";
		this.operatorSymbol = '';
		this.currentNumber = "";
		this.currentNumberHasDecimalPoint = false;

		logicManager.resetValues();
	},

	backspace: function () {
		if (this.currentNumber.length == 0) {
			logicManager.clearOperator();
		}

		this.displayValue = this.displayValue.slice(0, -1);
		this.currentNumber = this.currentNumber.slice(0, -1);
	}, 

	flipSign: function() {
		if (!this.currentNumber) {
			return;
		}

		this.displayValue = this.displayValue.substring(0,(this.displayValue.length - this.currentNumber.length));
		this.currentNumber = (this.currentNumber * -1).toString();
		this.displayValue = this.displayValue + this.currentNumber;
	}
};

const displayScreen = document.getElementById("input-display");
const keys = document.querySelector(".calc-keys");


function inputNumber(number) {
	displayPresenter.takeDigit(number);
	updateInputDisplay();
}

function inputOperator(newOperator) {
	if (newOperator == '=') {
		displayPresenter.takeEqual();
	} else {
		displayPresenter.takeOperator(newOperator);
	}
	updateInputDisplay();
}

function inputDecimalPoint(point) {
	displayPresenter.takeDecimalPoint();
	updateInputDisplay();
}

function resetCalculator() {
	displayPresenter.resetValues();
	updateInputDisplay();
}

function backspace() {
	displayPresenter.backspace();
	updateInputDisplay();
}

function flipSign () {
	displayPresenter.flipSign();
	updateInputDisplay();
}

function updateInputDisplay() {
	console.table(displayPresenter);
	displayScreen.value = displayPresenter.displayValue;
}

updateInputDisplay();


keys.addEventListener('click', (event) => {
	const target = event.target;

	if (!target.matches('button')) {
		return;
	} 

	if (target.classList.contains('operator')) {
        inputOperator(target.value);
		return;
	} 

	if (target.classList.contains('decimal')) {
		inputDecimalPoint(target.value);
		return;
	}

	if (target.classList.contains('clear')) {
		resetCalculator();
		return;
	}

	if (target.classList.contains('backspace')) {
		backspace();
		return;
	}

	if (target.classList.contains('flipSign')) {
		flipSign();
		return;
	}
	
	inputNumber(target.value);
})

 