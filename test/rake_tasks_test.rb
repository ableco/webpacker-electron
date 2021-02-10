require "webpacker"
require "test_helper"

class RakeTasksTest < Minitest::Test
  def test_rake_tasks
    output = Dir.chdir(test_app_path) { `rake -T` }
    assert_includes output, "webpacker:install:electron"
    assert_includes output, "webpacker:start:electron"
    assert_includes output, "webpacker:start:electron:main"
    assert_includes output, "webpacker:compile:electron"
    assert_includes output, "webpacker:compile:electron"
    assert_includes output, "webpacker:package:electron"
  end

  def test_rake_webpacker_electron_install_in_development_environment
    Webpacker.with_node_env("development") do
      Dir.chdir(test_app_path) do
        `bundle exec rake webpacker:install:electron`
      end
    end

    assert_includes test_app_dev_dependencies, "electron",
                    "Expected dev dependencies to be installed"
  end

  private

  def test_app_path
    File.expand_path("dummy", __dir__)
  end

  def test_app_dev_dependencies
    package_json = File.expand_path("package.json", test_app_path)
    JSON.parse(File.read(package_json))["devDependencies"]
  end

  def installed_node_module_names
    node_modules_path = File.expand_path("node_modules", test_app_path)
    Dir.chdir(node_modules_path) { Dir.glob("*") }
  end
end