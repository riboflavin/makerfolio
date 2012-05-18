class AddSlugToAttachments < ActiveRecord::Migration
  def self.up
      add_column :attachments, :slug, :string
      add_column :attachments, :token, :string
      rename_column :attachments, :description, :username
  end

  def self.down
      remove_column :attachments, :slug
      remove_column :attachments, :token
      rename_column :attachments, :username, :description
  end
end
