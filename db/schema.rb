# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120310194657) do

  create_table "attachments", :force => true do |t|
    t.string   "file"
    t.integer  "attachable_id"
    t.string   "attachable_type"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "url"
    t.string   "thumb_url"
    t.string   "pseudo_type"
    t.integer  "pseudo_id"
    t.string   "secure_token"
  end

  create_table "customizations", :force => true do |t|
    t.string   "property"
    t.string   "cssproperty"
    t.string   "value"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "element"
    t.integer  "kit_id"
  end

  create_table "items", :force => true do |t|
    t.integer  "kit_id"
    t.string   "name"
    t.integer  "quantity"
    t.string   "merchant_url"
    t.decimal  "price",        :precision => 10, :scale => 0
    t.text     "notes"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "image"
    t.string   "vendor"
    t.boolean  "optional"
    t.boolean  "heavy"
    t.integer  "shiptime"
    t.float    "weight"
    t.string   "units"
  end

  create_table "kits", :force => true do |t|
    t.string   "title"
    t.string   "token"
    t.string   "slug"
    t.string   "ref"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.integer  "user_id"
    t.string   "instructions"
    t.string   "published"
    t.string   "author"
    t.string   "contact"
    t.boolean  "khost"
    t.string   "description"
  end

  create_table "steps", :force => true do |t|
    t.integer  "kit_id"
    t.string   "title"
    t.string   "num"
    t.text     "instructions"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.boolean  "optional"
  end

  create_table "users", :force => true do |t|
    t.string   "username"
    t.string   "password"
    t.string   "firstname"
    t.string   "lastname"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "email"
    t.string   "crypted_password"
    t.string   "password_salt"
    t.string   "persistence_token"
  end

end
