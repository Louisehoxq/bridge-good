# BridgeGoodx demo video: recording plan

> **Status: recorded, 2026-10-25.** All seven scenes exist and `docs/demo/bridgegoodx-demo.mp4` is 1:55. Scenes 3 and 4 use hand-written synthetic sample responses (labelled on screen as a recorded sample), because no live model was available: see [Recording AI scenes](#recording-ai-scenes). The rest of this page is the original plan. Script: [video-script.md](video-script.md). Goal: seven clips recorded **in parallel by seven agents**, all identical in format, then joined into a 2:00 video. No human screen recording.

## How parallel recording stays standard

Agents don't drive a screen. Each writes and runs a short Playwright script against **one shared server**, using **one shared helper**, so every clip has the same size, frame rate, cursor, captions and pacing. The helper and the seed states are built first, by the orchestrator (this session), so agents can't diverge.

| What | Standard |
|---|---|
| Server | One production build (`npm run build && PORT=4400 npm start`), started once. Never `npm run dev` (slow first load, HMR flashes). All agents hit `http://localhost:4400`. |
| Browser | Playwright Chromium, headless, 1920×1080, `deviceScaleFactor` 1, light mode, locale `en-US`, timezone `Europe/London`, `reducedMotion: no-preference` (the hero title loops). |
| Isolation | One **fresh browser context per agent**. Cookies and `localStorage` are per context, so parallel scenes can't see or change each other's demo data. |
| Starting state | Each scene loads a read-only Playwright `storageState` from `docs/demo/state/`, made by `prepare-state.mjs` (below). Scenes never depend on another scene having run. |
| Recording | Playwright `recordVideo` at 1920×1080, then normalized by ffmpeg to 30 fps, H.264, yuv420p, with a 0.3 s fade at each end. |
| Cursor and clicks | The helper injects a visible cursor and a click ripple, and moves the pointer in eased steps, so clips look hand-driven and the same. |
| Timing | The helper exposes `pause(ms)`, `hold(ms)` and a scene clock. A scene declares a **time budget**; the helper trims or pads the clip to exactly that length and fails the run if the content overruns by more than 1 s. |
| Captions | See below. |

"At the same time": the seven agents start together once the server, helper and states exist. Because every scene is independent and the server is shared, there is no clock to synchronize; the only shared resource is the AI provider (see [Risks](#risks)).

## Files

```
scripts/demo/
  lib.mjs               shared helper: context, cursor, captions, pacing, trim to budget
  prepare-state.mjs     builds the seed states and the reply code (run once)
  scenes/
    01-hook.mjs … 07-reply-close.mjs     one per agent
  assemble.sh           normalize, concatenate, write captions.srt, output demo.mp4
docs/demo/
  video-script.md  recording-plan.md
  state/            storageState json + meta.json (reply code)   (generated, git-ignored)
  clips/            01-hook.mp4 … 07-reply-close.mp4 + .srt        (generated)
  bridgegoodx-demo.mp4 + .srt                                      (the result)
```

Each scene exports `{ id, budgetSeconds, run(page, { caption, pause, hold, goto }) }`, so the helper does all the plumbing and an agent only writes the steps.

## Seed states (built first, once)

`prepare-state.mjs` drives the real app and saves what it needs, so later scenes need no setup:

1. **`fresh`**: no login, empty data (scenes 1, 2, 5).
2. **`apprentice`** and **`partner`**: logged in, empty data (scenes 3, 4).
3. **`eastside-sent`**: Eastside's kit feedback filled in from the paste table in [demo-script.md](../demo-script.md#text-to-paste) and sent. The reply code goes to `meta.json`. **`steward-before`** is this state logged in as the steward (scene 6).
4. **`eastside-decided`**: from `eastside-sent`, the steward accepts it with the reason from the paste table, logged out again (scene 7, which needs the reply code from `meta.json`).

States 3 and 4 are why scene 6 can record the decision while scene 7 shows the outcome, with no ordering between the two agents.

## Captions

The helper's `caption(text, seconds)` shows a high-contrast bar at the bottom of the page (Bridge Studio font, at least 4.5:1 contrast, 1–2 lines, at most about 70 characters a line) **inside the recorded page**, so captions are burned in and always line up with the action. The helper also logs each caption's start and end, and `assemble.sh` turns those logs into per-clip and full `.srt` files for the player's caption toggle. No `libass` needed. Narration text is in the script if a voice-over is added later; it is not part of the first cut.

Rules: caption the *point*, not the click ("It asks about the pre-ticked box"); leave a caption up long enough to read at 15 characters a second; keep the AI label in frame.

## The agents

Seven agents, one per scene, started together. Each gets the same brief template plus its scene's section of the script.

**Brief (all agents):**
1. Read `docs/demo/video-script.md` (your scene), `docs/demo/recording-plan.md`, and `scripts/demo/lib.mjs`.
2. Write only `scripts/demo/scenes/<id>.mjs`. Do **not** edit `lib.mjs`, other scenes, app code or docs. If the helper blocks you, report it instead of working around it.
3. Run it: `node scripts/demo/run-scene.mjs <id>`. It writes `docs/demo/clips/<id>.mp4` and `.srt`.
4. Check your own clip: extract one frame every 2 seconds with ffmpeg into a contact sheet, read it, and confirm the scene's "Show" list, the captions, the AI label (scenes 3 and 4) and the length (within the budget). Re-record up to three times.
5. Use only the synthetic text from the repo. Never type a real key, email or personal detail. Don't touch `.env.local`.
6. Report: the clip path, its length, what you checked, and anything you couldn't make work.

Scene-specific notes:

| Scene | Agent notes |
|---|---|
| 01-hook | Wait for the title to start looping (about 2 title cycles). Slow scroll; don't skip the "BRIDGEGOOD authors it" band. |
| 02-library | Click one practice choice; confirm reasoning appears and no score does. |
| 03-companion | Live AI. Upload `consent.png`, paste the companion note. Allow up to 25 s for the review, and trim the wait with a caption over it rather than dead air. If the model errors twice, save the failure frame and report; don't fake output. |
| 04-scoping | Live AI. One short synthetic need. Show the required "people you serve" field. Same failure rule as scene 3. |
| 05-community | The map loads tiles from the network; wait for it to settle before the caption. The chapter list must be on screen too, since the map is an enhancement. |
| 06-steward | Start from `steward-before`. Use the mouse (the keyboard-only version is for the live pitch), but make focus rings visible when they appear. |
| 07-reply-close | Start from `eastside-decided`; read the code from `meta.json`. End on the end card (a static page the helper renders, not an app page). |

## Assembly (after all seven report)

`assemble.sh` normalizes each clip, concatenates them in order, builds `bridgegoodx-demo.mp4` and `.srt`, and prints the total. Target 1:50–2:00. The orchestrator then reviews a contact sheet of the full video, and any scene that misses is re-run alone (a single agent, a single script) and the assemble step repeated. Nothing else changes.

## Order of work

1. **Orchestrator:** write `lib.mjs`, `run-scene.mjs`, `prepare-state.mjs`, `assemble.sh`; build and start the server; run `prepare-state.mjs`; record a throwaway test clip to check size, fps, cursor and captions.
2. **Seven agents in parallel:** scenes 1–7.
3. **Orchestrator:** review clips, assemble, check length, fix or re-run weak scenes.
4. Update `CHANGELOG.md` ("Unreleased") and add `docs/demo/` and the git-ignored folders to the docs in the same PR.

## Risks

| Risk | Plan |
|---|---|
| Two AI scenes at once hit one free-tier key | Scenes 3 and 4 use different endpoints but may share a provider. Retry once after 20 s. If limits persist, start scene 4 after scene 3 finishes; every other scene is unaffected. |
| AI output differs on each take | Re-record until the review shows the consent-box question and "What I can't judge". Keep the accepted run's transcript next to the clip. If a live run can't be had, replay the saved response and say "recorded run" in a caption. Never invent output. |
| The map tiles are slow | Scene 5 waits for the map, and the list works without it. |
| A clip overruns its budget | The helper fails the run; the agent shortens its pauses or captions. |
| Clips differ in look | Only the shared helper creates contexts, so they can't. |
| Real data leaks into a frame | Synthetic text only, a clean profile per scene, and a final review of the contact sheet. |

## Open choices

- **Voice-over:** captions only for the first cut, or add text-to-speech from the narration lines?
- **Live vs saved AI:** the plan records live and keeps a saved response as a fallback. Say if you want saved-only for stable re-takes.
- **Extra output:** per-scene clips are kept in `docs/demo/clips/` for README or pitch snippets.

## Recording AI scenes

Neither live model worked on 2026-10-25 (the Anthropic key was rejected or had no credit, and Gemma's replies were unreadable to the app after about a minute: see the backlog). Scenes 3 and 4 therefore intercept only `POST /api/reflect` and `POST /api/scope` in the browser and answer with the samples in `scripts/demo/samples/`, shaped like the real stream. The page, loader and forms are the real app, and a badge or caption on screen says "Recorded sample response, not a live model call". When a live model works, re-record just those scenes with the interception removed.

## Re-recording one scene

```bash
npm run build && PORT=4400 npm start        # once
node scripts/demo/prepare-state.mjs          # once; writes docs/demo/state
node scripts/demo/run-scene.mjs 03-companion # one scene
scripts/demo/assemble.sh                     # rebuild docs/demo/bridgegoodx-demo.mp4
```

The first page load of a clip is trimmed so a clip starts on the page, not a blank screen.
