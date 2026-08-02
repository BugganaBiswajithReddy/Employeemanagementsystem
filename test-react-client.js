import React from 'react';
import { createRoot } from 'react-dom/client';
import { JSDOM } from 'jsdom';

const dom = new JSDOM('<div id="root"></div>');
global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;

const App = () => {
  const UndefinedComponent = undefined;
  return React.createElement(UndefinedComponent, {});
};

try {
  const root = createRoot(document.getElementById('root'));
  root.render(React.createElement(App));
} catch (e) {
  console.log(e.stack);
}
