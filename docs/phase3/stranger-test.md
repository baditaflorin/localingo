# Stranger Test

Test date: 2026-05-09

## Setup

- Fresh browser context.
- No existing IndexedDB state.
- Public commit API stubbed for deterministic browser automation.
- Tested workflow: complete a lesson, change settings, move state through export/share, inspect progress.

## Observations Before Fixes

1. The settings checkbox was not easy for the browser test to target semantically.
2. Export/share behavior existed in code after implementation but needed explicit success messaging and accessible selectors to be trustworthy.
3. Reset and import paths needed clearer language around what exactly moves or gets cleared.

## Fixes Applied

1. Added explicit accessible labels to settings toggles.
2. Added visible notices for copy/export/share actions.
3. Added clearer state-movement copy in the Progress workspace.

## Result

- A fresh user can now practice immediately, change meaningful settings, export JSON, copy JSON, and copy a share link without coaching.
- The app still shares only Localingo state, not arbitrary external learning formats. That limitation is now explicit rather than surprising.
