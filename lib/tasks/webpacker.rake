bin_path = ENV["BUNDLE_BIN"] || Rails.root.join("bin")

namespace :webpacker do
  desc "Install everything needed for Electron"
  task "install:electron": ["webpacker:check_yarn"] do |task|
    prefix = task.name.split(/#|webpacker:install/).first
    install_template_path = template_path("../install/template.rb")

    if Rails::VERSION::MAJOR >= 5
      Kernel.exec "#{RbConfig.ruby} #{bin_path}/rails #{prefix}app:template LOCATION=#{install_template_path}"
    else
      Kernel.exec "#{RbConfig.ruby} #{bin_path}/rake #{prefix}rails:template LOCATION=#{install_template_path}"
    end
  end

  desc "Start Electron app"
  task "start:electron": ["webpacker:verify_install", :environment] do
    webpacker_config_path = Webpacker.config.config_path.dirname.join("webpack", "electron")

    Dir.chdir(Rails.root) do
      Kernel.exec "yarn run cross-env NODE_ENV=development webpack-dev-server --config #{webpacker_config_path.join('renderer', 'development.js')}"
    end
  end

  desc "Start Electron main process"
  task "start:electron:main": ["webpacker:verify_install", :environment] do
    source_entry_path = Webpacker.config.source_entry_path.join("electron")

    Dir.chdir(Rails.root) do
      Kernel.exec "yarn run cross-env NODE_ENV=development electron -r ./lib/javascript/babel.js #{source_entry_path.join('main.js')}"
    end
  end

  desc "Compile JavaScript packs using webpack for Electron"
  task "compile:electron": ["webpacker:verify_install", :environment] do
    webpacker_config_path = Webpacker.config.config_path.dirname.join("webpack", "electron")

    compile_electron_main = "yarn run cross-env RAILS_ENV=production NODE_ENV=production webpack --config #{webpacker_config_path.join('main', 'production.js')}"
    compile_electron_renderer = "yarn run cross-env RAILS_ENV=production NODE_ENV=production webpack --config #{webpacker_config_path.join('renderer', 'production.js')}"

    Dir.chdir(Rails.root) do
      Kernel.exec "yarn run concurrently \"#{compile_electron_main}\" \"#{compile_electron_renderer}\""
    end
  end

  desc "Package Electron app"
  task "package:electron": ["webpacker:verify_install", :environment] do
    electron_builder_config_path = Rails.root.join("config", "electron-builder.yml")

    if Rails::VERSION::MAJOR >= 5
      compile_task = "#{RbConfig.ruby} #{bin_path}/rails webpacker:compile:electron"
    else
      compile_task = "#{RbConfig.ruby} #{bin_path}/rake webpacker:compile:electron"
    end

    Dir.chdir(Rails.root) do
      Kernel.exec "rm -rf public/dist && #{compile_task} && yarn run electron-builder build --config #{electron_builder_config_path} --publish never"
    end
  end
end

private

def template_path(template)
  File.expand_path(template, __dir__).freeze
end
