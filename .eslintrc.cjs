module.exports = {
	root: true,
	env: { browser: true, es2020: true, node: true },
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended",
		"plugin:react-hooks/recommended"
	],
	ignorePatterns: ["dist", ".eslintrc.cjs"],
	parser: "@typescript-eslint/parser",
	plugins: ["react-refresh", "simple-import-sort", "prettier"],
	rules: {
		"no-unused-vars": "off",
		"@typescript-eslint/no-unused-vars": "off",
		"@typescript-eslint/no-explicit-any": "off",
		"no-console": "error",
		"react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
		"simple-import-sort/imports": [
			"error",
			{
				groups: [
					// External packages.
					["^"],
					// Internal packages.
					["^@"],
					// Side effect imports.
					["^\\u0000"],
					// Parent imports.
					["^\\.\\.(?!/?$)", "^\\.\\./?$"],
					// Other relative imports.
					["^\\./(?=.*/)(?!/?$)", "^\\.(?!/?$)", "^\\./?$"],
					// Style imports.
					["^.+\\.s?css$"]
				]
			}
		],
		"simple-import-sort/exports": "error"
	}
};
