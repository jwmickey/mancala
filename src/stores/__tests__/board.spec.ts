import { describe, it, expect, beforeEach, vitest } from 'vitest'
import { useGameStore, GameState, Player, P1_SLOTS, P2_SLOTS, P1_STORE, P2_STORE } from '../board'
import { setActivePinia, createPinia } from 'pinia'
import { MarbleColor } from '@/types/marble-colors'

describe('mancala game', () => {
  setActivePinia(createPinia())
  let game = useGameStore()

  beforeEach(() => {
    // creates a fresh pinia and make it active so it's automatically picked
    // up by any useStore() call without having to pass it to it:
    // `useStore(pinia)`
    game = useGameStore(createPinia())
    setActivePinia(createPinia())
  })

  describe('getters', () => {
    describe('winner', () => {
      it('p1', () => {
        const updated = game.pods;
        updated[P1_STORE] = [MarbleColor.BLUE]
        game.$patch({ pods: updated })
        expect(game.winner).toEqual(Player.ONE)
      })
      it('p2', () => {
        const updated = game.pods;
        updated[P2_STORE] = [MarbleColor.BLUE]
        game.$patch({ pods: updated })
        expect(game.winner).toEqual(Player.TWO)
      })
      it('tie', () => {
        const updated = game.pods;
        updated[P1_STORE] = [MarbleColor.BLUE]
        updated[P2_STORE] = [MarbleColor.BLUE]
        game.$patch({ pods: updated })
        expect(game.winner).toEqual(-1)
      })
    })

    describe('slot', () => {
      it('gets slot from p1', () => {
        const expected = game.pods[0];
        expect(game.slot(0)).toEqual(expected)
      })

      it('gets slot from p2', () => {
        const expected = game.pods[8];
        expect(game.slot(8)).toEqual(expected)
      })

      it('returns empty array for invalid slot', () => {
        expect(game.slot(15)).toEqual([])
      })

      it('returns empty array when accessing player store', () => {
        expect(game.slot(P1_STORE)).toEqual([])
        expect(game.slot(P2_STORE)).toEqual([])
      })
    })

    describe('finishedInOwnStore', () => {
      it('returns false when game is not in progress', () => {
        [GameState.DONE, GameState.NOT_STARTED, GameState.PLACING_MARBLES].forEach(state => {
          game.$patch({ gameState: state })
          expect(game.finishedInOwnStore).toBe(false)
        })
      })

      it('returns true for p1', () => {
        game.$patch({
          gameState: GameState.IN_PROGRESS,
          turn: Player.ONE,
          lastPosition: P1_STORE
        });
        expect(game.finishedInOwnStore).toBe(true);
      })

      it('returns true for p2', () => {
        game.$patch({
          gameState: GameState.IN_PROGRESS,
          turn: Player.TWO,
          lastPosition: P2_STORE
        });
        expect(game.finishedInOwnStore).toBe(true);
      })

      it('returns false when not in a store', () => {
        game.$patch({
          gameState: GameState.IN_PROGRESS,
          turn: Player.ONE,
          lastPosition: 0
        });
        expect(game.finishedInOwnStore).toBe(false);
      })
    })

    describe('isValidSpace', () => {
      it('can start from any of player 1 own spaces', () => {
        assertValidSpaces(P1_SLOTS)
      })

      it('can start from any of player 1 own spaces', () => {
        game.turn = Player.TWO;
        assertValidSpaces(P2_SLOTS)
      })
    
      it('cannot start from an empty space', async () => {
        // position 2 will be empty as the player will end in their store
        await game.pick(2)
        assertValidSpaces([0, 1, 3, 4, 5])
      })
    
      it('must start from the active space during a turn', async () => {
        await game.pick(3)
        assertValidSpaces([7])
      })
    
      function assertValidSpaces(validIndexes: number[]) {
        const invalidIndexes = game.allSlots
          .map((_: any, i: any) => i)
          .filter((i: number) => !validIndexes.includes(i))
    
        validIndexes.forEach((space) => {
          expect(game.isValidSpace(space), `expect space ${space} to be valid`).toBe(true)
        })
    
        invalidIndexes.forEach((space: any) => {
          expect(game.isValidSpace(space), `expect space ${space} to be invalid`).toBe(false)
        })
      }
    });
  });

  describe('actions', () => {
    it('resets the state', () => {
      game.reset();
      expect(game.gameState).toEqual(GameState.NOT_STARTED);
      expect(game.p1Store).toHaveLength(0);
      expect(game.p2Store).toHaveLength(0);
    });

    it('creates a game in the default starting state', () => {
      expect(game.position).toEqual(-1)
      expect(game.p1Store).toEqual([])
      expect(game.p2Store).toEqual([])
      expect(game.gameState).toEqual(GameState.NOT_STARTED)
      expect(game.activePlayer).toEqual(Player.ONE)
  
      P1_SLOTS.forEach((slot) => {
        expect(game.slot(slot)).toHaveLength(4)
      })
  
      P2_SLOTS.forEach((slot) => {
        expect(game.slot(slot)).toHaveLength(4)
      })
    });

    it('starts the game', () => {
      game.start();
      expect(game.gameState).toEqual(GameState.IN_PROGRESS);
    });

    it('sets the delay between screen updates', () => {
      game.setDelay(1000);
      expect(game.delay).toEqual(1000);
    });

    it('ignores a delay time of more than 5 seconds', () => {
      game.setDelay(1000);
      expect(game.delay).toEqual(1000);
      game.setDelay(5001);
      expect(game.delay).toEqual(1000);
    });

    it('banks marbles to a players store', async () => {
      const marbles = [MarbleColor.RED, MarbleColor.BLUE];
      await game.bankMarbles(Player.ONE, marbles);
      expect(game.p1Store).toContain(marbles[0])
      expect(game.p1Store).toContain(marbles[1])
    })

    it('collects remaining marbles at end of game', async () => {
      const updated = game.pods.map((_ => new Array()));
      updated[0] = [MarbleColor.BLUE, MarbleColor.GREEN];
      game.$patch({ pods: updated })
      await game.collectRemaining(Player.ONE)
      expect(game.p1Store).toHaveLength(2);
      expect(game.slot(0)).toHaveLength(0);
    });

    it('picks from a slot', async () => {
      const endingPosition = await game.pick(2)
      expect(endingPosition).toEqual(P1_STORE)
      expect(game.slot(2)).toHaveLength(0)
      expect(game.slot(3)).toHaveLength(5)
      expect(game.slot(4)).toHaveLength(5)
      expect(game.slot(5)).toHaveLength(5)
    });

    it('skips over the opponent store when placing marbles', async () => {
      const updated = game.pods;
      updated[12] = Array(10).fill(MarbleColor.RED);
      updated[P1_STORE] = [];
      game.$patch({ turn: Player.TWO })
      await game.pick(12)
      expect(game.p1Store).toHaveLength(0)
    });
  
    it('keeps the current player when landing in own store', async () => {
      await game.takeTurn(2)
      expect(game.activePlayer).toEqual(Player.ONE)
      expect(game.lastPosition).toEqual(-1)
      expect(game.gameState).toEqual(GameState.IN_PROGRESS)
    })
  
    it('ends the turn when landing in an empty player slot', async () => {
      const updatedPods = game.pods
      updatedPods[0] = []
      game.$patch({
        lastPosition: 0,
        gameState: GameState.IN_PROGRESS,
        pods: updatedPods
      })
      expect(game.isTurnOver).toBe(true)
    })
  
    it('switches to the next player when ending in an empty slot', async () => {
      expect(game.lastPosition).toEqual(-1)
      expect(game.activePlayer).toEqual(Player.ONE)
      const nextTurnSpy = vitest.spyOn(game, 'nextTurn')
      const pickSpy = vitest.spyOn(game, 'pick')
      // turns to get to empty slot on opponent side
      const turns = [2, 5, 10]
      for (const slot of turns) {
        await game.takeTurn(slot)
        expect(pickSpy).toHaveBeenCalledWith(slot)
      }
      expect(nextTurnSpy).toHaveBeenCalledOnce()
      expect(game.lastPosition).toEqual(-1)
      expect(game.activePlayer).toEqual(Player.TWO)
      expect(game.gameState).toEqual(GameState.IN_PROGRESS)
    });

    describe('nextTurn', () => {
      it('banks marbles from own and opposite side at end of turn', async () => {
        const updated = game.pods;
        updated[12] = [MarbleColor.BLUE];
        updated[0] = [MarbleColor.RED, MarbleColor.GREEN];
        game.$patch({
          turn: Player.TWO,
          lastPosition: 12,
          pods: updated
        });
        expect(game.isTurnOver).toBe(true);
        const bankSpy = vitest.spyOn(game, 'bankMarbles');
        const clearSpy = vitest.spyOn(game, 'clearSlot');
        await game.nextTurn();
        expect(bankSpy).toHaveBeenCalledWith(Player.TWO, [MarbleColor.BLUE]);
        expect(bankSpy).toHaveBeenCalledWith(Player.TWO, [MarbleColor.RED, MarbleColor.GREEN]);
        expect(clearSpy).toHaveBeenCalledWith(12);
        expect(clearSpy).toHaveBeenCalledWith(0);
      });

      it('calls collectRemaining at end of game', async () => {
        const updated = game.pods;
        for (const slot in P1_SLOTS) {
          updated[slot] = [];
        }
        updated[9] = [MarbleColor.RED, MarbleColor.GREEN];
        game.$patch({
          turn: Player.ONE,
          lastPosition: 4,
          pods: updated
        });
        expect(game.isTurnOver).toBe(true);
        const collectSpy = vitest.spyOn(game, 'collectRemaining');
        await game.nextTurn();
        expect(game.isGameOver).toBe(true);
        expect(collectSpy).toHaveBeenCalledWith(Player.ONE);
        expect(collectSpy).toHaveBeenCalledWith(Player.TWO);
      });
    });
  });

})
