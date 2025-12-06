data = 0
code = [""]
while code[len(code)-1] != "eof":
    code.append(input('> '))
code.pop(0)
code.pop()
code.append("")
code = '\n'.join(code)
for inst in range(0, len(code)):
    if code[inst] == "$":
        data *= 2
    elif code[inst] == "!":
        if data % 2 == 1:
            data -= 1
        else: data += 1
    elif code[inst] == "\n":
        print(data)
    data = data % 256
