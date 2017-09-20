const Generator = require("yeoman-generator");

module.exports = class extends Generator {
    initializing() {
        this.composeWith(require.resolve("generator-npm-init/app"), {
            author: this.user.git.name() || "Ryan Biwer",
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
                build: "npm run clean && bsb -make-world",
                watch: "npm run clean && bsb -make-world -w",
                clean: "bsb -clean-world"
            }
        });
    }

    install() {
        let packages = [ "bs-platform" ];
        this.yarnInstall(packages, { "save-dev": true });
    }
};
