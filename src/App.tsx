import { useReducer } from 'react'
import './styles.css'
import DigitButton from './DigitButton'
import { OperationButton } from './OperationButton'

export const ACTIONS = {
  ADD_DIGIT: 'ADD_DIGIT',
  CLEAR: 'CLEAR',
  DELETE_DIGIT: 'DELETE_DIGIT',
  CHOOSE_OPERATION: 'CHOOSE_OPERATION',
  EVALUATE: 'EVALUATE'
}

function reducer(state, {type, payload}) {

  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if(payload.digit == 0 && state.currentOperand == 0) {
        return state
      }
      if(payload.digit == '.' && state.currentOperand!= null && state.currentOperand.includes('.')) {
        return state
      }
      if(state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: payload.digit
        }
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ''}${payload.digit}`
      }
      break;

    case ACTIONS.CHOOSE_OPERATION:
      if(state.currentOperand == null && state.previousOperand == null) {
        return state
      }

      if (state.currentOperand == null) {
        return {
          ...state,
          operation: payload.operation
        }
      }

      if (state.previousOperand == null) {
        return {
          ...state,
          operation: payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null
        }
      }


      return {
        ...state,
        previousOperand: evaluate(state),
        currentOperand: null,
        operation: payload.operation
      }
    break;

    case ACTIONS.CLEAR:
      return {}
    break;

    case ACTIONS.EVALUATE:
      if (state.currentOperand == null || state.previousOperand == null || state.operation == null) {
        return state
      }

      return {
        ...state,
        overwrite: true,
        currentOperand: evaluate(state),
        previousOperand: null,
        operation: null
      }
    break;

    case ACTIONS.DELETE_DIGIT:

      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        }
      }

      if(state.currentOperand == null) {
        return state
      }

      if(state.currentOperand.length == 1) {
        return {
          ...state,
          currentOperand: null
        }
      }

      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      }
      return {}
    break;

    default:
      break;
  }


  return state
}

function evaluate({previousOperand, currentOperand, operation}) {
  const prev = parseFloat(previousOperand)
  const curr = parseFloat(currentOperand)

  if (isNaN(prev) || isNaN(curr)) {
    return
  }

  let computation = '';

  switch (operation) {
    case '+':
      computation = prev + curr
      break
    case '-':
      computation = prev - curr
      break
    case '*':
      computation = prev * curr
      break
    case '÷':
      computation = prev / curr
      break

    default:
      break;
  }

  return computation.toString()
}

function App() {
  const[{currentOperand, previousOperand, operation}, dispatch] = useReducer(reducer, {})

  return <div className="calculator-grid">
    <div className="output">
      <div className="previous-operand">{previousOperand} {operation}</div>
      <div className="current-operand">{currentOperand}</div>
    </div>
    <button className="span-two" onClick={() => { dispatch({type: ACTIONS.CLEAR}) }}>AC</button>
    <button className="" onClick={() => { dispatch({type: ACTIONS.DELETE_DIGIT}) }}>DEL</button>
    <OperationButton dispatch={dispatch} operation='÷'/>
    <DigitButton dispatch={dispatch} digit={1}/>
    <DigitButton dispatch={dispatch} digit={2}/>
    <DigitButton dispatch={dispatch} digit={3}/>
    <OperationButton dispatch={dispatch} operation='*'/>
    <DigitButton dispatch={dispatch} digit={4}/>
    <DigitButton dispatch={dispatch} digit={5}/>
    <DigitButton dispatch={dispatch} digit={6}/>
    <OperationButton dispatch={dispatch} operation='+'/>
    <DigitButton dispatch={dispatch} digit={7}/>
    <DigitButton dispatch={dispatch} digit={8}/>
    <DigitButton dispatch={dispatch} digit={9}/>
    <OperationButton dispatch={dispatch} operation='-'/>
    <DigitButton dispatch={dispatch} digit="."/>
    <DigitButton dispatch={dispatch} digit={0}/>
    <button className="span-two" onClick={() => dispatch({type: ACTIONS.EVALUATE})}>=</button>
  </div>
}

export default App
