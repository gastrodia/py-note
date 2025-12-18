# To learn more about how to use Nix to configure your environment
# see: https://firebase.google.com/docs/studio/customize-workspace
{ pkgs, ... }: {
  # Which nixpkgs channel to use.
  channel = "unstable"; # or "unstable"

  # Use https://search.nixos.org/packages to find packages
  packages = [
    (pkgs.python313.withPackages (ps: with ps; [
      mkdocs
      mkdocs-material
      mkdocs-glightbox
      pymdown-extensions
      pygments
    ]))
  ];

  # Sets environment variables in the workspace
  env = {};
  idx = {
    # Search for the extensions you want on https://open-vsx.org/ and use "publisher.id"
    extensions = [
      # "vscodevim.vim"
      "bungcip.better-toml"
    ];

    # Enable previews
    previews = {
      enable = false;
      previews = {
        web = {
          command = ["mkdocs" "serve" "--dev-addr" "0.0.0.0:$PORT"];
          manager = "web";
          env = {
            PORT = "$PORT";
          };
        };
      };
    };

    # Workspace lifecycle hooks
    workspace = {
      # Runs when a workspace is first created
      onCreate = {
        # Example: install JS dependencies from NPM
        # npm-install = "npm install";
      };
      # Runs when the workspace is (re)started
      onStart = {
        # Example: start a background task to watch and re-build backend code
        # watch-backend = "npm run watch-backend";
        "serve" = "mkdocs serve";
      };
    };
  };
}
