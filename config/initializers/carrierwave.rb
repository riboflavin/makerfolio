#if Rails.env.test? # Store the files locally for test environment
#  CarrierWave.configure do |config|
#    config.storage = :file
#    config.enable_processing = false
#  end
#end

#if Rails.env.development? or Rails.env.production? # Using Amazon S3 for Development and Production
  CarrierWave.configure do |config|
    config.s3_access_key_id = ENV['s3_access_key_id']
    config.s3_secret_access_key = ENV['s3_access_key']
    config.s3_bucket = ENV['s3_bucket']
    config.s3_access_policy = ENV['s3_access_policy']
    config.s3_region = ENV['s3_region']
  
    config.root = Rails.root.join('tmp')
    config.cache_dir = 'uploads'
end

