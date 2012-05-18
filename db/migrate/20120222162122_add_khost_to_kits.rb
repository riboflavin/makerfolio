class AddKhostToKits < ActiveRecord::Migration
  def self.up
      add_column :kits, :khost, :boolean
  end

  def self.down
      remove_column :kits, :khost
  end
end
