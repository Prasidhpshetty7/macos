<script lang="ts">
	import Plus from '~icons/ic/outline-plus';
	import Equal from '~icons/ic/round-equals';
	import Minus from '~icons/ic/round-minus';
	import PlusMinus from '~icons/majesticons/plus-minus-2';
	import Division from '~icons/ph/divide-bold';
	import Multiply from '~icons/uil/multiply';

	let display = $state('0');
	let firstOperand = $state<number | null>(null);
	let operator = $state<string | null>(null);
	let waitingForSecond = $state(false);

	function inputDigit(digit: string) {
		if (waitingForSecond) {
			display = digit;
			waitingForSecond = false;
		} else {
			display = display === '0' ? digit : display + digit;
		}
	}

	function inputDecimal() {
		if (waitingForSecond) {
			display = '0.';
			waitingForSecond = false;
			return;
		}
		if (!display.includes('.')) {
			display = display + '.';
		}
	}

	function clear() {
		display = '0';
		firstOperand = null;
		operator = null;
		waitingForSecond = false;
	}

	function toggleSign() {
		display = String(parseFloat(display) * -1);
	}

	function percentage() {
		display = String(parseFloat(display) / 100);
	}

	function handleOperator(nextOp: string) {
		const inputValue = parseFloat(display);

		if (firstOperand === null) {
			firstOperand = inputValue;
		} else if (operator) {
			const result = calculate(firstOperand, inputValue, operator);
			display = String(result);
			firstOperand = result;
		}

		waitingForSecond = true;
		operator = nextOp;
	}

	function calculate(first: number, second: number, op: string): number {
		switch (op) {
			case '+': return first + second;
			case '-': return first - second;
			case '*': return first * second;
			case '/': return second !== 0 ? first / second : 0;
			default: return second;
		}
	}

	function equals() {
		if (operator === null || firstOperand === null) return;
		
		const inputValue = parseFloat(display);
		const result = calculate(firstOperand, inputValue, operator);
		display = String(result);
		firstOperand = null;
		operator = null;
		waitingForSecond = false;
	}
</script>

<section class="container">
	<header class="app-window-drag-handle"></header>

	<section class="show-area">{display}</section>

	<section class="buttons-container">
		<button class="top-row-button" onclick={clear}> AC </button>
		<button class="top-row-button" onclick={toggleSign}>
			<PlusMinus />
		</button>
		<button class="top-row-button" onclick={percentage}> % </button>
		<button class="operation-button" onclick={() => handleOperator('/')}>
			<Division />
		</button>
		<button class="number-button" onclick={() => inputDigit('7')}> 7 </button>
		<button class="number-button" onclick={() => inputDigit('8')}> 8 </button>
		<button class="number-button" onclick={() => inputDigit('9')}> 9 </button>
		<button class="operation-button" onclick={() => handleOperator('*')}>
			<Multiply />
		</button>
		<button class="number-button" onclick={() => inputDigit('4')}> 4 </button>
		<button class="number-button" onclick={() => inputDigit('5')}> 5 </button>
		<button class="number-button" onclick={() => inputDigit('6')}> 6 </button>
		<button class="operation-button" onclick={() => handleOperator('-')}>
			<Minus />
		</button>
		<button class="number-button" onclick={() => inputDigit('1')}> 1 </button>
		<button class="number-button" onclick={() => inputDigit('2')}> 2 </button>
		<button class="number-button" onclick={() => inputDigit('3')}> 3 </button>
		<button class="operation-button" onclick={() => handleOperator('+')}> <Plus /> </button>
		<button class="number-button curved-bottom-left-button" style:grid-column="1 / span 2" onclick={() => inputDigit('0')}>
			0
		</button>
		<button class="number-button" onclick={inputDecimal}> . </button>
		<button class="operation-button curved-bottom-right-button" onclick={equals}> <Equal /> </button>
	</section>
</section>

<style>
	header {
		padding: 1rem;
	}

	.container {
		height: 100%;
		width: 100%;

		background-color: hsla(240, 5%, 12%, 0.7);
		backdrop-filter: blur(15px);

		border-radius: inherit;

		display: grid;
		grid-template-rows: auto auto 1fr;

		font-family: var(--system-font-family) !important;
	}

	.buttons-container {
		display: grid;
		grid-template-columns: repeat(4, 1fr);
		grid-template-rows: repeat(5, 1fr);
		gap: 1px;

		margin: 1.5px;

		& > button {
			font-size: 1.414rem;
			font-weight: 400 !important;
			color: white;
			fill: white;
		}

		:global(svg) {
			font-size: 1.2rem;
		}
	}

	.top-row-button {
		background-color: hsla(240, 5%, 12%, 0.2);
	}

	.number-button {
		background-color: hsla(240, 5%, 80%, 0.25);
	}

	.operation-button {
		background-color: hsl(37deg 98% 51%);
	}

	.curved-bottom-left-button {
		border-radius: 0 0 0 0.7rem;
	}

	.curved-bottom-right-button {
		border-radius: 0 0 0.7rem 0;
	}

	.show-area {
		font-size: 3rem;
		color: white;
		text-align: end;
		font-weight: 200;

		overflow: auto;

		padding: 0.5rem 1rem;
	}

	:global(.tl-container.calculator) {
		top: 0.7rem;
		left: 0.7rem;
	}
</style>
