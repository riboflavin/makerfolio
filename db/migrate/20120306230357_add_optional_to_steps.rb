class AddOptionalToSteps < ActiveRecord::Migration
  def self.up
      add_column :steps, :optional, :boolean
  end

  def self.down
      remove_column :steps, :optional
  end
end
