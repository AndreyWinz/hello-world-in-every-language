import sys
def bf(code):
    s1=[]
    s2=[]
    matches={}
    tape=[0]*1000000
    for i,j in enumerate(code):
        if j=='[':
            s1.append(i)
        if j==']':
            m=s1.pop()
            matches[m]=i
            matches[i]=m
    cp=0
    p=0
    while cp<len(code):
        if code[cp]=='+':
            tape[p]=(tape[p]+1)%256
        if code[cp]=='-':
            tape[p]=(tape[p]-1)%256
        if code[cp]==',':
            tape[p]=ord(sys.stdin.read(1))%256
        if code[cp]=='.':
            print(chr(tape[p]),end='')
        if code[cp]=='<':
            p-=1
        if code[cp]=='>':
            p+=1
        if code[cp]=='[':
            if not tape[p]:
                cp=matches[cp]
        if code[cp]==']':
            if tape[p]:
                cp=matches[cp]
        cp+=1
def fuck2bf(code):
    cleancode=''
    for i in code:
        if i in '!#':
            cleancode+=i
    cp=0
    table='     ><+-,.[]'
    b=''
    while cp<len(cleancode):
        idx=cleancode.index('#',cp)-cp
        b+=table[idx]
        cp+=idx+1
    return b
def run(code):
    bf(fuck2bf(code))
program=sys.stdin.read()
run(program)
