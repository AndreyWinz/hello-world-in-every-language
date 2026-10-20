/* Hello World in B */
main() {
    putstr("Hello, World!*n");
}

/* 
 * A simple putstr implementation using putchar 
 * (similar to printn, but for strings)
 */
putstr(s) {
    extrn putchar;
    auto i;
    i = 0;
    while(s[i]) {
        putchar(s[i++]);
    }
}
