class AttachmentController < ApplicationController
  
  def find_master(params, type)
    user = User.where("username = ?", params[:username]).first

    if (user != nil)    
    
    case type
    when :kit
      Kit.where("token = ? AND slug = ? AND user_id = ?", params[:token], params[:slug].downcase, user.id).first
    when :kit_unprotected
      Kit.where("slug = ? AND user_id = ?", params[:slug].downcase, user.id).first
    end  
  
    end 
  end
  
  def destroy
    kit = find_master(params, :kit)
    if (kit == nil) 
      render :json => {:success => false, :message => "We couldn't find this kit."}
    else
      attachment = Attachment.where("id = ? AND attachable_id = ? AND attachable_type = ?", params[:id], kit.id, 'Kit').first
      if (attachment != nil && attachment.destroy)
        custs = Customization.where("id = ?", attachment.pseudo_id)
        custs.each do |c|
          c.destroy
        end
        render :json => {:success => true, :attached_id => attachment.attachable_id, :id => attachment.id, :pseudo_id => attachment.pseudo_id, :pseudo_type => attachment.pseudo_type}
      else
        render :json => {:success => false, :message => "There was an error deleting this attachment. (It may have already been deleted.)"}
      end
    end
  end
  
  def index
    kit = find_master(params, :kit_unprotected)
    if (kit == nil) 
      render :json => {:success => false, :status => "There was an error finding your kit."}
    else
      attachments = Attachment.where("attachable_id = ?", kit.id).where(:pseudo_id => nil).limit(5).order("updated_at desc")      
      attachments.each do |a|
        a[:att_id] = a.id
      end
      render :json => {:success => true, :attachments => attachments}
    end
  end

  def new  
    attachment = Attachment.new(:file => params[:files])
    attachment.file = FileUploader.new
    attachment.attachable = find_master(params, :kit)
    kit = attachment.attachable
    attachment.pseudo_id = params[:ps_id] unless (params[:ps_id].nil?)
    attachment.pseudo_type = params[:type] unless (params[:type] == 'kit')

    #check to see if there are any existing temporary pseudo attachments, and if so,
    #delete them 
    p = Attachment.where("attachable_id = ?", kit.id).where(:pseudo_id => nil).where(:pseudo_type => ['step','item','customization'])
    p.each do |p|
      p.destroy
    end

    if (kit.published == 'published' || kit.published == 'waiting')
#    Set the :json render content type to "text/html" because (1) file upload
#    JS uses iframes, (2) when you send JSON back to an iframe, IE tries to
#    download it as a file, (3) setting content type this way is the fix
    render :json => { :success => false, :message => "Sorry! You'll need to unpublish your kit to add new pictures." }.to_json, :content_type => "text/html"

    #todo: limit to 5 kit pictures and 1 picture per item
    elsif (attachment.file.store!)
      attachment.thumb_url = attachment.file.thumb.url    
      attachment.url = attachment.file.url    
      attachment.save
      attachment[:att_id] = attachment.id    
      render :json => {:success => true, :attachments => attachment}.to_json, 
        :content_type => "text/html"   
      else
    render :json => { :success => false, :message => "There was an error uploading your file." }.to_json, :content_type => "text/html"
    end
  end

end
