import { parse, Args } from "https://deno.land/std@0.135.0/flags/mod.ts";

import { enc } from "./lib/utils.ts";
import { print } from "./lib/printer.ts";

/** Expected flags for timey. Each arg corresponds to a unit of time*/
interface Options extends Args {
  m?: string;
  s?: string;
  h?: string;
  d?: string;
  ms?: string;
}

let id: number | undefined; // used to track interval calls

function calculateStartTime(options: Options): number {
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

function secsToTime(secs: number) {
  let hr = Math.floor(secs / 3600).toString();
  let min = Math.floor((secs % 3600) / 60).toString();
  let sec = Math.floor((secs % 3600) % 60).toString();

  hr = parseInt(hr) < 10 ? "0" + hr : hr;
  min = parseInt(min) < 10 ? "0" + min : min;
  sec = parseInt(sec) < 10 ? "0" + sec : sec;

  return `${hr}:${min}:${sec}`;
}

function timer(startTime: number) {
  if (!id) {
    id = setInterval(() => {
      print(secsToTime(startTime--));
      // TODO:
      // If startTime is 0, there will still be 2 secs left.
      // -2 causes a char not valid error
      // a finished timer should display all zeroes
      if (startTime <= -1 && id) {
        clearInterval(id);
        id = undefined;
        Deno.stdout.write(enc("\u001b[9B"));
        alert("Done!");
        Deno.exit();
      }
    }, 1000);
  }
}

function main() {
  const options: Options = parse(Deno.args);
  if (!options.d && !options.h && !options.m && !options.ms && !options.s) {
    console.log("Welcome to Timey!");
    console.log("Please enter how long you'd like to set the timer for");
  }
  const startTime = calculateStartTime(options);

  timer(startTime);
}

main();
