class ContentController < ApplicationController
  
  def about
    @active = "about"
  end

  def contact
    @active = "contact"
  end

  def tandc
    @active = "tandc"
  end

end
