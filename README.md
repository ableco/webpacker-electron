# Webpacker::Electron
Short description and motivation.

## Installation
Add this line to your application's `Gemfile`:

```ruby
gem 'webpacker-electron'
```

And then execute:
```bash
bundle
```

Or install it yourself as:

```ruby
bundle add webpacker-electron
```

Finally, run the following to install Webpacker::Electron:

```bash
bundle exec rails webpacker:install:electron
```

This command will create the following files:

* `config/electron-builder.yml`: Configuration file for [`electron-builder`](https://www.electron.build/).
* `config/webpack/electron/main/development.js`: Configuration file for Electron's main process (in development mode).
* `config/webpack/electron/main/production.js`: Configuration file for Electron's main process (in production mode).
* `config/webpack/electron/renderer/development.js`: Configuration file for Electron's renderer process (in development mode).
* `config/webpack/electron/renderer/production.js`: Configuration file for Electron's renderer process (in production mode).
* `lib/javascript/babel.js`: Babel configuration specific for Electron's main process.
* `public/electron.html`: Template for the renderer process, for both webpack dev server and production build.
* `src/packs/electron/main.js`: JavaScript pack for Electron's main process.
* `src/packs/electron/renderer.js`: JavaScript pack for Electron's renderer process.

It also updates the following files:

* `.gitignore`: Ignores `public/dist` and `public/packs-electron`.
* `config/webpack/environment.js`: Ignore Electron's related packs.

It also installs the following packages:

* `@babel/register`
* `dotenv`
* `dotenv-webpack`
* `electron`
* `electron-builder`
* `electron-devtools-installer`
* `electron-notarize`
* `electron-debug`
* `electron-log`
* `electron-updater`
* `concurrently`
* `cross-env`

## Usage
Once installed, you can start your JavaScript app in Rails as an Electron app with the following command:

```bash
bundle exec rails webpacker:start:electron
```

This task will run a webpack dev server for the renderer pack. Also, it will run `rails webpacker:start:electron:main` to start the actual Electron app.

### Package the Electron app

To package the JavaScript application into an Electron app, run the following:

```bash
rails webpacker:package:electron
```

First, it will compile the main and renderer packs for Electron, and then it will put the resulting output in an Electron app using `electron-builder`.

The app will be generated in `public/dist`.

## Contributing
Contribution directions go here.

## License
The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
