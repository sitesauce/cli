# The Sitesauce CLI
> Deploy your local sites directly to Sitesauce

## Motivation
While Sitesauce aims to remove the need for hosting the dynamic version of your website, it still requires you to host it somewhere Sitesauce can acess so we can generate your static sites. The Sitesauce CLI allows you to deploy your sites directly from your computer, removing the requirement of paying for an external server. While this may not be the first option for everyone (as it doesn't allow you to share an admin panel with the rest of your team), it provides for an interesting alternative, and greatly reduces the friction (and cost) of publishing a new website.

## Install

To install the CLI, install it globally with npm

```bash
$ npm install --global sitesauce-cli
```

You can also use Yarn

```bash
$ yarn global add sitesauce-cli
```

## Authenticating with Sitesauce

The CLI needs to authenticate with Sitesauce to deploy to your sites. You can connect your account by running the following command:

```bash
$ sitesauce login
```

You can get the name of the currently authenticated user with `$ sitesauce user`. You can get the name of the currently connected team with `$ sitesauce team` and change the team you're currently connected to using `$ sitesauce switch`.


## Usage

You can get a list of all available commands at any time by running the `sitesauce` command with no arguments

```
$ sitesauce
```

You can also get help for a specific commend by using the `--help` flag

```
$ sitesauce deploy --help
```

## License

Licensed under the MIT license. For more information, [check the license file](license).
