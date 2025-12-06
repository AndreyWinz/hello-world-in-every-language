function paml() {
 a = b = tv = 0
 while (p<c.length) {
        if (c[p]=="+") { a++ }
   else if (c[p]=="*") { tv=a ; a=b ; b=tv ; tv=0 }
   else if (c[p]=="-") { a-- }
   else if (c[p]=="a") { o += a + " " }
   else if (c[p]=="b") { o += b + " " }
   p++
 }
}
