class MoreUserFields < ActiveRecord::Migration
  def self.up
      add_column :items, :image, :string
      add_column :items, :vendor, :string
      add_column :items, :optional, :boolean
      add_column :items, :heavy, :boolean
      add_column :items, :shiptime, :integer
      add_column :items, :weight, :float
    
      add_column :kits, :instructions, :string
      add_column :kits, :published, :boolean
      add_column :kits, :image1, :string
      add_column :kits, :image2, :string
      add_column :kits, :image3, :string
      add_column :kits, :image4, :string
      add_column :kits, :image5, :string

      add_column :users, :email, :string
      add_column :users, :crypted_password, :string
      add_column :users, :password_salt, :string
      add_column :users, :persistence_token, :string
    end    

  def self.down
      remove_column :items, :image, :string
      remove_column :items, :vendor, :string
      remove_column :items, :optional, :boolean
      remove_column :items, :heavy, :boolean
      remove_column :items, :shiptime, :integer
      remove_column :items, :weight, :float
    
      remove_column :kits, :instructions, :string
      remove_column :kits, :published, :boolean
      remove_column :kits, :image1, :string
      remove_column :kits, :image2, :string
      remove_column :kits, :image3, :string
      remove_column :kits, :image4, :string
      remove_column :kits, :image5, :string

      remove_column :users, :username, :string
      remove_column :users, :email, :string
      remove_column :users, :crypted_password, :string
      remove_column :users, :password_salt, :string
      remove_column :users, :persistence_token, :string
    end    
end
