import { useNavigate } from "react-router-dom";
import { Button } from "../components/Button";

const Landing = () => {
    const navigate = useNavigate();
  return (
    <div>
      <div className="pt-8">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="flex justify-center">
            <img
              src={"/chessboard.png"}
              alt="chessboard"
              className="max-w-96"
            />
          </div>
          <div className="pt-16">
            <h1 className="text-4xl font-bold text-white">Chess Game</h1>
            <p className="text-lg mt-2 text-white">
              Welcome to the chess game!
            </p>
            <div className="mt-4 flex justify-center">
              <Button onClick={() => navigate("/game")} >
                Play Online
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
