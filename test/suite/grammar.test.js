const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vscodeTextmate = require('vscode-textmate');
const oniguruma = require('vscode-oniguruma');

const grammarPath = path.resolve(__dirname, '../../syntaxes/ra.tmLanguage.json');
const languageConfigurationPath = path.resolve(__dirname, '../../language-configuration.json');
let grammarPromise;

async function loadGrammar() {
  if (grammarPromise) {
    return grammarPromise;
  }

  const wasmPath = require.resolve('vscode-oniguruma/release/onig.wasm');
  const wasmBin = fs.readFileSync(wasmPath);
  await oniguruma.loadWASM(wasmBin.buffer.slice(wasmBin.byteOffset, wasmBin.byteOffset + wasmBin.byteLength));

  const registry = new vscodeTextmate.Registry({
    onigLib: Promise.resolve({
      createOnigScanner: (sources) => new oniguruma.OnigScanner(sources),
      createOnigString: (string) => new oniguruma.OnigString(string),
    }),
    loadGrammar: async (scopeName) => {
      if (scopeName !== 'source.ra') {
        return null;
      }

      return JSON.parse(fs.readFileSync(grammarPath, 'utf8'));
    },
  });

  grammarPromise = registry.loadGrammar('source.ra');
  return grammarPromise;
}

suite('Grammar and language configuration', () => {
  test('defines the expected comment and folding markers', () => {
    const configuration = fs.readFileSync(languageConfigurationPath, 'utf8');

    assert.match(configuration, /"lineComment":\s*"##!\(\?!\[<>=\]\)"/);
    assert.match(configuration, /"start":\s*"\^##!>"/);
    assert.match(configuration, /"end":\s*"\^##!<"/);
  });

  test('tokenizes line comments', async () => {
    const grammar = await loadGrammar();
    const result = grammar.tokenizeLine('##! comment');

    assert.ok(result.tokens.some((token) => token.scopes.includes('comment.line.ra')));
  });

  test('tokenizes block markers', async () => {
    const grammar = await loadGrammar();
    const result = grammar.tokenizeLine('##!> assemble');

    assert.ok(result.tokens.some((token) => token.scopes.includes('keyword.block.start')));
  });

  test('tokenizes regular expression groups', async () => {
    const grammar = await loadGrammar();
    const result = grammar.tokenizeLine('(foo)');

    assert.ok(result.tokens.some((token) => token.scopes.includes('string.regexp.group')));
  });
});
