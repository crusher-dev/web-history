const getSpacingSizes = () => {
	let sizingMap = {};
	for (let i = 0; i <= 120; i++) sizingMap[i] = `${i}rem`;

	sizingMap["12.8"] = `12.8rem`;
	sizingMap["12.5"] = `12.5rem`;
	return sizingMap;
};

const FONTS = {
	gilroy: ["Gilroy", "sans-serif"],
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

const LINE_HEIGHT_VALUE = {
	28: "1.57rem",
	16: "1rem",
	NORMAL: "1.33",
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
		},
	},
	plugins: [],
};
