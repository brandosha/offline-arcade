const chess = new Chess()

var app = new Vue({
  el: "#app",
  data: {
    chess: {
      tileSize: 0,

      board: chess.board(),
      pgn: chess.pgn(),
      fen: chess.fen(),
      
      moves: {},
      movingPiece: null,
    }
  },

  methods: {
    pieceClicked(row, col) {
      this.chess.movingPiece = this.squareName(row, col)
    },
    squareName(row, col) {
      const ranks = "abcdefgh"
      return ranks[col] + (8-row)
    },
    moves() {
      const moveObj = {}
      const moves = chess.moves({ verbose: true })
      moves.forEach(move => {
        moveObj[move.from + move.to] = move
      })

      return moveObj
    },
    moveTo(row, col) {
      const from = this.chess.movingPiece
      const to = this.squareName(row, col)
      chess.move({ from, to })

      this.updateBoard()
    },
    updateBoard() {
      this.chess.board = chess.board()
      this.chess.pgn = chess.pgn()
      this.chess.fen = chess.fen()
      this.chess.moves = this.moves()
    }
  },

  mounted() {
    this.chess.tileSize = document.getElementById("chess-container").offsetWidth / 8
    window.addEventListener("resize", () => {
      this.chess.tileSize = document.getElementById("chess-container").offsetWidth / 8
    })

    this.chess.moves = this.moves()
  }
})

try {
  navigator.serviceWorker.register('service-worker.js')
} catch (err) {
  console.log(err)
}
