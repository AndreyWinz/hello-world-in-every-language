var vars,flag;
const urlParams = new URLSearchParams(location.search);
flags.value = urlParams.get('flags');
code.value = urlParams.get('code');
stdin.value = urlParams.get('stdin');
edit();
run();
function stop(){
  go = false;
  runButton.innerText = "Run";
  runButton.onclick = run;
  stdout.textContent = output.split('\n').join('\r\n');
  if (output.length > 5000){
    out.textContent = "stdout " + output.length + " Chars"
  }
}
function edit(){
  let urlPath = location.protocol + '//' + location.host + location.pathname;
  urlPath += "?flags=" + flags.value + "&code=" + code.value + "&stdin=" + stdin.value;
  history.replaceState(null, document.title, urlPath + '&');
  chars = code.value.length;
  codespot.innerHTML = "code: " + chars + " Chars or \\$" + chars + "\\log_{256}(3)\\approx\\$ " + Math.round(100*chars*Math.log2(3)/8)/100 + " Bytes"
}
async function run(){
  output = "";
  timeOffset = 0;
  maxRandom = 2;
  flag = flags.value.split('');
  if (flag.includes('i')){
    input = stdin.value.replace(/[^0-9\-]/g,' ').split(' ').filter(a=>a).map(Number);
  }
  else{
    input = stdin.value.split('').map(val => val.charCodeAt(0));
  }
  vars = [];
  loc = 0;
  stderr.innerText = "";
  stdout.innerText = "";
  out.innerText = "stdout"

  if (code.value.length == 0){
    stderr.innerText = "code must not be blank";
    return;
  }
  if (code.value[0] != '(' || code.value[code.value.length - 1] != ')'){
    stderr.innerText = "code must be surrounded by parentheses";
    return;
  }
  if (code.value.split('(').length != code.value.split(')').length){
    stderr.innerText = "parentheses must be balanced";
    return
  }
  runButton.innerText = "Stop";
  runButton.onclick = stop;
  go = true;
  let retVal = await evaluate(code.value);
  runButton.innerText = "Run";
  runButton.onclick = run;
  if (flag.includes("d")) output += retVal;
  if (flag.includes("v")) output += vars.map((v,i)=>i+1+":"+v).join('\n');
  stdout.textContent = output.split('\n').join('\r\n');
  if (output.length > 5000) out.textContent = "stdout " + output.length + " Chars"
}
async function evaluate(code, layer=1){
  let parens = matchParens(code);
  if (code.length == 0){
    return -1;
  }
  if (flag.includes("D")&&go) output += Array(layer).join("  ") + "Running " + code + "\n";
  let base = code;
  let retVal = 0;
  if (parens[0] == code.length){
    code = code.slice(1,code.length-1);
    code = code.split(',');
    let newCode = [];
    let last = "";
    for (let part of code){
      if (last.split("(").length == last.split(")").length){
        last = part;
        newCode.push(part);
      }
      else{
        last += "," + part;
        newCode[newCode.length - 1] = last;
      }
    }
    code = pad(newCode, 7, '');
    let max = await evaluate(code[6 - 2 * flag.includes("s")],layer+1)
    let iteration = 0
    let cond = await evaluate(code[4 - 2 * flag.includes("s")],layer+1) >= await evaluate(code[5 - 2 * flag.includes("s")],layer+1);
    if (max == 0 || (max < 0 && flag.includes("M") && code[6 - 2 * flag.includes("s")])) {
      retVal = -1;
      cond = false;
    }
    while (cond && (!code[6 - 2 * flag.includes("s")] || iteration++ < Math.abs(max)) && go) {
      let varIndex = await evaluate(code[0],layer+1);
      let varSet = await evaluate(code[1],layer+1);
      let intOutput = await evaluate(code[2 + 3 * flag.includes("s") + flag.includes("S")],layer+1);
      let strOutput = await evaluate(code[3 + 3 * flag.includes("s") - flag.includes("S")],layer+1);
      if (varIndex > vars.length){
        vars = pad(vars, varIndex, 0)
      }
      if (!code[0]){
          retVal += 1
      }
      else if (varIndex == -2){
        retVal += Math.round(new Date() / 1000) - timeOffset;
        if (code[1]){
            timeOffset += varSet
        }
      }
      else if (varIndex == -1){
        retVal += Math.floor(Math.random*maxRandom);
        if (varSet > 0){
            maxRandom = varSet;
        }
      }
      else if (varIndex == 0){
        retVal += input.length>loc ? input[loc++] : -1
        if (varSet > 0){
            loc = varSet - 1
        }
        if (code[1] && varSet <= 0){
            loc = input.length + varSet
        }
      }
      else{
        retVal += vars[varIndex - 1];
        if (code[1]){
          vars[varIndex - 1] = varSet;
        }
      }
      if (code[2 + 3 * flag.includes("s") + flag.includes("S")]){
        output += intOutput;
        if (flag.includes("N")) output += '';
        else if (flag.includes("n")) output += ' ';
        else output += '\n';
      }
      if (strOutput > 0){
        output += String.fromCharCode(strOutput);
      }
      cond = await evaluate(code[4 - 2 * flag.includes("s")],layer+1) > await evaluate(code[5 - 2 * flag.includes("s")],layer+1);
      if (cond){
          await sleep(1)
      }
    }
    if (flag.includes("m") && max < 0 && code[6 - 2 * flag.includes("s")]) retVal = -retVal;
  }
  else{
    let curLoc = 0;
    while (curLoc < code.length){
      retVal += await evaluate(code.slice(curLoc,parens[curLoc]),layer+1);
      curLoc = parens[curLoc];
    }
  }
  if (flag.includes("D")&&go) output += Array(layer).join("  ") + base + "=" + retVal + "\n";
  stdout.textContent = output.split('\n').join('\r\n');
  if (output.length > 5000) out.textContent = "stdout " + output.length + " Chars"
  return retVal;
}
function matchParens(string){
  let toMatch = [];
  let matches = {};
  for (let i = 0; i < string.length; i++){
    if (string[i] == '('){
      toMatch.push(i);
    }
    if (string[i] == ')'){
      matches[toMatch.pop()]=i+1;
    }
  }
  return matches;
}
function pad(array, length, fill){
  return length > array.length ? array.concat(Array(length - array.length).fill(fill)) : array;
}
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
