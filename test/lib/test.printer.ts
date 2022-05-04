import { assert } from "https://deno.land/std@0.135.0/testing/asserts.ts";
import { parse } from "https://deno.land/std@0.135.0/flags/mod.ts";

import { print } from "../../src/lib/printer.ts";

const args = parse(Deno.args);

if (args.c) {
  await print("00:00:00", {
    cursor: true,
    cursorOpts: { cursorPos: args.cp, cursorMarker: args.cm },
    returnCursor: false,
  });
} else {
  await print("00:00:00", { cursor: false, returnCursor: false });
}

Deno.test({
  name: "print correctly prints out a time, and optionally, a cursor",
  async fn() {
    const fileName = new URL("", import.meta.url).pathname;
    const noCursorResult = Deno.run({
      cmd: ["deno", "run", "-A", `${fileName}`],
      stdout: "piped",
    });

    const noCursorOutput = await noCursorResult.output();
    const noCursorAsString = new TextDecoder().decode(noCursorOutput);
    noCursorResult.close();

    // TODO: I don't think I've included enough text here
    assert(
      noCursorAsString.includes(
        `  ■■■■■■    ■■■■■■              ■■■■■■    ■■■■■■              ■■■■■■    ■■■■■■  `
      )
    );

    const cursorResult = Deno.run({
      cmd: ["deno", "run", "-A", `${fileName}`, "-c", "-cp", "1", "-cm", "^^"],
      stdout: "piped",
    });

    cursorResult.close();
  },
});
