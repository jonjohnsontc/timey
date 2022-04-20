import { Args } from "https://deno.land/std@0.135.0/flags/mod.ts";
import { assert } from "https://deno.land/std@0.135.0/testing/asserts.ts";

/** Expected flags for timey. Each arg corresponds to a unit of time*/
export interface Options extends Args {
  m?: string;
  s?: string;
  h?: string;
  d?: string;
  ms?: string;
}

export function enc(s: string): Uint8Array {
  return new TextEncoder().encode(s);
}

export function calculateStartTime(options: Options): number {
  let time = 0;
  if (options.s) {
    time += parseInt(options.s);
  }
  if (options.m) {
    time += parseInt(options.m) * 60;
  }
  if (options.h) {
    time += parseInt(options.h) * 60 * 60;
  }
  if (options.d) {
    time += parseInt(options.d) * 60 * 60 * 24;
  }
  if (options.ms) {
    time += parseInt(options.ms) / 1000;
  }
  return time;
}

Deno.test({
  name: "calculateStartTime calculates the correct number of seconds",
  fn(): void {
    const expectedMins = 480;
    const actualMins = calculateStartTime({ _: [], m: "8" });
    assert(expectedMins === actualMins);

    // Avengers Endgame: 3h 1m === 10,860 secs
    const expectedHrMinSec = 10_860;
    const actualHrMinSec = calculateStartTime({ _: [], h: "3", m: "1" });
    assert(expectedHrMinSec === actualHrMinSec);
  },
});

export function secsToTime(secs: number) {
  let hr = Math.floor(secs / 3600).toString();
  let min = Math.floor((secs % 3600) / 60).toString();
  let sec = Math.floor((secs % 3600) % 60).toString();

  hr = parseInt(hr) < 10 ? "0" + hr : hr;
  min = parseInt(min) < 10 ? "0" + min : min;
  sec = parseInt(sec) < 10 ? "0" + sec : sec;

  return `${hr}:${min}:${sec}`;
}

Deno.test({
  name: "secsToTime converts number of secs to what we think",
  fn(): void {
    const expectedTime1 = "03:01:00";
    const actualTime1 = secsToTime(10_860);
    assert(expectedTime1 === actualTime1);
  },
});
