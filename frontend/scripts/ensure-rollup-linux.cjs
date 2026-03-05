const { execFileSync } = require('node:child_process');
const { platform, arch } = require('node:process');

if (platform !== 'linux' || arch !== 'x64') {
  process.exit(0);
}

const pkgName = '@rollup/rollup-linux-x64-gnu';

try {
  require.resolve(pkgName);
  process.exit(0);
} catch {
  // Continue and install below.
}

let rollupVersion;
try {
  rollupVersion = require('../node_modules/rollup/package.json').version;
} catch {
  // If rollup itself is missing, let the normal build fail with its own error.
  process.exit(0);
}

execFileSync('npm', ['install', '--no-save', `${pkgName}@${rollupVersion}`], {
  stdio: 'inherit',
});

require.resolve(pkgName);
