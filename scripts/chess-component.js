Vue.component("chess", {
  template: document.getElementById("chess-component").innerHTML,
  data() {
    const chess = new Chess()
    
    const pgn = localStorage.getItem("chess-pgn")
    if (pgn) {
      chess.load_pgn(pgn)
    }

    const moveHistory = chess.history()

    return {
      chess,

      tileSize: 0,

      board: null,
      pgn: null,
      fen: null,
      
      moves: {},
      movingPiece: null,

      gameOver: false,
      history: {
        index: moveHistory.length - 1,
        moves: moveHistory
      }
    }
  },

  methods: {
    squareClicked(row, col) {
      if (this.gameOver) {
        return
      }

      const square = this.squareName(row, col)
      const piece = this.board[row][col]
      
      if (piece == null) {
        this.movingPiece = null
      } else if (piece.color != this.chess.turn()) {
        if (this.moves[this.movingPiece + square]) {
          this.moveTo(row, col)
        } else {
          this.movingPiece = null
        }
      } else {
        this.movingPiece = square
      }
    },
    squareName(row, col) {
      const ranks = "abcdefgh"
      return ranks[col] + (8-row)
    },
    moveTo(row, col) {
      const from = this.movingPiece
      const to = this.squareName(row, col)

      const promotion = "q" // TODO: Allow player to select promotion piece
      const move = this.chess.move({ from, to, promotion })

      this.history.moves.push(move.san)
      this.history.index = this.history.moves.length - 1

      this.updateBoard()
      this.updateGameState()
    },
    updateBoard() {
      const { chess } = this

      this.board = chess.board()
      this.movingPiece = null

      const moveObj = {}
      const moves = chess.moves({ verbose: true })
      moves.forEach(move => {
        moveObj[move.from + move.to] = move
      })
      this.moves = moveObj
    },
    updateGameState() {
      const { chess } = this

      this.pgn = chess.pgn()
      this.fen = chess.fen()

      localStorage.setItem("chess-pgn", this.pgn)
    },
    reset() {
      this.gameOver = false
      this.chess.reset()
      this.updateBoard()

      localStorage.removeItem("chess-pgn")
    },
    historyBack() {
      if (this.history.index >= 0) {
        this.history.index--
        this.chess.undo()
        this.updateBoard()
      }
    },
    historyForward() {
      if (this.history.index < this.history.moves.length - 1) {
        this.history.index++
        this.chess.move(this.history.moves[this.history.index])
        this.updateBoard()
      }
    }
  },
  computed: {
    description() {
      this.board;

      const turn = this.chess.turn() == "w" ? "White" : "Black"

      if (this.chess.in_checkmate()) {
        this.gameOver = true
        return turn + " wins"
      } else if (this.chess.in_stalemate()) {
        this.gameOver = true
        return "Stalemate"
      } else if (this.chess.in_threefold_repetition()) {
        this.gameOver = true
        return "Threefold repetition"
      } else if (this.chess.in_draw()) {
        this.gameOver = true
        return "Draw"
      }

      return turn + " to move"
    }
  },

  mounted() {
    this.tileSize = document.getElementById("chess-container").offsetWidth / 8
    window.addEventListener("resize", () => {
      this.tileSize = document.getElementById("chess-container").offsetWidth / 8
    })

    this.updateBoard()
  }
})