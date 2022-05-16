const { build } = require('esbuild');
const { argv } = require('process');
const fnRoot = 'src/functions';

const [fnName, fnScope] = argv.slice(2, 4);

async function go() {
  const options = {
    entryPoints: [`${fnRoot}/${fnScope}/${fnName}.ts`],
    outfile: 'dist/app.js',
    minify: true,
    bundle: true,
    platform: 'node',
    target: 'node16',
    sourcemap: true,
    sourcesContent: false,
    metafile: false,
    tsconfig: 'tsconfig-build.json',
  };

  const d1 = Date.now();
  await build(options);
  const d2 = Date.now();
  console.log(`esbuild completed in ${d2 - d1}ms`);
}

go();
