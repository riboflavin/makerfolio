class RemoveRefFromKitsAndAddDescription < ActiveRecord::Migration
  def self.up
       add_column :kits, :description, :string
  end

  def self.down
       remove_column :kits, :description
  end
end
