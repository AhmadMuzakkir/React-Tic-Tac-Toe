import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className={props.isWinner ? 'square square-win' : 'square'} onClick={props.onClick}>
            {props.value}
        </button>
    )
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square
            value={this.props.squares[i]}
            isWinner={this.props.winner ? this.props.winner.includes(i) : false}
            onClick={() => this.props.onClick(i)}
        />;
    }

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
                player: squares[a],
                lines: lines[i],
            }
        }
    }
    return null;
}

function diffMove(squaresPrev, squares) {
    for (let i = 0; i < squares.length; i++) {
        if (!squaresPrev[i] && squares[i]) {
            return {
                index: i,
                player: squares[i],
            }
        }
    }

    return null;
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.handleSquareClick = this.handleSquareClick.bind(this)

        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
        }
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        let status;

        if (winner) {
            status = 'Winner: ' + winner.player;
        } else if (history.length === 10) {
            status = 'Draw';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        const moves = this.state.history.map((value, index) => {
            let desc = index ?
                'Go to move #' + index : 'Go to game start';

            if (index > 0) {
                let dm = diffMove(this.state.history[index - 1].squares, value.squares);

                if (dm) {
                    desc += ' - ' + dm.player + ' in (r: ' + Math.floor(dm.index / 3) + ', c: ' + dm.index % 3 + ')';
                }
            }

            if (this.state.stepNumber === index) {
                desc = <b>{desc}</b>;
            }

            return (
                <li key={index}>
                    <button className="history-button" onClick={() => this.jumpTo(index)}>{desc}</button>
                </li>
            );
        })

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        winner={winner ? winner.lines : null}
                        onClick={(i) => this.handleSquareClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }

    handleSquareClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        if (calculateWinner(squares) || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(i) {
        this.setState({
            stepNumber: i,
            xIsNext: (i % 2) === 0,
        })
    }

}

// ========================================

ReactDOM.render(
    <Game/>,
    document.getElementById('root')
);
