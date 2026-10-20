import sys

def makeLiteral():
    global index
    global register
    global char

    index += 1
    char = code[index]
    number = char

    while (index := index + 1) < len(code):
        char = code[index]
        if char == ';':
            break
        number += char
    
    register = int(number, 16)

with open(sys.argv[1], 'r') as f:
    code = f.read()

stack = []
register = None
index = -1

while (index := index + 1) < len(code):
    char = code[index]
    if char == '+':
        stack[-1] += 1
    elif char == '-':
        stack[-1] -= 1
    elif char == 'p':
        stack.append(register)
    elif char == 'P':
        register = stack.pop()
    elif char == '#':
        makeLiteral()
    elif char == '?':
        if register == 0:
            index += 1
    elif char == ':':
        stack.append(stack[-1])
    elif char == '.':
        print(chr(stack.pop()), end='')
    elif char == ',':
        i = sys.stdin.read(1)
        register = ord(i)
    elif char == 'o':
        print(stack.pop(), end='')
    elif char == 'i':
        register = int(input())
    elif char == 'J':
        x = stack.pop()
        index = x - 1
    elif char == 'q':
        exit()
