class AddPseudoToAttachments < ActiveRecord::Migration
  def self.up
	  add_column :attachments, :pseudo_type, :string
	  add_column :attachments, :pseudo_id, :integer
  end

  def self.down
	  remove_column :attachments, :pseudo_type
	  remove_column :attachments, :pseudo_id
  end
end
