# Prototype 0.17.1 — explicit starter clothing and stick-figure handoff

Prototype 0.17.1 makes clothing intent explicit so a planning stick figure is not mistaken for an unclothed finished character.

## Changes

- all six starter characters now include concrete hair, eye, and outfit defaults;
- school-age starters use explicit school uniforms and adult/background starters use ordinary full everyday clothing;
- AI handoff states that stick figures control pose/placement only and do not define clothing state;
- explicit character outfit guidance has priority, with ordinary scene-appropriate clothing as the fallback when no outfit is authored;
- render-brief cross-model hints expose the same clothing interpretation contract;
- regression validation checks starter appearance completeness and the no-nudity-inference handoff wording.

## Documentation

Current workflow is synchronized in `docs/USER-GUIDE.md`, `docs/PRODUCT.md`, `docs/PROMPT_HANDOFF.md`, and the public `/guide.html`.
