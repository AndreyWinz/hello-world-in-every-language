let tape_size = 10000

let tape = Array.create tape_size 0

let rec deref n =
  if n = 0 then 0 else tape.(deref (pred n))

let p = Sys.argv.(1)
let length = String.length p

exception Unmatched_beginloop
exception Unmatched_endloop

let jump =
  let rec jump_ acc i =
    if i = length then raise (Unmatched_beginloop)
    else match (p.[i], acc) with
      | ('[', _) -> jump_ (succ acc) (succ i)
      | (']', 0) -> succ i
      | (']', _) -> jump_ (pred acc) (succ i)
      | _ -> jump_ acc (succ i)
  in
  function i -> jump_ 0 (succ i)

let dejump =
  let rec jump_ acc i =
    if i < 0 then raise (Unmatched_endloop)
    else match (p.[i], acc) with
      | (']', _) -> jump_ (succ acc) (pred i)
      | ('[', 0) -> i
      | ('[', _) -> jump_ (pred acc) (pred i)
      | _ -> jump_ acc (pred i)
  in
  function i -> jump_ 0 (pred i)

let rec process i n t =
  if i < length then
    match (p.[i], t) with
    | ('>', true) -> process (succ i) (2 * n) true
    | ('>', false) -> process (succ i) 0 true
    | ('<', true) -> process (succ i) (2 * n + 1) true
    | ('<', false) -> process (succ i) 1 true
    | ('+', _) ->
      let k = deref n in
      tape.(k) <- tape.(k) + 1;
      process (succ i) n false
    | ('-', _) ->
      let k = deref n in
      tape.(k) <- tape.(k) - 1;
      process (succ i) n false
    | ('.', _) ->
      print_char (char_of_int tape.(deref n)); flush stdout;
      process (succ i) n false
    | (',', _) ->
      (try tape.(deref n) <- int_of_char (input_char stdin) with
       | End_of_file -> ());
      process (succ i) n false
    | ('[', _) ->
      if tape.(deref n) = 0 then process (jump i) n false
      else process (succ i) n false
    | (']', _) -> process (dejump i) n false
    | _ -> process (succ i) n false;;

process 0 0 false;;
