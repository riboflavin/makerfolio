class Project 
  include Mongoid::Document
  include Mongoid::Timestamps

  field :name
  field :description

  embedded_in :user
  embeds_many :attachments, :as => :attachable

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
