const getSpacingSizes = () => {
	let sizingMap = {};
	for (let i = 0; i <= 120; i++) sizingMap[i] = `${i}rem`;

	sizingMap["12.8"] = `12.8rem`;
	sizingMap["12.5"] = `12.5rem`;
	sizingMap["13.5"] = `13.5rem`;
	return sizingMap;
};

const FONTS = {
	source: ["Source Code Pro", "sans-serif"],
	cera: ["Cera Pro", "sans-serif"],
};

const FONT_WEIGHT_VALUE = {
	400: "400",
	500: "500",
	600: "600",
	700: "700",
	800: "800",
	900: "900",
};
const LINE_HEIGHT = {
	none: "none",
	1.7: "1.7",
	2: "2",
};

/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./pages/**/*.{js,ts,jsx,tsx}", "./src/components/**/*.{js,ts,jsx,tsx}"],
	theme: {
		fontFamily: FONTS,
		fontWeight: FONT_WEIGHT_VALUE,
		extend: {
			margin: getSpacingSizes(),
			padding: getSpacingSizes(),
			fontSize: getSpacingSizes(),
			lineHeight: LINE_HEIGHT,
		},
		screens: {
			xl: { max: "1279px" },
			tab: { max: "980px" },
			md: { max: "767px" },
			sm: { max: "639px" },
		},
	},
	plugins: [],
};
