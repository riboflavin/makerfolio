#if Rails.env.test? # Store the files locally for test environment
#  CarrierWave.configure do |config|
#    config.storage = :file
#    config.enable_processing = false
#  end
#end

#if Rails.env.development? or Rails.env.production? # Using Amazon S3 for Development and Production
  CarrierWave.configure do |config|

 config.fog_credentials = {
    :provider               => 'AWS',       # required
    :aws_access_key_id      => ENV['s3_access_key_id'],       # required
    :aws_secret_access_key  => ENV['s3_access_key']       # required
    #:region                 => 'eu-west-1'  # optional, defaults to 'us-east-1'
  }
  config.fog_directory  = ENV['s3_bucket']                    # required
  #config.fog_host       = 'https://assets.example.com'            # optional, defaults to nil
  #config.fog_public     = false                                   # optional, defaults to true
  #config.fog_attributes = {'Cache-Control'=>'max-age=315576000'}  # optional, defaults to {}


#    config.s3_access_policy = ENV['s3_access_policy']
#    config.s3_region = ENV['s3_region']
  
  config.root = Rails.root.join('tmp')
  config.cache_dir = 'uploads'
end

