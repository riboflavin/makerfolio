class User
  include Mongoid::Document
  include Mongoid::Timestamps

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable

  embeds_many :projects
  embeds_many :attachments, :as => :attachable

  attr_accessible :email, :password, :password_confirmation, :remember_me, :username
end
