module.exports = {
	"plugins": [
		"evelyn",
	],
	"extends": [
		"plugin:evelyn/default",
		"plugin:evelyn/source",
		"plugin:evelyn/node",
	],
	"overrides": [
		{
			"files": [
				"lib/**/*.js",
			],
			"extends": [
				"plugin:evelyn/built",
			],
			"files": [
				"**/*.test.js",
				"**/__mocks__/**/*.js",
				"**/__tests__/**/*.js",
			],
			"extends": [
				"plugin:evelyn/jest",
			],
		},
	],
};
