cell = 0
cells = [0, 0]
program = []
while True:
    line = input('>p ')
    if not line == "eof":
        program.append(line)
    else:
        program.append("")
        break
program = '\n'.join(program)
#Executes the program
Input = input('>i ')
if len(Input) > 0:
    cells[0] = ord(Input[0])
if len(Input) > 1:
    cells[1] = ord(Input[1])
inst = 0
while inst < len(program):
    if program[inst] == "$":
        cell = (cell + 1) % 2
    elif program[inst] == "+":
        cells[cell] += 1
    elif program[inst] == "-":
        cells[cell] -= 1
    elif program[inst] == "?":
        if cells[cell] != 0:
            inst += 1
    elif program[inst] == "\n":
        print(chr(cells[cell]), end="")
    elif ord(program[inst]) >= 97 and ord(program[inst]) <= 122:
        inst = program.index(chr(ord(program[inst])-32))
    else: pass
    inst += 1
