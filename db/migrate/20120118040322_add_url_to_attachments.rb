class AddUrlToAttachments < ActiveRecord::Migration
  def self.up
  add_column :attachments, :url, :string
  end

  def self.down
  remove_column :attachments, :url, :string
  end
end
