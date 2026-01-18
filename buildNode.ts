import chalk from 'chalk';
import { build } from 'esbuild';
import esbuildPluginTsc from 'esbuild-plugin-tsc';
import { readFileSync } from 'fs';
import { sizeof } from 'sizeof';

let startTime: number;

//Browser
console.info(chalk.italic.gray('Building browser interpreter...'));
startTime = performance.now();
build({
	entryPoints: [ 'src/index.js' ],
	outfile: 'dist/puréscript.bundle.js',
	globalName: 'PuréScript',
	platform: 'browser',
	bundle: true,
	minify: true,
}).then(_ => {
	const timespan = performance.now() - startTime;
	const title = chalk.bold.bgYellowBright.black(' Browser '.padEnd(20));
	const sizeResult = chalk.blueBright(`${sizeof(readFileSync('./dist/puréscript.bundle.js', { encoding: 'utf-8' }), true)} in size`);
	const timeResult = chalk.greenBright(`Done in ${timespan.toFixed(0)}ms`);
	console.info(`${title}\n${sizeResult}\n${timeResult}`);
});

//Node
console.info(chalk.italic.gray('Building Node interpreter...'));
startTime = performance.now();
build({
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
}).then(_ => {
	const timespan = performance.now() - startTime;
	const title = chalk.bold.bgRed.whiteBright(' Node '.padEnd(20));
	const sizeResult = chalk.blueBright(`${sizeof(readFileSync('./dist/puréscript.bundle.node.js', { encoding: 'utf-8' }), true)} in size`);
	const timeResult = chalk.greenBright(`Done in ${timespan.toFixed(0)}ms`);
	console.info(`${title}\n${sizeResult}\n${timeResult}`);
});
