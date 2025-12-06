import Data.List (isPrefixOf)

run [] = []
run ('\\':x:xs) = x:run xs
run ('/':xs) = run $ sub $ pat xs
run (x:xs) = x:run xs

pat ('\\':x:xs) = ([x],[],[]) <> pat xs
pat ('/':xs) = repl xs
pat (x:xs) = ([x],[],[]) <> pat xs

repl ('\\':x:xs) = ([],[x],[]) <> repl xs
repl ('/':xs) = ([],[],xs)
repl (x:xs) = ([],[x],[]) <> repl xs

sub args@(pat,repl,body) = if subStep args == body then body else sub(pat,repl,subStep args)

subStep(_,_,[]) = []
subStep(pat,repl,body) | pat `isPrefixOf` body = repl++subStep(pat,repl,drop (length pat) body)
                       | otherwise = head body:subStep(pat,repl,tail body)

main = interact run
