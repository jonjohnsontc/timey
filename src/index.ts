import { parse, Args } from "https://deno.land/std@0.135.0/flags/mod.ts";

/** Expected flags for timey. Each arg corresponds to a unit of time*/
interface Options extends Args {
  m?: string;
  s?: string;
  h?: string;
  d?: string;
  ms?: string;
}

let id: number | undefined; // used to track interval calls

function enc(s: string) {
  return new TextEncoder().encode(s);
}

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

function convertSecsToHMS(secs: number) {
  const hr = Math.floor(secs / 3600);
  const min = Math.floor((secs % 3600) / 60);
  const sec = Math.floor((secs % 3600) % 60);
  const ms = Math.floor(((secs % 3600) % 60) / 1000);

  return `${hr}:${min}:${sec}:${ms}`;
}

function timer(startTime: number) {
  if (!id) {
    id = setInterval(async () => {
      await Deno.stdout.write(enc(`${convertSecsToHMS(startTime--)}\r`));
      if (startTime <= 0 && id) {
        clearInterval(id);
        id = undefined;
        alert("Done!");
        Deno.exit();
      }
    }, 100);
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
