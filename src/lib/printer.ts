import { enc } from "./utils.ts";
import { charTable } from "./charMap.ts";

export type PrintOptions = {
  returnCursor: boolean;
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
  marginBottom?: number;
  cursor?: boolean;
  cursorOpts?: {
    cursorPos: 0 | 1 | 2 | 3 | 4 | 5;
    cursorMarker: string;
  };
};

// I don't know that being async matters for this program
export async function print(chars: string, printOptions: PrintOptions) {
  const fontHeight = 8; // TODO: Should be coupled to the charmap used
  const margin = (num: number) => "".padEnd(num, " ");

  const marginLeft = margin(2);
  const marginRight = margin(2);

  for (let row = 0; row < fontHeight; row++) {
    for (const char of chars) {
      // TODO: This should be guarded against outside of this func
      // If the character is negative, that means the timer has
      // hit a negative number, and so nothing else should
      // need to be printed.
      if (char === "-") {
        return;
      }
      const c = charTable.get(char);
      if (!c) {
        throw Error(
          `Char not valid, you provided a character at code: '${char.charCodeAt(
            0
          )}'`
        );
      }

      await Deno.stdout.write(enc(marginLeft));
      await Deno.stdout.write(enc(c[row]));
      await Deno.stdout.write(enc(marginRight));
    }
    await Deno.stdout.write(enc("\n"));
  }
  if (printOptions.cursor && printOptions.cursorOpts) {
    const line = "      ";
    let char: string;
    for (let i = 0; i < 6; i++) {
      if (i === printOptions.cursorOpts.cursorPos) {
        char = printOptions.cursorOpts.cursorMarker;
      } else {
        char = line;
      }
      await Deno.stdout.write(enc(marginLeft));
      await Deno.stdout.write(enc(char));
      await Deno.stdout.write(enc(marginRight));
    }
    await Deno.stdout.write(enc("\n"));
  }
  if (printOptions.returnCursor) {
    await Deno.stdout.write(enc("\r"));
    await Deno.stdout.write(enc("\u001b[8A")); // returns us to the first row
  }
}
