function Symbols(P){
  P = P.split('');
  let o = '';
  for(let i = 0; i < P.length; i++){
    switch(P[i]){
      case ')': do{ i--; }while(P[i] != '('); break;
      case ':': o += P[i+1]; break;
      case ';': P[i] = prompt('Input Char')[0]; break;
      case '+': P[i+1] = String.fromCharCode(P[i+1].charCodeAt()+1); break;
      case '-': P[i+1] = String.fromCharCode(P[i+1].charCodeAt()-1); break;
      case '#':
        do{
          let h = prompt('Input Char');
          switch(h){
            case ')': do{i--;}while(P[i] != '('); break;
            case ':': o += P[i+1]; break;
            case ';': P[i] = prompt('Input Char')[0]; break;
            case '+': P[i+1] = String.fromCharCode(P[i+1].charCodeAt()+1); break;
            case '-': P[i+1] = String.fromCharCode(P[i+1].charCodeAt()-1); break;
            case '?': if('():;+-#?!'.includes(P[i-1])){i = P.length;} break;
            case '!': i = P.length;
          }
        }while(h == '#');
        break;
      case '?': if('():;+-#?!'.includes(P[i-1])){i = P.length;} break;
      case '!': i = P.length;
    }
  }
  return o;
}
