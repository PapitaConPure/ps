import chalk from 'chalk';

async function buildIt() {
	console.log(chalk.italic.gray('Building Browser Bundle...'));
	await Bun.build({
		entrypoints: [ './src/index.ts' ],
		outdir: './dist',
		target: 'browser',
		minify: true,
		naming: '[dir]/puréscript.bundle.js',
	});
	console.log(chalk.greenBright('Done.'));
}

buildIt();
