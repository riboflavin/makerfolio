# encoding: utf-8

class FileUploader < CarrierWave::Uploader::Base

  # Include RMagick or MiniMagick support:
  include CarrierWave::RMagick
  # include CarrierWave::MiniMagick

  # Choose what kind of storage to use for this uploader:
#  storage :file
  storage :s3

  # Override the directory where uploaded files will be stored.
  # This is a sensible default for uploaders that are meant to be mounted:
#  def store_dir
# "uploads/#{model.class.to_s.underscore}/#{mounted_as}/#{model.id}"
#  end
  
  def filename
     "#{secure_token(10)}_#{original_filename}" if original_filename.present?
  end

  def secure_token(length=16)
    #todo - filenames don't have to be unique
    model.secure_token ||= SecureRandom.hex(length / 2)
  end

  def store_dir
   "uploads/#{model.attachable_type.to_s.underscore}/#{model.attachable_id}/"
  end

  def extension_white_list
    %w(jpg jpeg gif png)
  end
  
  
  # Provide a default URL as a default if there hasn't been a file uploaded:
  # def default_url
  #   "/images/fallback/" + [version_name, "default.png"].compact.join('_')
  # end

  # Process files as they are uploaded:
  # process :scale => [200, 300]
  #
  # def scale(width, height)
  #   # do something
  # end

  process :resize_to_fit => [1600, 1600]
  
  # Create different versions of your uploaded files:
   version :thumb do
      process :resize_to_fill => [200,200]
   end

  # Add a white list of extensions which are allowed to be uploaded.
  # For images you might use something like this:
#   def extension_white_list
#     %w(jpg jpeg gif png)
#   end

  # Override the filename of the uploaded files:
  # Avoid using model.id or version_name here, see uploader/store.rb for details.
  # def filename
  #   "something.jpg" if original_filename
  # end

end
