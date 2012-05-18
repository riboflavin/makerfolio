class AlterKitsPublishedToValues < ActiveRecord::Migration
  def self.up
    change_column :kits, :published, :string
  end

  def self.down
    change_column :kits, :published, :boolean
  end
end
