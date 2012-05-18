class AddColumnsAndRemoveImageColumnsFromKit < ActiveRecord::Migration
  def self.up
       remove_column :kits, :image1
       remove_column :kits, :image2
       remove_column :kits, :image3
       remove_column :kits, :image4
       remove_column :kits, :image5
       add_column :kits, :author, :string
       add_column :kits, :contact, :string
  end

  def self.down
       add_column :kits, :image1, :string
       add_column :kits, :image2, :string
       add_column :kits, :image3, :string
       add_column :kits, :image4, :string
       add_column :kits, :image5, :string
       remove_column :kits, :author
       remove_column :kits, :contact
  end
end
