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
def sf(code):
    b=''
    d={'bbb': '+', 'bb#': '>', 'b#b': ',', '#bb': '[', 'b##': ']', '#b#': '.', '##b': '<', '###': '-'}
    code=''.join(list(filter(lambda x:x!='\n',code)))
    for i in range(len(code)//3):
        s=''.join([('#' if ord(code[3*i+j])%2 else 'b') for j in range(3)])
        b+=d[s]
    bf(b)
sf(sys.stdin.read())
