class Customization < ActiveRecord::Base
  belongs_to :kit
  attr_accessible :property, :cssproperty, :value, :element
end
