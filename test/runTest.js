const path = require('path');
const { runTests } = require('@vscode/test-electron');

async function main() {
  const testFiles = process.argv.slice(2).filter(Boolean);
  if (testFiles.length > 0) {
    process.env.TEST_FILES = testFiles.join(',');
  }

  const extensionDevelopmentPath = path.resolve(__dirname, '..');
  const extensionTestsPath = path.resolve(__dirname, 'suite', 'index');

  await runTests({
    extensionDevelopmentPath,
    extensionTestsPath,
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
