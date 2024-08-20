# My Notes

## References

- https://www.petecorey.com/blog/2019/08/19/animating-a-canvas-with-react-hooks/
- https://github.com/bartoszkrawczyk2/react-redux-canvas/blob/master/article.md

- https://medium.com/projector-hq/writing-a-run-loop-in-javascript-react-9605f74174b
    - https://codesandbox.io/embed/gtpqh?referrer=https%3A%2F%2Fmedium.com%2F

- https://github.com/menard-codes/snakes-game

- https://koenvangilst.nl/blog/react-hooks-with-canvas
    - https://codesandbox.io/p/sandbox/github/vnglst/react-hooks-canvas/tree/master/?file=%2Fsrc%2Fhooks%2Findex.js&from-embed=

- https://github.com/nkzw-tech/athena-crisis
    - https://youtu.be/m8SmXOTM8Ec?feature=shared

- https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial
- https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript

---

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
