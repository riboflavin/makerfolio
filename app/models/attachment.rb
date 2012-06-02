class Attachment  
  include Mongoid::Document

  embedded_in :attachable, :polymorphic => true

  attr_accessible :file, :attachable_id, :attachable_type
  mount_uploader :file, FileUploader 

  def attachable_type=(sType)
     super(sType.to_s.classify.constantize.base_class.to_s)
  end
end
