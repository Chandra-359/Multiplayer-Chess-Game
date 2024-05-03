import { Color, PieceSymbol, Square } from "chess.js";
import { useState } from "react";
import { MOVE } from "../screens/Game";

const ChessBoard = ({
  chess,
  setBoard,
  board,
  socket,
}: {
  board: ({ square: Square; type: PieceSymbol; color: Color } | null)[][];
  socket: WebSocket;
  chess: any;
  setBoard: any;
}) => {
  const [from, setFrom] = useState<Square | null>(null);
  // console.log(board);

  const handleSquareClick = (i: number, j: number) => {
    const position = (String.fromCharCode(97 + j) + (8 - i)) as Square;
    // console.log(position);

    if (!from) {
      setFrom(position);
    } else {
      socket.send(
        JSON.stringify({
          type: MOVE,
          payload: {
            move: { from, to: position },
          },
        })
      );
      setFrom(null);
      chess.move({
        from,
        to: position
      });
      setBoard(chess.board());
    }
    //console.log({from, to});
  };

  return (
    <div className="flex justify-center">
      <div
        className="border-4 border-solid border-gray-800"
        style={{
          width: "480px",
          height: "480px",
          display: "grid",
          gridTemplate: "repeat(8, 1fr) / repeat(8, 1fr)",
        }}
      >
        {board.map((row, i) =>
          row.map((square, j) => (
            <div
              onClick={() => handleSquareClick(i, j)}
              key={`${i}-${j}`}
              className={`flex items-center justify-center ${
                (i + j) % 2 === 0 ? "bg-green-500" : "bg-white"
              }`}
              style={{
                width: "60px",
                height: "60px",
                position: "relative",
              }}
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
          ))
        )}
      </div>
    </div>
  );
};

export default ChessBoard;
