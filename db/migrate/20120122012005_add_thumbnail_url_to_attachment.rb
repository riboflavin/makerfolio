class AddThumbnailUrlToAttachment < ActiveRecord::Migration
  def self.up
     add_column :attachments, :thumb_url, :string
  end

  def self.down
     remove_column :attachments, :thumb_url, :string
  end
end
