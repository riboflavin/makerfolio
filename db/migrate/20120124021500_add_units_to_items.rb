class AddUnitsToItems < ActiveRecord::Migration
  def self.up
         add_column :items, :units, :string
  end

  def self.down
         remove_column :items, :units
  end
end
