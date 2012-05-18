class AddSecureTokenToAttachment < ActiveRecord::Migration
  def self.up
       add_column :attachments, :secure_token, :string
  end

  def self.down
       remove_column :attachments, :secure_token
  end
end
