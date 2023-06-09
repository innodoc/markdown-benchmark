import fs from "fs/promises";
import path from "path";

import Benchmark from "benchmark";
import makeParsers from "./parsers.js";

function htmlDoc(html) {
  return `<html><head></head><body>${html}</body></html>`;
}

async function runBenchmark() {
  const markdown = (await fs.readFile("markdown.md")).toString();
  const parsers = await makeParsers();
  const names = Object.keys(parsers);
  const results = Object.fromEntries(names.map((name) => [name, {}]));
  const htmlResults = {};

  await new Promise((resolve) => {
    const benchmark = new Benchmark.Suite("Markdown parsers")
      .on("error", (event) => {
        results[event.target.name].error = event.target.error.message;
      })
      .on("cycle", (event) => {
        results[event.target.name].benchmark = event.target;
      })
      .on("complete", resolve);

    for (const name of names) {
      benchmark.add(
        name,
        () => {
          htmlResults[name] = parsers[name](markdown);
        },
        { maxTime: 10 }
      );
    }

    benchmark.run();
  });

  // Save HTML result
  for (const [name, html] of Object.entries(htmlResults)) {
    await fs.writeFile(path.join("html", `${name}.html`), htmlDoc(html));
  }

  // Sort by ops/sec
  const sortedResults = Object.fromEntries(
    Object.entries(results)
      .sort((a, b) => b[1].benchmark.hz - a[1].benchmark.hz)
      .map(([name, { benchmark }]) => [
        name,
        {
          ops: Benchmark.formatNumber(benchmark.hz.toFixed(0)),
          rme: benchmark.stats.rme.toFixed(2),
          runs: benchmark.stats.sample.length.toString(),
        },
      ])
  );

  const maxNameLength = Math.max(...names.map((name) => name.length));
  const max = (attr) =>
    Math.max(
      ...Object.values(sortedResults).map((stats) => stats[attr].length)
    );
  const maxOpsLength = max("ops");
  const maxRmeLength = max("rme");
  const maxRunsLength = max("runs");

  for (const [name, { ops, rme, runs }] of Object.entries(sortedResults)) {
    console.log(
      `${name.padEnd(maxNameLength)}  ${ops.padStart(
        maxOpsLength
      )} ops/sec \xb1${rme.padStart(maxRmeLength)}%  (${runs.padStart(
        maxRunsLength
      )} runs sampled)`
    );
  }
}

runBenchmark();
