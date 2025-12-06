'''
+-) interpreter in Python
 
+-) is an esolang. Since it has no I/O, the 'debug' argument is recommended to view the IP and the tape.
 
Commands:
+: Increment current cell unless the previous instruction executed is its matching ), then jump to the matching ) if the current cell is zero or the next character is ).
-: Decrement current cell unless the previous instruction executed is its matching ), then move the pointer to the right, then jump to the matching ) if the current cell is zero or the next character is ).
): Jump to the matching + (or -) if current cell is nonzero and the previous character is ).
 
More information see esolang wiki: https://esolangs.org/wiki/%2B-)
 
You can run any program by changing the last line, the default program is translated from the brainf program ++++++++[>++++++++<-]>+, which computes 65.
'''
def interpret_idb(code,debug=True):
    stack=[]
    matches={}
    for i,j in enumerate(code):
        if j!=')':
            stack.append(i)
        else:
            if not stack:
                raise SyntaxError('Unmatched symbol')
            a=stack.pop()
            matches[i]=a
            matches[a]=i
    if stack:
        raise SyntaxError('Unmatched symbol')
    ip=0
    p=0
    prev_ip=-1
    tape=[0,0,0]
    while ip<len(code):
        opcode=code[ip]
        if debug:
            print('IP: '+str(ip)+'\tCurrent character: '+code[ip]+'\tTape (before command): '+' '.join(map(lambda x:('>' if x[0]==p else ' ')+str(x[1]),enumerate(tape))))
        if opcode=='+':
            if prev_ip!=matches[ip]:
                tape[p]+=1
            if tape[p]==0 or code[ip+1]==')':
                prev_ip=ip
                ip=matches[ip]
                continue
            prev_ip=ip
            ip+=1
        elif opcode=='-':
            if prev_ip!=matches[ip]:
                tape[p]-=1
            p=(p+1)%3
            if tape[p]==0 or code[ip+1]==')':
                prev_ip=ip
                ip=matches[ip]
                continue
            prev_ip=ip
            ip+=1
        else:
            if tape[p]!=0 and code[ip-1]==')':
                prev_ip=ip
                ip=matches[ip]
                continue
            prev_ip=ip
            ip+=1
    if debug:
        print('Result: '+' '.join(map(lambda x:('>' if x[0]==p else ' ')+str(x[1]),enumerate(tape))))
    return (p,tape)
interpret_idb('+)+)+)+)+)+)+)+)-)+)-)+)-)++)-)+)-)+)-)+)-)+)+)+)+)+)+)+)+)+)-)+)-)-)+)-)+)-))+)-)+)')
 
