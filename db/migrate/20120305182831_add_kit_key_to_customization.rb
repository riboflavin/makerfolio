class AddKitKeyToCustomization < ActiveRecord::Migration
  def self.up
	  add_column :customizations, :kit_id, :integer
  end

  def self.down
	  remove_column :customizations, :kit_id
  end
end
