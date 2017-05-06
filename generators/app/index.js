const Generator = require("yeoman-generator");

module.exports = class extends Generator {
    initializing() {
        this.composeWith(require.resolve("generator-npm-init/app"), {
            author: "Ryan Biwer",
            license: "MIT"
        });
    }

    writing() {
        this.fs.copy(
            this.templatePath("gitignore"),
            this.destinationPath(".gitignore")
        );

        this.fs.copy(
            this.templatePath("npmrc"),
            this.destinationPath(".npmrc")
        );

        this.fs.copyTpl(
            this.templatePath("bsconfig.json"),
            this.destinationPath("bsconfig.json"),
            { appName: this.determineAppname().replace(/ /g, "-") }
        );
    }

    conflicts() {
        this.fs.extendJSON(this.destinationPath("package.json"), {
            scripts: {
                build: "npm run clean && eval $(dependencyEnv) && nopam && bsb 2>&1 | berror.native --path-to-refmttype $(which refmttype)",
                "build-no-be": "bsb 2>&1",
                watch: "npm run clean && eval $(dependencyEnv) && nopam && bsb -make-world -w 2>&1 | berror.native --path-to-refmttype $(which refmttype)",
                clean: "bsb -clean-world"
            }
        });
    }

    install() {
        let packages = [ "bs-platform", "dependency-env", "nopam", "ocamlBetterErrors" ];
        this.npmInstall(packages, { "save-dev": true });
    }
};