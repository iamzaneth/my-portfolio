# Editable pixel-cat sources

`manifest.json` and the eleven clip directories are the production source of truth.
Every PNG is a native 64×64 transparent frame. Use any lossless pixel editor;
keep alpha at 0 or 255 and use the 13 colors declared in the manifest.

The character has pointed ears, a long tail, a small head and narrow paws.
Light comes from above/left. Main fur is `B`; shadows use `D/S/O`, moonlit fur
`L/H/W`, ears/nose `P/R`, eyes `E/C/T`, and muzzle `M`. Eye glints are single
pixels; chest and hip highlights form connected clusters.

Standing, sitting and lying poses share the **lower boundary of source row 43**,
i.e. groundRow 44. Bounds are half-open: right/bottom are one past the final
painted pixel. Airborne running cells may end above that floor; do not move
them down to meet it.

Edit a frame, update its `visibleBounds` in the manifest, then run:

```sh
pnpm run assets:cat
pnpm run assets:cat:check
```

The generator validates dimensions, counts, palette, binary alpha, native pixel
detail, source bounds and the floor. It packs RGBA bytes without resizing or
quantization and generates the TypeScript catalog from the same manifest.
`catConfig.ts` owns playback timing and posture bridges independently of the art.

For an optional contact sheet and pixel audit, run `pnpm run assets:cat:review`.
These disposable outputs go under `artifacts/mascot/`.

See `public/mascot/ATTRIBUTION.md` for original provenance and the retained CC0 license.
