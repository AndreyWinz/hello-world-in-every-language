let
  pkgs = import <nixpkgs> {};
in
pkgs.writeShellScriptBin "hello-world" ''
  echo "Hello, world!"
''
