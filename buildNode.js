const esbuild = require('esbuild');
const esbuildPluginTsc = require('esbuild-plugin-tsc');

console.info('Building Node interpreter...');
console.time('Done in');
esbuild.build({
	entryPoints: [ 'src/index.js' ],
	outfile: 'dist/puréscript.bundle.node.js',
	tsconfig: 'tsconfig.json',
	bundle: true,
	ignoreAnnotations: false,
	plugins: [
		esbuildPluginTsc({
			force: true,
		}),
	],
}).then(_ => console.timeEnd('Done in'));
