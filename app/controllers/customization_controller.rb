class CustomizationController < ApplicationController
  def index
    user = User.where("username = ?", params[:username]).first
    
    if (user != nil)    
      kit = Kit.where("slug = ? AND user_id = ?", params[:slug].downcase, user.id).first
    
      if (kit != nil)
        customizations = Customization.where("kit_id = ?", kit.id).order("created_at")
        customizations.each do |c|
          att = Attachment.where("attachable_id = ? AND pseudo_type = ? AND pseudo_id = ?", kit.id, 'customization', c.id).first()
          (c[:value] = "url(#{att.url})") unless att.nil?
          (c[:url] = att.url) unless att.nil?
          (c[:thumb_url] = att.thumb_url) unless att.nil?          
        end
      end
    end
    
    render :json => customizations
  end
  
  def new
    user = User.where("username = ?", params[:username]).first
    
    if (user == nil)
      render :json => { :success => false, :message => "User couldn't be found." }
    else
      kit = Kit.where("slug = ? AND user_id = ? AND token = ?", params[:slug].downcase, user.id, params[:token]).first
      if (kit == nil)
      render :json => { :success => false, :message => "Kit couldn't be found." }
    	else
	     params['customizations'].each do |p| 
	   	 element = p[0]
       customizations_array = p[1]
		        
          customizations_array.each do |_k,_v|
          property = _k
          cust = Customization.find_or_initialize_by_kit_id_and_element_and_property(kit.id, element, property)
 	     		cust.value = _v            
          cust.save
            
            if (_k == 'background_image')
            pseudo_temp = Attachment.where("attachable_id = ? AND pseudo_type = ?", kit.id, 'customization').where(:pseudo_id => nil).first
            (pseudo_temp.pseudo_id = cust.id) unless pseudo_temp.nil?
            (pseudo_temp.save) unless pseudo_temp.nil?
            end

            if (_v == 'none' ) 
              cust.destroy unless cust.nil?
=begin
              att = Attachment.where("attachable_id = ? AND pseudo_type = ? AND pseudo_id = ?", kit.id, 'customization', cust.id)
              att.each do |a|
                a.destroy
              end              
=end
            end
          end
           
			  #customizations = Customization.where("kit_id = ?", kit.id).order("created_at")
       end
       render :json => {:success => true}
	   	end
    end
  end
end