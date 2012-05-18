class Kit < ActiveRecord::Base
  belongs_to :users
  has_many :items, :dependent => :destroy
  has_many :steps, :dependent => :destroy
  has_many :customizations, :dependent => :destroy
  
  attr_accessible :title, :description, :attachments_attributes
  has_many :attachments, :as => :attachable, :dependent => :destroy

  validates :published, :inclusion => { :in => %w(unpublished waiting published),
    :message => "%{value} is not a valid value" }  
  
#  more validation needed
  
  def self.generate_token
    chars = 'abcdefghjkmnpqrstuvwxyzABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    token = ''
    8.times { token << chars[rand(chars.size)] }
    token
  end
  
  def self.generate_unique_token!
    token = self.generate_token
    
    existing = self.where("token = '#{token}'")
    
    if(existing.count > 0)
      token = self.generate_unique_token!
    end
    
    token
  end
  
  def generate_slug 
    slug = self.title.gsub(/[^\w\s]/, '')
    slug = slug.gsub(/[\s]/, '-')
    limit = 255 - (self.id.to_s.length + 1)
    slug = slug[0, limit]
    slug.downcase!
    
    slug_increment = 0
    #grab all the kits at once instead of running loop below 300 times (for example)
    #todo: this is probably not a great solution
    existing_count = Kit.where("slug LIKE ?", "%#{slug}%").count
    
    while (existing_count > 0)
      slug_increment = slug_increment + existing_count
      slug_newname = slug + "-" + (slug_increment + 1).to_s
      existing_count = Kit.where("slug LIKE ?", "%#{slug_newname}%").count
    end

    slug = slug_newname || slug
    self.slug = slug
  end

end
