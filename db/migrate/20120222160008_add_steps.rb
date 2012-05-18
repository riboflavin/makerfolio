class AddSteps < ActiveRecord::Migration
  def self.up
    create_table :steps do |t|
      t.integer :kit_id
      t.string :title
      t.string :num
      t.text :instructions

      t.timestamps
    end

  end

  def self.down
	 drop_table "steps"	  
  end
end
