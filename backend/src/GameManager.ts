import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages";
import { Game } from "./Game";


export class GameManager {
    private games: Game[];
    private pendingUser: WebSocket | null;
    private users: WebSocket[];

    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }

    addUser(socket: WebSocket) {
        this.users.push(socket);
        // console.log(this.users);
        this.addHandler(socket);
    }

    removeUser(socket: WebSocket) {
        this.users = this.users.filter(user => user !== socket);
    }

    private addHandler(socket: WebSocket) {
        socket.on("message",(data)=>{
            const message = JSON.parse(data.toString());
            console.log(message);
            if(message.type === INIT_GAME){
                if(this.pendingUser){
                    //start a new game
                    const game = new Game(this.pendingUser,socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }else{
                    this.pendingUser = socket;
                }
            }

            if(message.type === MOVE){
                console.log("inside move");
                
                const game = this.games.find(game => game.player1 === socket || game.player2 === socket);
                if(game){
                    console.log("inside gamechnager move type if clause");
                    console.log(message.payload.move);
                    game.makeMove(socket,message.payload.move);
                }
            }
        })

    }

}