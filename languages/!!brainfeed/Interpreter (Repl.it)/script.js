function output_(_output) {
  document.querySelector("#output").innerText = _output;
}

function run() {
  let code = document.querySelector("#code").value;

/* MUST be 18 cells */
let cells = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'];
let extra = ['!', '?', ' ', '.', ',', '>', '<', '(', ')', '/', '+', '-', ':', ';', '÷', '*', "'", '"'];
let memory = 0;

/*
https://esolangs.org/wiki/!!brainfeed
* There 18 cells, all set to 0
* The first cell is selected by default

> - Select the cell to the right
< - Select the cell to the left
: - Select the first cell
; - Select the last cell
+ - Increase cell value by 1 (Up to 30)
- - Decrease cell value by 1
. - Output the current cell value
, - Outputs the current cell value as a lowercase letter
? - Outputs the current cell value as an uppercase letter
! - Outputs the current cell value as a punctuation mark
# - Sets the current cell value to 0
@ - Outputs the number of cells that are equal to 0
^ - Ask for input and set it to the current cell
% - Outputs the selected cell number
/ - Save the current cell value to memory
~ - Set the current cell value to the memory value
$ - Set the selected cell number to the memory value
& - Selects a random cell
*/

code = code.replace(/\[(.*?)]/gi, "").split("");
let com = "";
let current = 0;
let output = "";
for (let i = 0; i < code.length; i++) {
	com = code[i];
  if (com == ">") {
    if (current == 17) {
      output_("BAD CELL");
      return;
    }
    current++;
  }else if (com == "<") {
    if (current == 0) {
      output_("BAD CELL");
      return;
    }
    current--;
  }else if (com == "+") {
    if (cells[current] == 30) {
      output_("OVERFLOW NOT ALLOWED");
      return;
    }
    cells[current]++;
  }else if (com == "-") {
    if (cells[current] == 0) {
      output_("UNDERFLOW NOT ALLOWED");
      return;
    }
    cells[current]--;
    }else if (com == ".") {
   		output += cells[current];
		}else if (com == "," || com == "?") {
   		if (!alphabet[cells[current]]) {
        output_("BAD CHARACTER")
        return;
      }
if (com == ",") {
  output += alphabet[cells[current]];
 }else{
  output += alphabet[cells[current]].toUpperCase();
 }
    }else if (com == "!") {
    if (!extra[cells[current]]) {
        output_("BAD CHARACTER")
        return;
    }
    output += extra[cells[current]];
    }else if (com == "#") {
   	cells[current] = 0;
    }else if (com == "@") {
      output += cells.filter(x => x == 0).length;
    }else if (com == "^") {
      let input = prompt("");
      if (isNaN(parseInt(input.charAt(0)))) {
        output_("BAD INPUT");
        return;
      }
      cells[current] = parseInt(input.charAt(0))
    }else if (com == "/") {
   		memory = cells[current];
    }else if (com == "~") {
   		cells[current] = memory;
    }else if (com == ":") {
   		current = 0;
    }else if (com == ";") {
   		current = 17;
    }else if (com == "%") {
   		output += current;
    }else if (com == "$") {
   		memory = current;
    }else if (com == "&") {
      current = Math.floor(Math.random() * 18);
    }else if (com == "" || com == "\n" || com == " ") {
   		continue;
    }else{
      output_("BAD INSTRUCTION");
    return;
    }
  if (i == code.length-1) output_(output);
}
}

function save() {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(document.querySelector("#code").value));
  element.setAttribute('download', "!!brainfeed.txt");

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

let examples = [
  `+++++++?---,+++++++,,+++,#++++!--!++++++++++++++++++++?--------,+++,------,#+++,#!`,
  '!',
  '&$~.&$~.#++!+++++++++!#++!&$~.&$~.',
  '^.'
]

/*
1. Hello, World!
2. Quine
3. Random math equation
4. Cat program
*/

function exampl(v) {
  document.querySelector("#code").value = examples[v];
}
