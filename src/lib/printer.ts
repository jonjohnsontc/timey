import { enc } from "./utils.ts";
import { charTable } from "./charMap.ts";

export type PrintOptions = {
  marginLeft?: number;
  marginRight?: number;
  marginTop?: number;
  marginBottom: number;
};

export function print(chars: string, _printOptions?: PrintOptions) {
  const fontHeight = 8; // TODO: Should be coupled to the charmap used
  const margin = (num: number) => "".padEnd(num, " ");

  const marginLeft = margin(2);
  const marginRight = margin(2);

  for (let row = 0; row < fontHeight; row++) {
    for (const char of chars) {
      const c = charTable.get(char);
      if (!c) {
        throw Error(`Char not valid, you provided: '${char.charCodeAt(0)}'`);
      }

      Deno.stdout.write(enc(marginLeft));
      Deno.stdout.write(enc(c[row]));
      Deno.stdout.write(enc(marginRight));
    }
    Deno.stdout.write(enc("\n"));
  }
  Deno.stdout.write(enc("\r"));
  Deno.stdout.write(enc("\u001b[8A")); // returns us to the first row
}
