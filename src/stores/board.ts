/**
 *
 * The game board is represented as a 2D array with the first level indicating
 * the slots and stores of the physical board.  The shape of the board and
 * arrangement of the slots looks like this:
 *
 *    _________________________________________________
 *   /   ____                                   ____   \
 *   |  | P2 |  (12) (11) (10) (09) (08) (07)  | P1 |  |
 *   |  |(13)|                                 |(06)|  |
 *   |  |____|  (00) (01) (02) (03) (04) (05)  |____|  |
 *   \_________________________________________________/
 *
 */

import { MarbleColor } from '@/types/marble-colors'
import { defineStore } from 'pinia'

export enum Player {
  ONE = 'P1',
  TWO = 'P2'
}

export enum GameState {
  NOT_STARTED = 'NS',
  IN_PROGRESS = 'IP',
  PLACING_MARBLES = 'PL',
  DONE = 'DN'
}

/* Begin utility functions - these can be extracted later */

export async function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function randomMarble(): MarbleColor {
  return randomFromArray(Object.values(MarbleColor))
}

function randomFromArray<T = any>(input: T[]) {
  const i = Math.floor(Math.random() * input.length);
  return input[i];
}

function oppositeSlot(slot: number): number {
  return Math.abs(12 - slot)
}

/* End utility functions */

export const P1_STORE: number = 6
export const P2_STORE: number = 13
export const P1_SLOTS: number[] = [0, 1, 2, 3, 4, 5]
export const P2_SLOTS: number[] = [7, 8, 9, 10, 11, 12]

function resetGameState() {
  return {
    gameState: GameState.NOT_STARTED,
    turn: Player.ONE,
    lastPosition: -1,
    delayTime: 0,
    pods: (() => {
      const p = new Array<MarbleColor[]>(14).fill(new Array())
      ;[...P1_SLOTS, ...P2_SLOTS].forEach((slot) => {
        p[slot] = new Array(4).fill('').map(randomMarble)
      })
      p[P1_STORE] = []
      p[P2_STORE] = []
      return p
    })()
  }
}

export const useGameStore = defineStore('game', {
  state: resetGameState,
  getters: {
    isGameOver: (state) => state.gameState === GameState.DONE,
    position: (state) => state.lastPosition,
    p1Store: (state) => state.pods[P1_STORE],
    p2Store: (state) => state.pods[P2_STORE],
    activePlayer: (state) => state.turn,
    activePlayerSlots: (state) => (state.turn === Player.ONE ? P1_SLOTS : P2_SLOTS),
    delay: (state) => state.delayTime,
    allSlots: (state) => state.pods,
    winner: (state) => {
      const p1Score = state.pods[P1_STORE].length
      const p2Score = state.pods[P2_STORE].length
      if (p1Score === p2Score) {
        return -1
      } else if (p1Score > p2Score) {
        return Player.ONE
      } else {
        return Player.TWO
      }
    },
    slot: (state) => {
      return (pod: number) => {
        if (P1_SLOTS.includes(pod) || P2_SLOTS.includes(pod)) {
          return state.pods[pod]
        }
        return []
      }
    },
    isTurnOver: (state) => {
      const inStore = state.lastPosition === P1_STORE || state.lastPosition === P2_STORE
      return !inStore && state.lastPosition >= 0 && state.pods[state.lastPosition].length <= 1
    },
    finishedInOwnStore: (state) => {
      if (state.gameState !== GameState.IN_PROGRESS) {
        return false
      }

      const result =
        (state.turn === Player.ONE && state.lastPosition === P1_STORE) ||
        (state.turn === Player.TWO && state.lastPosition === P2_STORE)
      return result
    },
    isValidSpace: (state) => {
      return (space: number) => {
        const lp = state.lastPosition
        const playerStore = state.turn === Player.ONE ? P1_STORE : P2_STORE
        const playerSpaces = state.turn === Player.ONE ? P1_SLOTS : P2_SLOTS

        // player cannot start from a store
        if (space === P1_STORE || space === P2_STORE) {
          return false
        }

        // player can start on any of their own non-empty spaces when starting a turn or finishing in own store
        if (
          (lp < 0 || lp === playerStore) &&
          playerSpaces.includes(space) &&
          state.pods[space].length
        ) {
          return true
        }

        // otherwise player must start from the last position
        return space === lp
      }
    },
    validSpaces(): number[] {
      return [...P1_SLOTS, ...P2_SLOTS].filter(this.isValidSpace)
    }
  },
  actions: {
    reset() {
      this.$reset()
    },
    start() {
      this.gameState = GameState.IN_PROGRESS
    },
    setDelay(ms: number) {
      if (ms >= 0 && ms <= 3000) {
        this.delayTime = ms
      }
    },
    async collectRemaining(player: Player) {
      const playerSpaces = player === Player.ONE ? P1_SLOTS : P2_SLOTS
      const remaining = playerSpaces.reduce((remaining, idx) => {
        return remaining.concat(this.pods[idx])
      }, [] as MarbleColor[])
      await this.bankMarbles(player, remaining)
      for (const slot of playerSpaces) {
        this.pods[slot] = []
      }
    },
    async nextTurn(): Promise<void> {
      // if finished in own side, collect marbles from last position and the slot across the board
      if (
        this.activePlayerSlots.includes(this.lastPosition) &&
        this.slot(this.lastPosition).length <= 1
      ) {
        this.bankMarbles(this.activePlayer, this.slot(this.lastPosition))
        this.bankMarbles(this.activePlayer, this.slot(oppositeSlot(this.lastPosition)))
        this.clearSlot(this.lastPosition)
        this.clearSlot(oppositeSlot(this.lastPosition))
      }

      this.lastPosition = -1

      if (this.turn === Player.ONE) {
        this.turn = Player.TWO
      } else {
        this.turn = Player.ONE
      }
    },
    async takeTurn(pod: number): Promise<void> {
      if (this.isValidSpace(pod)) {
        await this.pick(pod)
      
        if (this.isTurnOver) {
          await this.nextTurn()
        } 
      }

      const hasEnded = await this.checkEndGame();
      if (hasEnded) {
        this.gameState = GameState.DONE
      } 
    },
    async checkEndGame(): Promise<boolean> {
      const isGameOver = !P1_SLOTS.some((idx) => this.pods[idx].length > 0) 
                      || !P2_SLOTS.some((idx) => this.pods[idx].length > 0)

      if (isGameOver) {
        await this.collectRemaining(Player.ONE)
        await this.collectRemaining(Player.TWO)
        this.lastPosition = -1
        this.gameState = GameState.DONE
        return true;
      } else {
        this.gameState = GameState.IN_PROGRESS
        return false;
      }
    },
    async pick(pod: number): Promise<number> {
      const marbles = this.pods[pod]
      this.pods[pod] = []
      this.lastPosition = pod
      this.gameState = GameState.PLACING_MARBLES
      while (marbles.length > 0) {
        let lp = this.lastPosition
        if (
          (this.turn === Player.ONE && this.lastPosition === P2_STORE - 1) ||
          (this.turn === Player.TWO && this.lastPosition === P1_STORE - 1)
        ) {
          lp++
        }
        lp++
        this.lastPosition = lp % this.pods.length

        const marble = marbles.pop() as MarbleColor
        await this.placeMarble(this.lastPosition, marble)
      }

      return this.lastPosition
    },
    async placeMarble(idx: number, marble: MarbleColor) {
      this.pods[idx].push(marble)
      await delay(this.delay)
    },
    async bankMarbles(player: Player, marbles: MarbleColor[]) {
      await delay(this.delay)
      const bank = player === Player.ONE ? P1_STORE : P2_STORE
      this.pods[bank] = this.pods[bank].concat(marbles)
    },
    async clearSlot(idx: number) {
      this.pods[idx] = []
    },
    async autoPlay() {
      this.setDelay(100)
      let slot = randomFromArray(this.validSpaces);
      while (slot !== undefined && this.gameState !== GameState.DONE) {
        await this.takeTurn(slot);
        slot = randomFromArray(this.validSpaces)
      }
    }
  }
})
