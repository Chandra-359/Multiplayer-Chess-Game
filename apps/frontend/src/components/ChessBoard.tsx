import { Chess, Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { IMove, MOVE } from "../screens/Game";

export function isPromoting(chess: Chess, from: Square, to: Square): boolean {
  if (!from) {
    return false;
  }

  const piece = chess.get(from);

  if (piece?.type !== "p") {
    return false;
  }

  if (piece.color !== chess.turn()) {
    return false;
  }

  if (!["1", "8"].some((it) => to.endsWith(it))) {
    return false;
  }

  return chess
    .moves({ square: from, verbose: true })
    .map((it) => it.to)
    .includes(to);
}

const ChessBoard = ({
  gameId,
  started,
  myColor,
  chess,
  board,
  socket,
  setBoard,
  moves,
  setMoves,
}: {
  myColor: Color;
  gameId: string;
  started: boolean;
  chess: Chess;
  moves: IMove[];
  setMoves: React.Dispatch<React.SetStateAction<IMove[]>>;
  setBoard: React.Dispatch<
    React.SetStateAction<
      ({
        square: Square;
        type: PieceSymbol;
        color: Color;
      } | null)[][]
    >
  >;
  board: ({
    square: Square;
    type: PieceSymbol;
    color: Color;
  } | null)[][];
  socket: WebSocket;
}) => {
  const [from, setFrom] = useState<null | Square>(null);
  const isMyTurn = myColor === chess.turn();
  const [legalMoves, setLegalMoves] = useState<string[]>([]);
  const labels = ["a", "b", "c", "d", "e", "f", "g", "h"];

  const includeBox = (legalMoves: string[], i: number, j: number): boolean => {
    let first, second;

    switch (i) {
      case 0:
        first = "a";
        break;
      case 1:
        first = "b";
        break;
      case 2:
        first = "c";
        break;
      case 3:
        first = "d";
        break;
      case 4:
        first = "e";
        break;
      case 5:
        first = "f";
        break;
      case 6:
        first = "g";
        break;
      case 7:
        first = "h";
        break;
      default:
        break;
    }

    switch (j) {
      case 0:
        second = "8";
        break;
      case 1:
        second = "7";
        break;
      case 2:
        second = "6";
        break;
      case 3:
        second = "5";
        break;
      case 4:
        second = "4";
        break;
      case 5:
        second = "3";
        break;
      case 6:
        second = "2";
        break;
      case 7:
        second = "1";
        break;
      default:
        break;
    }

    return legalMoves.includes(first! + second!);
  };

  const handleSquareClick = (i: number, j: number) => {
    const position = (String.fromCharCode(97 + j) + (8 - i)) as Square;

    if (!started || (!from && !isMyTurn)) return;

    if (!from) {
      if (board[i][j]?.color === chess.turn()) {
        setFrom(position);
        setLegalMoves(chess.moves({ square: position }));
      }
    } else {
      const to = position;
      try {
        if (isPromoting(chess, from, to)) {
          chess.move({ from, to, promotion: "q" });
        } else {
          chess.move({ from, to });
        }
        socket.send(
          JSON.stringify({
            type: MOVE,
            payload: { gameId, move: { from, to } },
          })
        );
        setFrom(null);
        setLegalMoves([]);
        setBoard(chess.board());
        setMoves([...moves, { from, to }]);
      } catch (e) {
        console.error(e);
      }
    }
  };

  return (
    <div className="flex">
      <div className="text-white-200 mr-10">
        {board.map((row, i) => {
          return (
            <div key={i} className="flex">
              <div className="w-16 h-16 flex justify-center items-center text-cyan-100">
                {8 - i} {/* Vertical labels */}
              </div>
              {row.map((square, j) => {
                return (
                  <div
                    onClick={() => handleSquareClick(i, j)}
                    key={`${i}-${j}`}
                    className={`w-16 h-16 ${
                      includeBox([from || "", ...legalMoves], j, i)
                        ? "bg-red-400"
                        : (i + j) % 2 === 0
                          ? "bg-green-500"
                          : "bg-white"
                    }`}
                    style={{ position: "relative" }}
                  >
                    {square && (
                      <img
                        src={`/${square.color}${square.type}.png`}
                        alt={`${square.color}-${square.type}`}
                        style={{
                          width: "100%",
                          height: "100%",
                          position: "absolute",
                        }}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          );
        })}
        <div className="flex">
          <div className="w-16 h-8"></div>
          {labels.map((label, i) => (
            <div
              key={i}
              className="w-16 h-8 flex justify-center items-center text-cyan-100"
            >
              {label} {/* Horizontal labels */}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChessBoard;
