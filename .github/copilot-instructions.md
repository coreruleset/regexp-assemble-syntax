# Copilot instructions for `regexp-assemble-syntax`

## Build, test, and lint

- `npm test` runs the full Extension Host suite.
- `npm run test:grammar` runs only the grammar/tokenization tests.
- `npm run test:extension` runs only the Extension Host language-association tests.
- Use the VS Code Extension Host launch config in `.vscode/launch.json` and press `F5` to open the extension in a new window for manual inspection.

## Architecture

- This repository is a small VS Code language extension for RegExp-Assemble files.
- `package.json` is the extension manifest. It registers the `ra` language, maps `.ra` and `.data` files to it, and points VS Code at `syntaxes/ra.tmLanguage.json`.
- `language-configuration.json` controls comment and folding behavior.
- `syntaxes/ra.tmLanguage.yaml` is the readable grammar source; `syntaxes/ra.tmLanguage.json` is the grammar consumed by VS Code.
- Most changes are declarative grammar/manifest updates rather than application code changes.

## Conventions

- Keep the YAML and JSON grammar files in sync when changing tokenization rules.
- Preserve the existing language id and scope names: `ra` and `source.ra`.
- Comments and folding markers are RegExp-Assemble specific: line comments use `##!`-style syntax, and folding markers use `##!>` / `##!<`.
- Grammar rules already distinguish assemble directives, `template`/`define`, `include`, block markers, strings, and regex tokens; extend those patterns instead of introducing a second parsing model.
- Match the existing file layout: manifest at the repo root, grammar under `syntaxes/`, and editor behavior in `language-configuration.json`.
