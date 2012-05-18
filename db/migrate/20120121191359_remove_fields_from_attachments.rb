class RemoveFieldsFromAttachments < ActiveRecord::Migration
  def self.up
       remove_column :attachments, :slug
       remove_column :attachments, :username
       remove_column :attachments, :token
 end

  def self.down
       add_column :attachments, :slug, :string
       add_column :attachments, :username, :string
       add_column :attachments, :token, :string
  end
end
