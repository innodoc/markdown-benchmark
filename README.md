# Markdown parser benchmark

Benchmark different Markdown parsers in Node.js.

## Running the benchmark

```
$ pnpm install && pnpm run benchmark
```

## Results

2023 April results on AMD Ryzen 5 3600 6-Core Processor

```
markdownWasm  18,202 ops/sec ±0.12%  (191 runs sampled)
remarkable     9,171 ops/sec ±0.24%  (188 runs sampled)
commonmark     6,877 ops/sec ±0.27%  (189 runs sampled)
markdownIt     5,538 ops/sec ±0.19%  (189 runs sampled)
marked         2,950 ops/sec ±0.20%  (188 runs sampled)
markdoc        1,260 ops/sec ±0.44%  (180 runs sampled)
showdown         614 ops/sec ±0.40%  (182 runs sampled)
micromark        229 ops/sec ±0.55%  (173 runs sampled)
remark           164 ops/sec ±0.60%  (163 runs sampled)
```
