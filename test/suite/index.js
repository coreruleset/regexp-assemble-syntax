const fs = require('fs');
const path = require('path');
const Mocha = require('mocha');

function run() {
  const mocha = new Mocha({
    ui: 'tdd',
    color: true,
  });

  const testsRoot = __dirname;
  const allowedFiles = new Set(
    (process.env.TEST_FILES || '')
      .split(',')
      .map((file) => file.trim())
      .filter(Boolean)
  );

  for (const file of fs.readdirSync(testsRoot)) {
    if (file.endsWith('.test.js') && (allowedFiles.size === 0 || allowedFiles.has(file))) {
      mocha.addFile(path.resolve(testsRoot, file));
    }
  }

  return new Promise((resolve, reject) => {
    mocha.run((failures) => {
      if (failures > 0) {
        reject(new Error(`${failures} test(s) failed.`));
      } else {
        resolve();
      }
    });
  });
}

module.exports = { run };
