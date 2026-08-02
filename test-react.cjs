const React = require('react');
const ReactDOMServer = require('react-dom/server');
const App = () => {
  const UndefinedComponent = undefined;
  return React.createElement(UndefinedComponent, {});
};
try {
  ReactDOMServer.renderToString(React.createElement(App));
} catch (e) {
  console.log(e.stack);
}
