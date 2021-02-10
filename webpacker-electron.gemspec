require_relative "lib/webpacker/electron/version"

Gem::Specification.new do |spec|
  spec.name        = "webpacker-electron"
  spec.version     = Webpacker::Electron::VERSION
  spec.authors     = ["Able"]
  spec.email       = ["engineering@able.co"]
  spec.homepage    = "https://github.com/ableco/webpacker-electron"
  spec.summary     = "Electron integration for Webpacker."
  spec.description = "Use webpacker configuration to build Electron apps using the same codebase."
  spec.license     = "MIT"

  # Prevent pushing this gem to RubyGems.org. To allow pushes either set the 'allowed_push_host'
  # to allow pushing to a single host or delete this section to allow pushing to any host.
  spec.metadata["allowed_push_host"] = "https://rubygems.org"

  spec.metadata["homepage_uri"] = spec.homepage
  spec.metadata["source_code_uri"] = "https://github.com/ableco/webpacker-electron"
  spec.metadata["changelog_uri"] = "https://github.com/ableco/webpacker-electron/blob/master/CHANGELOG.md"

  spec.files = Dir["{app,config,db,lib}/**/*", "MIT-LICENSE", "Rakefile", "README.md"]

  spec.add_dependency "rails", "~> 6.0.0"
  spec.add_dependency "webpacker"
  spec.add_development_dependency "rubocop", "~> 0.76"
  spec.add_development_dependency "rubocop-able", "~> 0.2.2"
end
