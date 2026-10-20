def slashes(s):
  while s:
    buff = ["","",1]
    for t in (0,1,2):
      while s:
        if s[0] == "/" :         s = s[1:]; break
        if s[0] == "\\":         s = s[1:]
        if t: buff[t-1] += s[0]; s = s[1:]
        else: yield        s[0]; s = s[1:]
    while s and buff[0] in s: s = s.replace(*buff)
