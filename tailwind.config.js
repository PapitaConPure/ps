/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./docs/**/*.{html,js}"],
	theme: {
		extend: {
			colors: {
				foreground: '#ffffff',
				background: '#151b1d',
				code: {
					hl: {
						select : '#373e48',
						error  : '#50200c',
					},
					neutral  : '#dddddd',
					stmt     : '#ff972f',
					expr     : '#bf819e',
					ctrl     : '#ea7500',
					type     : '#afd095',
					value    : '#ff6d6d',
					text     : '#e8f2a1',
					symbol   : '#b4c7dc',
					function : '#ffff6d',
					comment  : '#82a98f',
					error    : '#ff0000',
				},
				primary: {
						100: '#ebd0d5',
						200: '#d7a2ab',
						300: '#c47381',
						400: '#b04557',
						500: '#9c162d',
						600: '#7d1224',
						700: '#5e0d1b',
						800: '#3e0912',
						900: '#1f0409',
				},
				secondary: {
						100: '#d5d5d6',
						200: '#abacad',
						300: '#808285',
						400: '#56595c',
						500: '#2c2f33',
						600: '#232629',
						700: '#1a1c1f',
						800: '#121314',
						900: '#09090a',
				},
				accent: {
					100: '#e9d2dc',
					200: '#d3a6b9',
					300: '#be7996',
					400: '#a84d73',
					500: '#922050',
					600: '#751a40',
					700: '#581330',
					800: '#3a0d20',
					900: '#1d0610',
				},
			},
			fontFamily: {
				'default-sans': '"Outfit", ui-sans-serif, system-ui, sans-serif',
				'code': '"Fira Code", monospace, ui-sans-serif system-ui sans-serif',
			},
		},
	},
	plugins: [],
}
