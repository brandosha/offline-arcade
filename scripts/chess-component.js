Vue.component("chess", {
  template: document.getElementById("chess-component").innerHTML,
  data() {
    const chess = new Chess()
    
    const pgn = localStorage.getItem("chess-pgn")
    if (pgn) {
      chess.load_pgn(pgn)
    }
    

    return {
      chess,

      tileSize: 0,

      board: null,
      pgn: null,
      fen: null,
      
      moves: {},
      movingPiece: null,
    }
  },

  methods: {
    squareClicked(row, col) {
      const square = this.squareName(row, col)
      const piece = this.board[row][col]
      console.log(piece)
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
      this.chess.move({ from, to })

      this.updateBoard()
    },
    updateBoard() {
      const { chess } = this

      this.board = chess.board()
      this.movingPiece = null

      this.pgn = chess.pgn()
      this.fen = chess.fen()

      const moveObj = {}
      const moves = chess.moves({ verbose: true })
      moves.forEach(move => {
        moveObj[move.from + move.to] = move
      })
      this.moves = moveObj

      localStorage.setItem("chess-pgn", this.pgn)
    },
    reset() {
      this.chess.reset()
      this.updateBoard()
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