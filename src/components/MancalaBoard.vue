<script setup lang="ts">
import BoardStore from './BoardStore.vue'
import BoardSpace from './BoardSpace.vue'
import { useGameStore, Player, P1_STORE, P2_STORE, GameState } from '../stores/board'

const SPACE_ARRANGEMENT = [12, 0, 11, 1, 10, 2, 9, 3, 8, 4, 7, 5]
const game = useGameStore()

function startGame() {
  game.reset();
  game.setDelay(100)
  game.start()
}

startGame();
</script>

<template>
  <div
    class="h-screen w-screen flex flex-col justify-center items-center max-w-5xl max-h-96 m-auto"
  >
    <div class="flex-1 items-center text-center flex justify-center">
      <span v-if="!game.isGameOver && game.turn === Player.TWO">Player Two, it's your turn!</span>
    </div>
    <div class="flex flex-1 w-full justify-center items-center">
      <div class="flex-1 text-center flex flex-col">
        <span class="text-6xl">{{ game.p2Store.length }}</span>
        <span>Player 2</span>
      </div>
      <div
        class="relative grid grid-cols-8 grid-flow-col border p-8 gap-8 justify-center items-center max-w-2xl"
      >
        <div v-if="game.gameState === GameState.DONE" class="absolute top-0 bottom-0 left-0 right-0 backdrop-blur-sm flex flex-col justify-evenly items-center">
          <span class="text-3xl font-bold">Player {{ game.winner === Player.ONE ? '1' : '2' }} Wins!</span>
          <button class="text-xl border-4 border-green-700 bg-white py-1 px-2 rounded-md" @click="startGame()">Play Again</button>
        </div>
        <BoardStore
          class="flex justify-center items-center"
          :marbles="game.p2Store"
          :current="game.lastPosition === P2_STORE"
        />
        <BoardSpace
          v-for="i in SPACE_ARRANGEMENT"
          @click="game.takeTurn(i)"
          :marbles="game.slot(i)"
          :current="game.lastPosition === i"
          :clickable="game.gameState === GameState.IN_PROGRESS && game.isValidSpace(i)"
          :class="{ [`order-${i}`]: true }"
          :key="'space-' + i"
          >{{ i }}
        </BoardSpace>
        <BoardStore
          class="flex justify-center items-center"
          :marbles="game.p1Store"
          :current="game.lastPosition === P1_STORE"
        />
      </div>
      <div class="flex-1 text-center flex flex-col">
        <span class="text-6xl">{{ game.p1Store.length }}</span>
        <span>Player 1</span>
      </div>
    </div>
    <div class="flex-1 items-center text-center flex justify-center">
      <span v-if="!game.isGameOver && game.turn === Player.ONE">Player One, it's your turn!</span>
    </div>
  </div>
</template>