'use strict';
const path = require('path');
const assert = require('yeoman-assert');
const helpers = require('yeoman-test');

const extName = 'extName';

function run(prompts, done) {
  helpers.run(path.join(__dirname, '../generators/app'))
    .withOptions({
      'skip-install': true
    })
    .withPrompts({ name: extName, ...prompts})
    .on('end', done)
    .catch(e => {
      console.log(e);
    });
}

describe('generator-web-ext:app', () => {
  it('creates files', done => {
    const name = 'someName';
    run({ name }, () => {
      const files = [
        'package.json',
        'extension/manifest.json',
        'extension/_locales/en/messages.json'
      ];
      assert.file(files.map(file => `${name}/${file}`));
      done();
    });
  });

  it('set name in locales', done => {
    const name = 'noPopup';
    run({ name }, () => {
      assert.fileContent(`${name}/extension/_locales/en/messages.json`, 'noPopup');
      done();
    });
  });

  it('allow no popup', done => {
    run({
      action: false
    }, () => {
      assert.noFile(`${extName}/extension/popup/index.html`);
      assert.noFileContent(`${extName}/extension/manifest.json`, 'default_popup');
      done();
    });
  });

  it('can set background', done => {
    run({
      background: true
    }, () => {
      assert.file(`${extName}/extension/background/index.js`);
      assert.fileContent(`${extName}/extension/manifest.json`, 'background');
      done();
    });
  });

  it('can set permissions in manifest', done => {
    run({
      permissions: ['alarms', 'activeTab']
    }, () => {
      assert.fileContent([
          [`${extName}/extension/manifest.json`, 'permissions'],
          [`${extName}/extension/manifest.json`, 'alarms'],
          [`${extName}/extension/manifest.json`, 'activeTab']
      ]);
      done();
    });
  });

  it('can set content script', done => {
    run({
      contentScript: true
    }, () => {
      assert.fileContent(`${extName}/extension/manifest.json`, 'content_scripts');
      assert.fileContent(`${extName}/extension/manifest.json`, '<all_urls>');
      assert.file(`${extName}/extension/content_scripts/index.js`);
      done();
    });
  });

  it('can set match pattern for content script', done => {
    run({
      contentScript: true,
      contentScriptMatch: '*://*.mozilla.org/*'
    }, () => {
      assert.fileContent(`${extName}/extension/manifest.json`, 'content_scripts');
      assert.fileContent(`${extName}/extension/manifest.json`, '*://*.mozilla.org/*');
      assert.file(`${extName}/extension/content_scripts/index.js`);
      done();
    });
  });
});
