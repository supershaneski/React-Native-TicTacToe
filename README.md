# React-Native-TicTacToe

A simple Tic-Tac-Toe game using [React-Native](https://reactnative.dev) and [Expo](https://expo.dev).

Most of the logic of the implementation (e.g. checking for winner) is taken from [ReactJS tutorial](https://reactjs.org/tutorial/tutorial.html#completing-the-game).

The main objective of this project is to get familiar using React Native.

## Features

* Responsive design

   The size of the tiles are dynamically set by listening to [`Dimensions`](https://reactnative.dev/docs/dimensions) from react-native.

* Dark/Light mode theming

   Dark and light mode is detected using [`useColorScheme`](https://reactnative.dev/docs/usecolorscheme) from react-native. This is then fed to a custom context `ThemeContext` which provides the mode to other components.

   I also made a simple custom hook `useTheme` to manage the style for dark and light modes selection.

* Load SVG

   Ultimately, my goal is to be able to load an svg file. For now, only loading supported elements.

* Game AI

   Added a bot to play with :) Improved the bot's AI.

* Localization

   Can now display English and Japanese captions depending on the device's language setting.
   Created a custom hook to load localized captions because the first implementation I found from the web is buggy and the workaround is much more work.
   

### Methods

```javascript
React.useEffect(() => {

   const v = func(deps)

   return () => {
      v.subscribe(false)
   }

}, [deps])
```

## Setup

Before running the project, install first the required modules by running:

> `npm install`


Then run:

> `expo start`

