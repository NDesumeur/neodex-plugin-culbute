# Tumble

A pixel art skill game: a water bottle jumps from furniture to furniture in a living room, spinning as it goes. It must always land upright.

*Version française : [README.md](README.md)*

## Controls

- **Space**, **↑** or **click**: hold to charge the jump, release to throw the bottle.
- **In the air**, hold again: the bottle spins twice as fast.
- **P** or **Esc**: pause (not mid-jump).

## How it works

- The longer you hold, the **further and higher** the jump. The gauge next to the bottle and white dots show the whole jump; the yellow dot marks where it lands.
- In the air, the bottle spins slowly by itself. **Holding** makes it spin faster: judge it so it has made one turn (or two) when it arrives.
- It must land **upright** on top of a piece of furniture, within 40°. Almost straight (within 11°) is **PERFECT**: points count double.
- Jumping **over** a piece of furniture to reach the next scores more. Each flip landed in a row adds a bonus.
- If it lands back on the starting piece, nothing is lost. If it **tips over** or falls **on the floor**, the game is over.
- Tables, stools, stacks of books, chests and crates: furniture gets smaller and further apart as you go. A number marks every tenth piece.

## Stats

The Records panel keeps your **best score**, the number of **games**, **flips** and **perfect** flips.

## Data and sync

Your best score and totals are saved by NeoDex, backed up and synced between your PCs if sync is on.

## Install

In NeoDex: **NeoStore → Discover → Tumble → Install**.

Making a plugin: see the [NeoDex SDK](https://github.com/NDesumeur/neodex-sdk).
