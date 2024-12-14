import js from "@eslint/js";

export default [
    js.configs.recommended,
    {
        files: ["*.js", "*.vue"],
        languageOptions: {
            globals: {
                localStorage: "readonly",
                console: "readonly",
            },
        },
    },
    {
        rules: {
            "no-unused-vars": "warn",
            "no-undef": "off",
            "no-console": "off",
        }
    }
];