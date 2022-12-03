module.exports = {
	backend: "https://backend.crusher.dev/",
	project: 3851,
	proxy: [
		{
			name: "frontend",
			url: "http://localhost:3000",
			intercept: "localhost:3000",
		},
	],
};
