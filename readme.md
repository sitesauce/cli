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

## Configuring a project

Projects associate Sitesauce sites and the directories on your machine that contain those sites. To associate a directory with a site, open that directory in your terminal and run `$ sitesauce init`. This will create a `.sitesauce.json` config file that you can add to your `.gitignore` if you don't want to commit (there's no sensitive information, so it shouldn't really matter).

## Deploying a project

> NOTE: Make sure you've configured your project before attempting to deploy it.

To deploy a project, open the project directory and run `$ sitesauce deploy`. This will ask you for the port your application is running in and open a secure tunnel between your computer and our server that will be closed as soon as the deployment is finished.

### Customizing the Host header

Some server applications (like [Laravel Valet](https://laravel.com/docs/valet)) use the Host header to decide which site to serve. To deploy this types of applications, you can use the `--host`. For example, if you were to deploy a Valet site, you would have to use the following command

```bash
$ sitesauce deploy --port 80 --host laravel.test
```

You might also have noticed we're specifying the port via the `--port` flag, skipping the port prompt and making the whole process faster.

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
