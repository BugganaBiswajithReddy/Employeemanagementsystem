const React = require('react');
const type = undefined;
try {
  React.createElement(type);
  console.log("createElement didn't throw");
} catch(e) {
  console.log("createElement threw:", e.message);
}
