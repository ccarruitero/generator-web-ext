'use strict';
const Generator = require('yeoman-generator');
const chalk = require('chalk');
const yosay = require('yosay');
const {questions, buildExt} = require('@ccarruitero/create-web-ext');

module.exports = class extends Generator {
  prompting() {
    this.log(yosay(
      'Welcome to the grand ' + chalk.red('Web Extension') + ' generator!'
    ));
    return this.prompt(questions).then(answers => buildExt(answers));
  }

  install() {
    if (!this.options['skip-install']) {
      this.installDependencies({bower: false});
    }
  }
};
