{
  description = "Dev shell";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils, ... }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        # protoc-gen-js has build issues on macOS with newer Clang
        protocJsPackage = if pkgs.stdenv.isDarwin then [] else [ pkgs.protoc-gen-js ];
      in {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.go
            pkgs.nodejs
            pkgs.protobuf
            pkgs.protoc-gen-go
            pkgs.protoc-gen-go-grpc
            pkgs.protoc-gen-grpc-web
            pkgs.grpc-tools
            pkgs.buf
            pkgs.openssl
            pkgs.pkg-config
          ] ++ protocJsPackage;

          PKG_CONFIG_PATH = "${pkgs.openssl.dev}/lib/pkgconfig";

          shellHook = ''
            echo "Dev shell"
            export PATH=$PATH:${pkgs.protobuf}/bin
          '';
        };
      });
}

