<template>
    <div class="p-2 font-serif">
        <h1 class="text-2xl subpixel-antialiased text-center underline underline-offset-4 mb-4">Mancala</h1>
        <h2 class="font-bold mt-4">What is it?</h2>
        <p>
            Mancala is a two-player turn-based game, usually played with a board consisting of a series of "pits" 
            which hold stones or seeds.  Additionally there are two larger pits called the "store", one for each player, 
            where the player will capture the stones.  The game dates back 
            <a class="underline text-blue-600" href="https://en.wikipedia.org/wiki/Mancala" target="_blank">past the 3rd century</a> and has many 
            rule variations, but this impelmentation of the game follows common rules described below.
        </p>
        <h3 class="font-bold mt-4">Board setup</h3>
        <p>
            The game consists of 48 stones evenly distributed among 12 pits (4 stones per pit).  The two player 
            stores are empty when the game begins.  
        </p>
        <h3 class="font-bold mt-4">Starting the game</h3>
        <p>
            Player 1 (sometimes the youngest player goes first, but you can choose another method) begins by picking up 
            all of the stones from any pit on their side of the board.  The player then distributes one marble in the 
            next pit in counter-clockwise direction until all of the marbles are placed.  If the player reaches their 
            own store, the player captures a stone to increase their score.  When reaching the opponent's store, the store 
            is skipped over.  
        </p>
        <p>
            When the last stone of the hand has been placed, the next action depends on where you land:
        </p>
        <dl class="mt-4 ml-4">
            <dt class="font-bold">Land in own store</dt>
            <dd class="ml-4">If a player lands in their own store, they can pick again from any pit with one or more stones on their side.</dd>
            <dt class="font-bold">Land in pit on own side</dt>
            <dd class="ml-4">When the player lands in a pit on their own side, they capture that stone and all stones in the pit immediately 
                across the board from the opponent's pit.
            </dd>
            <dt class="font-bold">Land in pit on opponent side</dt>
            <dd class="ml-4">When the player lands in a pit on the opponent side their turn is over.</dd>
        </dl>
        <h3 class="font-bold mt-4">Ending the game</h3>
        <p>
            The game ends when a player's turn ends and either side of the board has no stones in any of the pits.
            If a side has remaining stones, the player who owns that side adds them to their store.  The player 
            with the most stones at the end of the game is the winner.
        </p>
        <h2 class="font-bold mt-4">Other variations</h2>
        <p>
            There are many other variations of Mancala.  You can read more about the history of the game and other 
            ways to play on the game's 
            <a class="underline text-blue-600" href="https://en.wikipedia.org/wiki/Mancala" target="_blank">wikipedia entry</a>.
        </p>
        <hr class="my-8">
        <p>
            View the project on <a class="underline text-blue-600" href="https://github.com/jwmickey/mancala" target="_blank">GitHub</a>
        </p>
    </div>
</template>