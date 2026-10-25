# Evaluator golden set (synthetic)

Every item here is a **synthetic example** made for testing the Reflection Companion. The notes, screens and organizations are invented. None of them are real BRIDGEGOOD participants, projects or partners.

- `index.ts` has each item's note, stage and expectations.
- `source/*.html` are the screens. `images/*.png` are those screens rendered at 480 × 820.
- `scripts/compare-evaluators.ts` runs the set against each model and prints the comparison. See `docs/gemma-prototype.md`, step 7.

To re-render a screen after editing its HTML (macOS, with Chrome installed):

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars --force-device-scale-factor=1 --window-size=480,820 --screenshot="$PWD/src/content/evaluator-goldens/images/contrast.png" "file://$PWD/src/content/evaluator-goldens/source/contrast.html"
```

When adding an item:
- Keep it synthetic and say so in the note.
- Seed one issue per item, and give it an expectation in `index.ts`.
