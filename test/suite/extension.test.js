const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const vscode = require('vscode');

function createTempFile(extension, contents) {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'regexp-assemble-syntax-'));
  const file = path.join(dir, `sample${extension}`);
  fs.writeFileSync(file, contents, 'utf8');
  return { dir, file };
}

suite('Extension Host', () => {
  test('registers the ra language', async () => {
    const languages = await vscode.languages.getLanguages();
    assert.ok(languages.includes('ra'));
  });

  test('associates .ra files with ra', async () => {
    const { dir, file } = createTempFile('.ra', '##!>');

    try {
      const document = await vscode.workspace.openTextDocument(vscode.Uri.file(file));
      assert.strictEqual(document.languageId, 'ra');
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  test('associates .data files with ra', async () => {
    const { dir, file } = createTempFile('.data', '##!>');

    try {
      const document = await vscode.workspace.openTextDocument(vscode.Uri.file(file));
      assert.strictEqual(document.languageId, 'ra');
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
