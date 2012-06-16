namespace :sendherokuvars do
  task :live do
    puts "Reading config/heroku_vars.yml and sending config vars to Heroku..."
    CONFIG = YAML.load_file('config/heroku_vars.yml')['live']
    command = "heroku config:add"
    CONFIG.each {|key, val| command << " #{key}=#{val} " if val }
    command << " --app makerfolio-live"
    puts command
    system command  
  end

  task :stage do
    puts "Reading config/heroku_vars.yml and sending config vars to Heroku..."
    CONFIG = YAML.load_file('config/heroku_vars.yml')['stage']
    command = "heroku config:add"
    CONFIG.each {|key, val| command << " #{key}=#{val} " if val }
    command << " --app makerfolio-stage"
    puts command
    system command  
  end
end