const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

function element() {
  return {
    children: [], value: "", selectedIndex: 0,
    set textContent(value) { this.children = []; this.text = value; },
    append(...children) { this.children.push(...children); },
    appendChild(child) { this.children.push(child); },
    style: {}, setAttribute() {}, addEventListener() {}
  };
}
const elements = {};
const context = vm.createContext({
  document: {
    getElementById(id) { return elements[id] ||= element(); },
    createElement: element,
    addEventListener() {}
  }
});
vm.runInContext(fs.readFileSync(__dirname + "/data.js", "utf8"), context);
const original = JSON.stringify(context.GAMES);
vm.runInContext(fs.readFileSync(__dirname + "/app.js", "utf8"), context);
function displayedDates() {
  return elements.rows.children.map(row => row.children[0].children[2].text);
}
assert.deepEqual(displayedDates(), ["29.10.2026", "23.10.2026", "14.10.2026", "06.10.2026"]);
assert.equal(JSON.stringify(context.GAMES), original);
assert.equal(context.dateKey("01.01.2027"), "2027-01-01");
assert.equal(context.dateKey(), "");
elements.dateFrom.value = "2026-10-14";
elements.dateTo.value = "2026-10-23";
context.render();
assert.deepEqual(displayedDates(), ["23.10.2026", "14.10.2026"]);
console.log("Match log sorting and date filters passed.");
