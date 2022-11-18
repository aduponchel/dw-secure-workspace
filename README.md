# Purpose

Currently when you develop using [Prophet Debugger](https://github.com/SqrTT/prophet) or [sfcc-cli](https://github.com/SalesforceCommerceCloud/sfcc-ci) you have to store your password a plain JSON or JS file called `dw.json` or `dw.js`

To avoid storing plain password, `@aduponchel/dw-secure-workspace` can be used.

Using `npm run set-password`, you will be able to choose a SSH public key location (or use default located into `~/.ssh/id_rsa.pub`) to encrypt your password. Your password will be stored encrypted into a `.dwsecret` file.

Then you will be able to use the following `dw.js` to allows your uploader to work.

## Caution

I am aware this is not fully secure because if someone has access to your file system, he could easily decrypt your password because he probably already have access to your SSH keys.

However this repository have been designed with [LiveShare VS Code extension](https://visualstudio.microsoft.com/services/live-share/) in mind.
It avoids having your password in plain text in your repository so if you want to share your workspace for a live pair-programming session without sharing terminals, your password is harder to leak.

I am aware this is not a perfect solution, maybe just a tweak, but it should work on every OS, including WSL for Windows.

```javascript
const {decrypt} = require('./index.js');

module.exports = {
    "hostname": "<hostname>",
    "username": "<username>",
    "password": decrypt(),
    "cartridgesPath": "<cartridge path>",
    "code-version": "<code version>",
}
```

# Installation

Requirements :
* node >= 18.12.1

Your project should be strutured like :

```
├── customer-custom-cartridge
│   └── cartridges
│       └── int_custom_cartridge
|   └── ...
├── storefront-reference-architecture
│   ├── bin
│   ├── cartridges
│   │   ├── app_storefront_base
│   │   ├── bm_app_storefront_base
│   │   └── modules
│   └── test
│       ├── acceptance
│       ├── integration
│       ├── mocks
│       └── unit
```

You can add simply add this repository at root. For example using `git submodule add git@github.com:aduponchel/dw-secure-workspace.git`.

You are free to use another project structure if you want. Only requirement is generated `dw.js` must be included into the workspace. Please also note having multiple `dw.js` or `dw.json` could lead to unexpected behaviours.

After cloning the repository, do not forget to run `npm install` or `yarn install`

# Custom implementation

[index.js](index.js) provides a set of functions that could be used as a starter kit to your own implementation.

[set-password.js](dset-password.js) supply a CLI for setting up password.