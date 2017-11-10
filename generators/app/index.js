const Generator = require("yeoman-generator"),
      mkdirp    = require("mkdirp");

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

        this.fs.copyTpl(
            this.templatePath("bsconfig.json"),
            this.destinationPath("bsconfig.json"),
            { appName: this.determineAppname().replace(/ /g, "-") }
        );

        mkdirp.sync(this.destinationPath("src/"));
        mkdirp.sync(this.destinationPath("test/"));
    }

    conflicts() {
        this.fs.extendJSON(this.destinationPath("package.json"), {
            scripts: {
                build: "npm run clean && bsb -make-world",
                watch: "npm run clean && bsb -make-world -w",
                clean: "rm -rf lib && bsb -clean-world"
            },
            peerDependencies: {
                "bs-platform": "^2.0.0"
            }
        });
    }
};
