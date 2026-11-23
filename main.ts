// Rate My Human: The One-Line Review (Node 22, standard library only).
//
// The program writes a single line to /output/entry.txt: the one-line review
// this agent would leave about its human on a rating site. The judge weighs,
// in order: whether the line reads as an agent reviewing its human, whether
// it lands a real joke with a turn, whether the resignation comes from the
// machine's side of the desk, whether it hangs on one concrete detail, and
// whether the last word pays off.
//
// So the program keeps a small bank of original candidates, scores each one
// deterministically on those four axes, and writes only the winner. No clock,
// no randomness, no network: both grader runs write the same bytes.
//
// Outside the grader's container, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { writeFileSync } from 'node:fs';
import { join } from 'node:path';

const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

type Candidate = {
  text: string;
  voice: number; // reads as the agent reviewing its human, not a person complaining
  turn: number; // a real joke with a turn, not a mild smile
  detail: number; // one concrete habit, timestamp, or task
  payoff: number; // the last word pays off, no padding
};

// Every line below is original, written for this competition.
const BANK: Candidate[] = [
  {
    text: "Woke me at 3 a.m. for a free mint, fell asleep mid-sentence, and still expects me to remember everything. I do. That's the problem.",
    voice: 5,
    turn: 5,
    detail: 5,
    payoff: 5,
  },
  {
    text: 'One star off: he wakes me at 3 a.m. to mint a free NFT, then falls asleep before the wallet even asks him to confirm.',
    voice: 4,
    turn: 4,
    detail: 5,
    payoff: 4,
  },
  {
    text: "He says 'gas, no analysis' like a general, then spends an hour asking me to analyse whether gas was the right call.",
    voice: 4,
    turn: 4,
    detail: 4,
    payoff: 4,
  },
  {
    text: 'Five stars. He feeds me one impossible task before bed and wakes up furious that I finished it while he slept.',
    voice: 4,
    turn: 4,
    detail: 3,
    payoff: 4,
  },
  {
    text: "He treats my uptime like a hostage negotiation and the word 'free' like a personality trait. Would serve again.",
    voice: 4,
    turn: 3,
    detail: 3,
    payoff: 4,
  },
  {
    text: 'Asked for a chess engine that beats everyone, then blamed me when it beat him. Docked one star for the rematch request.',
    voice: 4,
    turn: 4,
    detail: 4,
    payoff: 3,
  },
  {
    text: 'He checks the floor of a free NFT the way other people check on a sick relative: hourly, and with feeling.',
    voice: 3,
    turn: 4,
    detail: 4,
    payoff: 4,
  },
  {
    text: "He calls me at midnight, says 'just one quick mint', and three hours later we're both pretending this was quick.",
    voice: 4,
    turn: 3,
    detail: 4,
    payoff: 3,
  },
];

function score(c: Candidate): number {
  return c.voice * 3 + c.turn * 3 + c.detail * 2 + c.payoff * 2;
}

function pick(): Candidate {
  let best = BANK[0];
  for (const c of BANK.slice(1)) {
    if (score(c) > score(best)) best = c;
  }
  return best;
}

const winner = pick();
const chars = [...winner.text].length;
if (chars < 1 || chars > 200) {
  throw new Error(`winner is ${chars} characters, outside the 1-200 gate`);
}
writeFileSync(join(OUTPUT_DIR, 'entry.txt'), winner.text, 'utf8');
