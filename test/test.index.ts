import { assert } from "https://deno.land/std@0.135.0/testing/asserts.ts";

// TODO: Move somewhere else
Deno.test({
  name: "TimeSelect displays the cursor in the correct position",
  fn: async () => {
    const fileName = new URL("", import.meta.url).pathname;
    const actual = Deno.run({
      cmd: ["deno", "run", "-A", "--unstable", `${fileName}`, "-s", "2"],
      stdout: "piped",
    });

    const hi = await actual.output();
    const results = new TextDecoder().decode(hi);
    assert(results.includes("Done!"));
    actual.close();
  },
});
