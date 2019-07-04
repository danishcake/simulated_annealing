# Simulated Annealing Room allocation
A colleague asked me how I would solve the problem of allocating students to rooms while maximising the number of
friends they share a room with. He hadn't heard of my suggestion of simulated annealing, so this is a quick boshed out
example to attempt to demonstrate the principle to him.

## What this does
* A problem of people and rooms is deserialised. This has a random allocation.
* Ten passes are made to optimise the allocation. Each pass will perform 100,000 'cooling steps'
* Each cooling step randomly mutates the state by moving a couple of people.
* An error metric for the new state is calculated. This is the sum of the squares of friends not sharing rooms.
* If the error metric decreases the change is accepted. This is analogous to a cooling metal arranging itself into a lower energy arrangement in the annealing process.
* If the error metric increases the change is accepted with a probability that decreases over the 100,000 steps. Initially the acceptance probability is high, but it decreases to near zero on the last iteration.
* Finally, the lowest error configuration encountered during each annealing is selected.
* This best answer is used as the input for the next annealing cycle.

## Typical output
```
Initial error: 1262
0% Error metric: 700
10% Error metric: 700
20% Error metric: 670
30% Error metric: 670
40% Error metric: 670
50% Error metric: 670
60% Error metric: 669
70% Error metric: 669
80% Error metric: 669
90% Error metric: 669
Optimised error: 669
```


## Build process
Run `yarn` in the project root to obtain dependencies.
Run `yarn run build` to compile the typescript. This can then be run with `node ./dist/index.js`.

If you use Visual Studio Code `control-b` will build, while `F5` will debug.

## TODO
* Figure out why I needed to add dom to libs in tsconfig to get a console definition
