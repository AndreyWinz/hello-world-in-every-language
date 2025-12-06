c=input();p=a=b=0
while p<len(c):
 if c[p]=="+":a+=1
 elif c[p]=="*":a,b=b,a
 elif c[p]=="-":
  if a:a+=-1
  else:p=0
 elif c[p]=="d":print(a,b)
 p+=1
