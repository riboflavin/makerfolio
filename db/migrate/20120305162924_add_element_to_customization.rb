class AddElementToCustomization < ActiveRecord::Migration
  def self.up
  add_column :customizations, :element, :string
  end

  def self.down
  remove_column :customizations, :element
  end
end
