require "webpacker/configuration"

say "Checking for package's name and version"
package = JSON.parse(File.read(Rails.root.join("package.json")))

if package["name"].present? && package["version"].present?
  say "Adding Electron to #{package['name']}@#{package['version']}", :blue
else
  say "Couldn't find a name or version for this application. Add a 'name' or 'version' in your package.json", :red
  return
end

say "Copying Webpacker configuration files for Electron"

directory "#{__dir__}/config/webpack/electron", "config/webpack/electron"
copy_file "#{__dir__}/config/electron-builder.yml", "config/electron-builder.yml"
copy_file "#{__dir__}/lib/javascript/babel.js", "lib/javascript/babel.js"
copy_file "#{__dir__}/lib/javascript/notarize.js", "lib/javascript/notarize.js"

say "Updating webpack environment configuration to ignore Electron packs"

unless File.read(Rails.root.join("config/webpack/environment.js")).include?(".filter((key) => key.match(/^electron/))")
  insert_into_file Rails.root.join("config/webpack/environment.js"), after: /const\ \{\ environment\ \}\ =\ require\(['"]@rails\/webpacker['"]\)/ do
    <<~JS


    Object.keys(environment.entry)
      .filter((key) => key.match(/^electron/))
      .forEach((entry) => {
        environment.entry.delete(entry);
      });

    JS
  end
end

if File.exists?(Rails.root.join(".gitignore"))
  unless File.read(Rails.root.join(".gitignore")).include?("public/packs-electron")
    append_to_file Rails.root.join(".gitignore") do
      <<~TEXT


      # Electron
      /public/packs-electron
      /public/dist
      !/public/assets

      TEXT
    end
  end
end

say "Creating dist directories for Electron builds"

empty_directory "public/packs-electron"
empty_directory "public/dist"
empty_directory "public/assets/icons"

say "Copying Electron packs and entry files to #{Webpacker.config.source_entry_path}"

directory "#{__dir__}/src/packs/electron", "#{Webpacker.config.source_entry_path}/electron"
copy_file "#{__dir__}/public/electron.html", "public/electron.html"

say "Installing all Electron dependencies"

run "yarn add --dev electron-builder electron-notarize @babel/register babel-plugin-module-resolver dotenv dotenv-webpack html-webpack-plugin@4.5.1 concurrently cross-env yaml"
run "yarn add electron electron-devtools-installer electron-updater electron-log electron-debug"
run "yarn run electron-builder install-app-deps"

say "Webpacker now supports Electron 🎉", :green
