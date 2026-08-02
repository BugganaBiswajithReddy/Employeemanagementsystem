const { JSDOM } = require('jsdom');
const dom = new JSDOM();
try {
  dom.window.document.createElement(undefined);
  console.log("createElement didn't throw");
} catch(e) {
  console.log("createElement threw:", e.message);
}
