//main.js

import * as AsBind from '../node_modules/as-bind/dist/as-bind.esm.js';

async function init() {
  const instance = await AsBind.instantiate(fetch('../build/b.wasm'), imports);
  const wasm = instance.exports;
  console.log(wasm.hello('world!'));
};
init();
