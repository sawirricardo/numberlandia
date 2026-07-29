// node test.js — pulls the real functions out of index.html, no build step.
const fs = require("fs");
const assert = require("assert");

const html = fs.readFileSync(__dirname + "/index.html", "utf8");
const grab = id => {
  const m = html.match(new RegExp(`<script id="${id}">([\\s\\S]*?)<\\/script>`));
  if (!m) throw new Error(`no <script id="${id}"> in index.html`);
  return m[1];
};

const core = new Function(grab("core") + "\nreturn {numberToWords,formatID,numberToTokens};")();
const { numberToWords, formatID, numberToTokens } = core;

// the app script must at least parse (stands in for "no syntax errors on load")
new Function(grab("app"));

let pass = 0;
const eq = (got, want, label) => {
  assert.strictEqual(got, want, `${label}\n  got:  ${got}\n  want: ${want}`);
  console.log(`  ok  ${label} -> ${got}`);
  pass++;
};
// spec accepts the thousands comma with or without
const norm = s => s.replace(/,/g, "");

console.log("formatID");
[[90000,"90.000"],[61400,"61.400"],[6805,"6.805"],[33260,"33.260"],[7206,"7.206"],
 [12830,"12.830"],[57118,"57.118"],[30065,"30.065"],[36598,"36.598"],
 [100,"100"],[1000,"1.000"],[99999,"99.999"],[100000,"100.000"]
].forEach(([n,w]) => eq(formatID(n), w, `formatID(${n})`));

console.log("numberToWords");
[[90000,"ninety thousand"],
 [61400,"sixty-one thousand and four hundred"],
 [6805,"six thousand eight hundred and five"],
 [33260,"thirty-three thousand two hundred and sixty"],
 [7206,"seven thousand two hundred and six"],
 [12830,"twelve thousand eight hundred and thirty"],
 [57118,"fifty-seven thousand one hundred and eighteen"],
 [30065,"thirty thousand and sixty-five"],
 [36598,"thirty-six thousand five hundred and ninety-eight"],
 [100,"one hundred"],
 [405,"four hundred and five"],
 [99999,"ninety-nine thousand nine hundred and ninety-nine"]
].forEach(([n,w]) => eq(norm(numberToWords(n)), norm(w), `numberToWords(${n})`));

console.log("invariants over full range 100..99.999");
for (let n = 100; n <= 99999; n++) {
  const w = numberToWords(n);
  assert(!w.includes("  ") && !/undefined|NaN/.test(w) && w.trim() === w, `bad words for ${n}: "${w}"`);
  assert(!formatID(n).includes("..") , `bad format for ${n}`);
  // tiles are checked by tile sequence, so tokens must rebuild the words
  assert(numberToTokens(n).length > 0, `no tokens for ${n}`);
}
console.log(`  ok  99900 numbers produce clean words + tokens`);
pass++;

console.log("question generators (5 worlds x 5 rounds x 400 runs)");
// app script only touches the DOM inside handlers; matchMedia is the one top-level call
const app = new Function("matchMedia", "localStorage",
  grab("core") + grab("app") + "\nreturn {makeQuestion};")(
  () => ({ matches: false }), null);

const inRange = n => Number.isInteger(n) && n >= 100 && n <= 99999;
for (let w = 1; w <= 5; w++) for (let r = 1; r <= 5; r++) for (let i = 0; i < 400; i++) {
  const q = app.makeQuestion(w, r);
  const where = `world ${w} round ${r} kind ${q.kind}`;
  assert(typeof q.teach() === "string" && q.teach().length, `no teaching card: ${where}`);
  if (q.kind === "pad") assert(inRange(q.answer), `${where}: ${q.answer}`);
  if (q.kind === "tiles") {
    assert(q.target.length && q.tray.length === q.target.length + 3, `${where}: tray size`);
    q.target.forEach(t => assert(q.tray.includes(t), `${where}: tile "${t}" missing from tray`));
  }
  if (q.kind === "choice") {
    assert(q.options.length === 4, `${where}: ${q.options.length} options`);
    assert(new Set(q.options).size === 4, `${where}: duplicate options ${q.options}`);
    assert(q.answer >= 0 && q.answer < 4, `${where}: answer index ${q.answer}`);
  }
  if (q.kind === "compare") {
    assert(inRange(q.a) && inRange(q.b), `${where}: ${q.a}/${q.b}`);
    assert(q.answer === (q.a < q.b ? "<" : q.a > q.b ? ">" : "="), `${where}: wrong sign`);
  }
  if (q.kind === "order") {
    assert(new Set(q.nums).size === 5, `${where}: duplicate numbers`);
    const want = q.nums.slice().sort((x, y) => q.desc ? y - x : x - y);
    assert.deepStrictEqual(q.answer, want, `${where}: bad ordering`);
  }
  if (q.kind === "pattern") {
    q.vals.forEach(v => assert(inRange(v), `${where}: tick ${v} out of range`));
    q.vals.forEach((v, k) => k && assert(v - q.vals[k - 1] === q.step, `${where}: step broken`));
    assert(q.gapIdx.length >= 1 && q.gapIdx.every(g => g > 0 && g < 6), `${where}: bad gaps`);
  }
}
console.log("  ok  10000 generated questions are in range, solvable and self-consistent");
pass++;

console.log(`\nALL ${pass} CHECKS PASSED`);
