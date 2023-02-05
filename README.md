# Flyff Admin Tool

![](https://img.shields.io/github/license/Quentin-Lamotte/Flyff-Admin-Tool?logo=creative-commons&logoColor=white&style=for-the-badge)

[![](https://img.shields.io/github/v/release/Quentin-Lamotte/Flyff-Admin-Tool?color=green&logo=github&sort=semver&style=for-the-badge)](https://github.com/Quentin-Lamotte/Flyff-Admin-Tool/releases/latest)
![](https://img.shields.io/github/release-date/Quentin-Lamotte/Flyff-Admin-Tool?color=lightgrey&style=for-the-badge)
![](https://img.shields.io/github/last-commit/Quentin-Lamotte/Flyff-Admin-Tool?color=lightgrey&style=for-the-badge)

[![](https://img.shields.io/discord/548501353639575562?color=7289DA&label=Discord&logo=discord&logoColor=white&style=for-the-badge)](https://discord.gg/FQrS8Qd)

## ![](https://img.icons8.com/color/24/000000/error.png) Disclaimer

**FAT is under active development!**

During this phase, I might have to publish updates that would break compatibility with older versions and some features might dramatically change over time.
I'll do my best to take your feedback into account and will reduce breaking changes as much as possible...

But hey, change is a good thing, right? :sweat_smile:

## ![](https://img.icons8.com/color/24/000000/user-manual.png) User guide

### Requirements

This app only runs on **64 bits Windows 10** or **64 bits Windows Server 2016** and above systems.

> Note: While FAT could run on older version of Windows, I won't test them nor provide support for any issue encountered on these configurations.

### Features

#### Getting started with the Workflow Manager

The main feature of FAT consists in setting up a completely customizable Workflow where each node represents a command or file to execute:

- Command or file path
- Arguments
- Delay

Start by editing your workflow to add some commands.
Then, start/stop them all, sequentially up to a given node or individually.

You have full control over how you want to execute part or all of your Workflow! :wink:

One started, you can monitor live metrics of your executables to make sure everything runs as expected.
You'll also be able to interact with everything your executable communicates on:

- Standard output (`stdout`)
- Standard error (`stderr`)
- Standard input (`stdin`)
- Exit code

Everything the [standard IO](https://en.wikipedia.org/wiki/Standard_streams) does, FAT does! :heart_eyes:

> Note: The executables started by FAT are attached to it.
> You must keep FAT running to maintain your server up as closing it closes its sub-processes as well.

#### Getting started with the System Dashboard

The System Dashboard provides a quick overview on your system information.

It will be improved over time to provide even more data! :ok_hand:

#### Getting started with the ODBC Wizzard

The ODBC Wizzard shows you the actual ODBC configuration of your system.

You'll be able to see the installed ODBC drivers as well as your DSNs and even test them! :thumbsup:

## ![](https://img.icons8.com/color/24/000000/source-code.png) Developer guide

![](https://img.shields.io/github/package-json/dependency-version/Quentin-Lamotte/Flyff-Admin-Tool/bootstrap?logo=bootstrap&logoColor=white&style=for-the-badge)
![](https://img.shields.io/github/package-json/dependency-version/Quentin-Lamotte/Flyff-Admin-Tool/dev/electron?logo=electron&logoColor=white&style=for-the-badge)

### Requirements

This app is meant to be built and run on **Windows** systems only.
Some calls to PowerShell make it unable to be built for other operating systems but this could be changed if a cross-platform way of managing ODBC systems is found in the future.

<p align="center">
	<img src="https://nklayman.github.io/vue-cli-plugin-electron-builder/hero.png" height="100">
</p>

Flyff Admin Tool uses a [Vue](https://vuejs.org/) + [Electron](https://www.electronjs.org/) stack and relies on the [Vue CLI Plugion Electron Builder](https://nklayman.github.io/vue-cli-plugin-electron-builder/) plugin to wrap the VueJS app within an ElectronJS shell.

### Development

This app is being developped using [Visual Studio Code](https://code.visualstudio.com/).

As for its frameworks and other tools, it uses:

- [NodeJS 12](https://nodejs.org/)
- [Yarn](https://yarnpkg.com/)
- [Vue CLI 4](https://cli.vuejs.org/)
- [BabelEdit](https://www.codeandweb.com/babeledit)

Visual Studio Code extensions I use:

- [Debugger for Chrome](https://marketplace.visualstudio.com/items?itemName=msjsdiag.debugger-for-chrome)
- [ESLint](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
- [npm](https://marketplace.visualstudio.com/items?itemName=eg2.vscode-npm-script)
- [npm Intellisense](https://marketplace.visualstudio.com/items?itemName=christian-kohler.npm-intellisense)
- [Prettier - Code formatter](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Vetur](https://marketplace.visualstudio.com/items?itemName=octref.vetur)

#### Install dependencies

The first thing to do when cloning a fresh copy of the project is to install its dependencies (as for any NodeJS project...)!

```sh
yarn install
```

#### Run

Using the following command builds the app in development mode and serves it locally.

```sh
yarn electron:serve
```

#### Build

The following command builds the app in production mode.

```sh
yarn electron:build
```

> You can add the `-p always` option to publish it to GitHub.
> See [this guide](https://nklayman.github.io/vue-cli-plugin-electron-builder/guide/recipes.html#auto-update) for more info.
