module.exports = {
    "extends": [
        "airbnb-base",
        "eslint:recommended",
        "plugin:react/recommended",
    ],
    "env": {
        "browser": true,
        "node": true
    },
    "rules": {
        "linebreak-style": 0,
        "import/prefer-default-export": "off",
        "react/prop-types": 0,
        "react/jsx-uses-react": "error",   
        "react/jsx-uses-vars":"error",
        "react/jsx-uses-react": "error",
        "no-console": 1
    },
    "parser": "babel-eslint",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true,
            "modules": true
        }
    },
    "settings": {
        "import/resolver": {
            "node": {
            "extensions": [".js", ".jsx", ".ts", ".tsx"]
            }
        }
    },
    "plugins": ["react"]
};