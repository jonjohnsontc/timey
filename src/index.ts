import { parse } from "https://deno.land/std@0.135.0/flags/mod.ts";
import { Notification } from "https://deno.land/x/deno_notify@1.3.1/ts/mod.ts";

import { calculateStartTime, secsToTime, Options, enc } from "./lib/utils.ts";
import { print } from "./lib/printer.ts";

let id: number | undefined; // used to track interval calls

function timer(startTime: number) {
  const notif = new Notification();
  notif.title("All Done!");
  notif.body(`Timer for ${secsToTime(startTime)} finished`);
  notif.soundName("Basso");

  if (!id) {
    id = setInterval(async () => {
      await print(secsToTime(startTime--), { returnCursor: true });
      // Straight printing the time
      // Deno.stdout.write(enc(`${secsToTime(startTime--)}\r`));

      // TODO:
      // If startTime is 0, there will still be 2 secs left.
      // -2 causes a char not valid error
      if (startTime <= -1 && id) {
        clearInterval(id);
        id = undefined;
        Deno.stdout.write(enc("\u001b[9B"));
        notif.show();
        alert("Done!");
        // TODO:Perhaps have the option to restart the timer?
      }
    }, 1000);
  }
}

function main() {
  const options: Options = parse(Deno.args);

  // TODO: None of the interactive logic has been implemented yet
  // Ideally, if someone doesn't provide a time, it should
  // load a TUI to prompt someone to edit the time.
  if (!options.d && !options.h && !options.m && !options.ms && !options.s) {
    console.log("Welcome to Timey!");
    console.log("Please enter how long you'd like to set the timer for");
    return;
  }
  const startTime = calculateStartTime(options);

  timer(startTime);
  setInterval(() => {
    if (!id) {
      Deno.exit();
    }
  });
}

main();
