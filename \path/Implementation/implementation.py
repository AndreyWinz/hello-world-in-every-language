#!/bin/python3

import os.path as op, sys

errstr = '''/path error in block {bidx}:
/{block}/
 {pad}^
{msg}
'''

subs = {
        '\\':'/', 'P':'^', 'M':'\'', 'o':'`', 'D':'=', 'u':':', 'L':'#', 'O':'<',
        'I':'>', 'a':'+', 'R':'-', 't':'*', 'm':'%', 'n':'_', 'A':'&', 'R':'|',
        'N':'!'}

def subst(s):
        for subst in subs: s = s.replace(subst, subs[subst])
        return s

class SlashPathError(Exception): pass
class SlashPathNotEnoughInStack(SlashPathError): pass
class SlashPathDivideByZero(SlashPathError): pass
class SlashPathNegativeNumberOfItems(SlashPathError): pass

def dump(s):
        sys.stdout.write('Stack stack: [\n')
        for i, st in enumerate(reversed(s)):
                sys.stdout.write(f' Stack {i}: [')
                for x in reversed(st):
                        sys.stdout.write(f'\n   {x}')
                sys.stdout.write('\n ]\n')
        sys.stdout.write(']\n')

def slashpath(filePath, dumpOnError = 0):
        try:
                bidx = 0
                cidx = 0
                try: f = open(filePath, 'r')
                except: pass
                else:
                        l = f.readlines()[-1].strip()
                        f.close()
                        if l.isdigit(): bidx = int(l)
                filePath = subst(filePath)
                blocks = [x for x in filePath.split('/') if x]
                stackstack = [[]]
                inputbuf = ''

                while bidx < len(blocks):
                        while cidx < len(blocks[bidx]):
                                c = blocks[bidx][cidx]
                                # If there's not enough stuff in the stack
                                if c in 'kx:<j_!' and len(stackstack[-1]) < 1:
                                        raise SlashPathNotEnoughInStack(c, 1)
                                if c in 'bB+-*d%&|qlg' and len(stackstack[-1]) < 2:
                                        raise SlashPathNotEnoughInStack(c, 2)
                                if c == 'v':
                                        stackstack.append([])
                                elif c == 'k':
                                        n = stackstack[-1].pop()
                                        if n < 0:
                                                raise SlashPathNegativeNumberOfItems(c, n)
                                        if len(stackstack[-1]) < n:
                                                raise SlashPathNotEnoughInStack(c, n)
                                        stackstack.append(stackstack[-1][-n:])
                                        stackstack[-2] = stackstack[-2][:-n or None]
                                elif c in '^\'`':
                                        if c == '^':
                                                stackstack.pop()
                                        elif c == '\'':
                                                stackstack[-2].extend(stackstack.pop())
                                        elif c == '`':
                                                sys.stdout.write(' '.join(str(x) for x in stackstack.pop()))
                                        if len(stackstack) == 0: stackstack.append([])
                                elif c == '=':
                                        stackstack.append(stackstack[-1].copy())
                                elif c == 'S':
                                        if len(stackstack) > 1:
                                                stackstack.append(stackstack.pop(-2))
                                elif c == 'C':
                                        stackstack.clear()
                                        stackstack.append([])
                                elif c == 'x':
                                        stackstack[-1].pop()
                                elif c == ':':
                                        stackstack[-1].append(stackstack[-1][-1])
                                elif c == 's':
                                        if len(stackstack[-1]) > 1:
                                                stackstack[-1].append(stackstack[-1].pop(-2))
                                elif c == 'r':
                                        stackstack[-1].reverse()
                                elif c == 'c':
                                        stackstack[-1].clear()
                                elif '0' <= c <= '9':
                                        stackstack[-1].append(int(c))
                                elif c == '#':
                                        stackstack[-1].append(len(stackstack[-1]))
                                elif c == '<':
                                        if 0 <= stackstack[-1][-1] < 0x110000:
                                                sys.stdout.write(chr(stackstack[-1].pop()))
                                elif c == '>':
                                        ch = sys.stdin.read(1)
                                        stackstack[-1].append(ord(ch) if len(ch) else -1)  # EOF
                                elif c == 'j':
                                        bidx = max(0, min(bidx + stackstack[-1].pop(), len(blocks)-1))
                                        cidx = -1
                                elif c == 'b':
                                        n = stackstack[-1].pop()
                                        if stackstack[-1].pop():
                                                bidx = max(0, min(bidx + n, len(blocks)-1))
                                                cidx = -1
                                elif c == 'B':
                                        n = stackstack[-1].pop()
                                        if not stackstack[-1].pop():
                                                bidx = max(0, min(bidx + n, len(blocks)-1))
                                                cidx = -1
                                elif c in '+-*d%&|qlg':
                                        a = stackstack[-1].pop()
                                        b = stackstack[-1].pop()
                                        if c == '+':
                                                stackstack[-1].append(b + a)
                                        elif c == '-':
                                                stackstack[-1].append(b - a)
                                        elif c == '*':
                                                stackstack[-1].append(b * a)
                                        elif c == 'd':
                                                if a == 0: raise SlashPathDivideByZero((c, b, a))
                                                stackstack[-1].append(b // a)
                                        elif c == '%':
                                                if a == 0: raise SlashPathDivideByZero((c, b, a))
                                                stackstack[-1].append(b % a)
                                        elif c == '&':
                                                stackstack[-1].append(b & a)
                                        elif c == '|':
                                                stackstack[-1].append(b | a)
                                        elif c == 'q':
                                                stackstack[-1].append(1 if b == a else 0)
                                        elif c == 'l':
                                                stackstack[-1].append(1 if b < a else 0)
                                        elif c == 'g':
                                                stackstack[-1].append(1 if b > a else 0)
                                elif c == '_':
                                        stackstack[-1][-1] *= -1
                                elif c == '!':
                                        stackstack[-1][-1] = ~stackstack[-1][-1]
                                else:
                                        stackstack[-1].append(ord(c))
                                cidx += 1
                        #       print(c, '->', stackstack)
                        cidx = 0
                        bidx += 1
                return

        except SlashPathError as e:
                # Format a nice error message

                # Dump stack stack and stack
                if dumpOnError:
                        sys.stdout.write('\n')
                        sys.stdout.write('Memory dump\n')
                        sys.stdout.write('"""""""""""\n')
                        dump(stackstack)
                        sys.stdout.write('\n')

                # Where to cut the block
                l = len(blocks[bidx])
                if l < 78 or cidx < 37: i1, i2, i3 = 0, min(77, l), cidx
                elif cidx >= l - 37: i1, i2, i3 = l - 77, l, cidx - l - 77
                else: i1, i2, i3 = cidx - 37, cidx + 38, 37
                if type(e) is SlashPathDivideByZero:
                        msg = 'Division by zero'
                elif type(e) is SlashPathNotEnoughInStack:
                        if len(e.args) < 2: msg = 'Not enough elements in stack'
                        else: msg = f'Not enough elements in stack, need {e.args[1]}'
                elif type(e) is SlashPathNegativeNumberOfItems:
                        if len(e.args) < 2: msg = 'Can\'t count a negative number of items'
                        else: msg = f'Can\'t count a negative number of items ({e.args[1]})'
                else:
                        msg = 'Damn error'
                sys.stdout.write(errstr.format(block = blocks[bidx], bidx = bidx,
                                               cidx = cidx, pad = ' ' * i3, msg = msg))
                return


def usage():
        sys.stdout.write('Usage: slashpath [ file1 [ file2 [ file3 ... ] ] ]\n\n')
        sys.stdout.write('slashpath - /path interpreter\n\
see esolangs.org/wiki//path for more info\n\n')

def main():
        if len(sys.argv) == 1: usage()
        elif '-s' in sys.argv:
                for f in sys.argv[2:]:
                        slashpath(f, 1)
        else:
                for f in sys.argv[1:]:
                        if op.exists(f): slashpath(op.realpath(f))

if __name__ == '__main__': main()
