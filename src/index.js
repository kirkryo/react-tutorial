import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button className="square" style={props.color} onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
  	const winner = calculateWinner(this.props.squares);

  	if (winner) { //if there is a winner -> highlight the winning squares
  		if (i===winner.line[0] || i===winner.line[1] || i===winner.line[2]) {
  			return (<Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} color={{backgroundColor: 'yellow'}} />);
  		} else {
  			return (<Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />);
  		}
  	} else { //if there is no winner -> create normal board
  			return (<Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />);
  	}
  }

  render() {
  	let row = [], boardRow = [];
  	for (let y=0; y<3; y++) {
  		for (let x=0; x<3; x++) {
  			row.push(this.renderSquare(x + y * 3));
  		}
  		boardRow.push(<div className="board-row"> {row} </div>);
  		row = [];
  	}
  	const board = <div> {boardRow} </div>;
  	console.log(board);
  	return board;  
  }

/*
  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }

  */
}

class Game extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			history: [{
				squares: Array(9).fill(null),
				lastClicked: null,
			}],
      	stepNumber: 0,
		xIsNext: true,
		};
	}

  render() {
  	const history = this.state.history;
  	const current = history[this.state.stepNumber];
  	const winner = calculateWinner(current.squares);
  	
  	const moves = history.map((step, move) => {
  		let desc = move ?
  		'Go to move #' + move :
  		'Go to game start';
  		if (move) {
  			if (move === this.state.stepNumber) {
  				return (
		  			<li key={move}>
		  				<button id='bold' onClick={() => this.jumpTo(move)}>{desc}</button> {history[move].lastClicked}
		  			</li>
				);
  			} else {
  				return (
		  			<li key={move}>
		  				<button onClick={() => this.jumpTo(move)}>{desc}</button> {history[move].lastClicked}
		  			</li>
				);
  			}
  		} else {
  			if (move === this.state.stepNumber) {
  				return (
		  			<li key={move}>
		  				<button id='bold' onClick={() => this.jumpTo(move)}>{desc}</button>
		  			</li>
				);
  			} else {
  				return (
		  			<li key={move}>
		  				<button onClick={() => this.jumpTo(move)}>{desc}</button>
		  			</li>
				);
  			}
  		}
  	});
  	let status;
  	if (winner) {
  		status = 'Winner: ' + winner.name;
  	} else {
  		status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
  	}
    return (
      <div className="game">
        <div className="game-board">
          <Board 
          	squares={current.squares} 
          	onClick={(i) => this.handleClick(i)} 
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    })
  }

  handleClick(i) {
  	const history = this.state.history.slice(0, this.state.stepNumber + 1);
  	const current = history[history.length-1];
	const squares = current.squares.slice();
	const coordinates = [
	  	'1,1',
	  	'1,2',
	  	'1,3',
	  	'2,1',
	  	'2,2',
	  	'2,3',
	  	'3,1',
	  	'3,2',
	  	'3,3',
  	]

	if (calculateWinner(squares) || squares[i]) {
		return;
	}
	squares[i] = (this.state.xIsNext ? 'X' : 'O');
	this.setState({
		history: history.concat([{
			squares: squares,
			lastClicked: coordinates[i],
		}]),
    	stepNumber: history.length,
		xIsNext: !this.state.xIsNext,
	});
	}
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
    	return {
    		name: squares[a],
    		line: lines[i],
    	}
    }
  }
  return null;
}



// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

