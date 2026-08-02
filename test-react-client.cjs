const React = require('react');
const ReactDOMClient = require('react-dom/client');
const { JSDOM } = require('jsdom');

const dom = new JSDOM('<div id="root"></div>');
global.window = dom.window;
global.document = dom.window.document;

const App = () => {
  const UndefinedComponent = undefined;
  return React.createElement(UndefinedComponent, {});
};

try {
  const root = ReactDOMClient.createRoot(document.getElementById('root'));
  root.render(React.createElement(App));
} catch (e) {
  console.log(e.stack);
}
