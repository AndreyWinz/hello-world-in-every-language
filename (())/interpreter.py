class Tree:
    def __init__(self,treelist):
        self.branches=treelist
    
    def __eq__(self,other):
        return other==None or self.branches==other.branches 
    
    def __str__(self):
        return "("+" ".join([(s.__str__() if type(s)!=type(None) else "n") for s in self.branches])+")"
   
    def __getitem__(self,key):
        if type(key)==int:
            return self.branches[key]
        elif len(key)==1:
            return self.branches[key[0]]
        return self.branches[key[0]][key[1:]]
   
    def __len__(self):
        return len(self.branches)
   

def str2(tree):
    string=""
    indent=0
    for paren in str(tree):
        if paren=="(":
            string+="\n"+"\t"*indent+paren
            indent+=1
        elif paren==")":
            indent-=1
            string+="\n"+"\t"*indent+paren
        else:
            string+="\n"+"\t"*indent+paren
    return string

def split(string):
    index=0
    i=0
    if string=="":
        return []
    elif string[0]==" ":
        return split(string[1:])
    for paren in string:
        i+=1;
        if paren=="(":
            index+=1
        elif paren==")":
            index-=1
        if index==0:
            return [string[:i]]+split(string[i:])

def tree(string):
    if string=="n":
        return None
    if len(split(string))!=1:
        return [tree(s) for s in split(string)]
    return Tree([tree(s) for s in split(string[1:-1])])

def subfinder(mylist, pattern):
    matches = []
    for i in range(len(mylist)):
        if mylist[i] == pattern[0] and mylist[i:i+len(pattern)] == pattern:
            return i

def emptyNestInterpreter(string):
    t=tree(string)

    productions=[[(s2[1:-1] if len(split(s[1:-1]))>1 else (split(s2[1:-1]) if len(split(s2[1:-1]))>1 else s2[1:-1])) for s2 in split(s[1:-1])] for s in split(str(t[0])[1:-1])]

    #print(productions)

    data=split(str(t[1])[1:-1])

    #print(data)

    end=False
    while not end:
        for production in productions:
            if type(production[0])==list:
                prod=[production[0][0][1:-1],production[0][1][1:-1]]
                end=True
            elif len(production)==1:
                prod=production
                data=prod+data
                break
            else:
                prod=production
            i=subfinder(data,split(prod[0]))
            try:
                data=data[:i]+split(prod[1])+data[i+len(split(prod[0])):]
                break
            except TypeError:
                pass
            end=False
        #print(data)
    return data
