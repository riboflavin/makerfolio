class StepController < ApplicationController
  def index
    user = User.where("username = ?", params[:username]).first
    steps = []
    
    if (user != nil)    
      kit = Kit.where("slug = ? AND user_id = ?", params[:slug].downcase, user.id).first
    
      if (kit != nil)
        #todo: num is a string column, this forces sort as if integer
        steps = Step.where("kit_id = ?", kit.id).order("num + 1")
        steps.each do |s|
          att = Attachment.where("attachable_id = ? AND pseudo_type = ? AND pseudo_id = ?", kit.id, 'step', s.id).first()
          (s[:url] = att.url) unless att.nil?
          (s[:thumb_url] = att.thumb_url) unless att.nil?
          (s[:att_id] = att.id) unless att.nil?
        end
      end
    end
    
    render :json => steps
  end
  
  def find_nextstep(kit_id)
        max_step = Step.where("kit_id = ?", kit_id).maximum(:num).to_f
        next_step = [max_step + 1, 1].max.to_i
  end

  def create
    user = User.where("username = ?", params[:username]).first
    
    if (user == nil)
      render :json => { :success => false, :message => "User couldn't be found" }
    else
      kit = Kit.where("slug = ? AND user_id = ? AND token = ?", params[:slug].downcase, user.id, params[:token]).first

      if (kit == nil)
        render :json => { :success => false, :message => "Kit couldn't be found." }
      else
        step = Step.new
        step.kit_id = kit.id
        step.title = params[:title]
        step.instructions = params[:instructions]
        step.num = find_nextstep(kit.id)
        step.optional = params[:optional]
        step.save

        pseudo_temp = Attachment.where("attachable_id = ? AND pseudo_type = ?", kit.id, 'step').where(:pseudo_id => nil).first
        if (pseudo_temp != nil)
          pseudo_temp.pseudo_id = step.id
          pseudo_temp.save
          step[:url] = pseudo_temp.url
          step[:thumb_url] = pseudo_temp.thumb_url
        end

        render :json => step
      end
    end
  end
  
  def update
    resp = { :success => false, :message => "Something went wrong." }
    
    user = User.where("username = ?", params[:username]).first
    
    if (user == nil)
      resp[:message] = "User couldn't be found"
    else
      kit = Kit.where("slug = ? AND user_id = ? AND token = ?", params[:slug].downcase, user.id, params[:token]).first
      
      if(kit == nil)
        resp[:message] = "Kit couldn't be found."
      elsif(kit.published == 'published' || kit.published == 'waiting')
        resp[:message] = "Sorry! You'll need to unpublish your kit to edit it."
      else
        step = Step.where("id = ?", params[:id]).first

        if(step == nil)
          resp[:message] = "Step couldn't be found."
        else
        step.title = params[:title]
        step.instructions = params[:instructions]
        step.optional = params[:optional]
        if !(step.num.to_f) 
          step.num = find_nextstep(kit.id)
        end 
        # standardize return / result codes... return array as with kits?
        step.save

        att = Attachment.where("attachable_id = ? AND pseudo_type = ? AND pseudo_id = ?", kit.id, 'step', step.id).first()
        (step[:url] = att.url) unless att.nil?
        (step[:thumb_url] = att.thumb_url) unless att.nil?
        (step[:att_id] = att.id) unless att.nil?

        resp = step
        end
      end
    end

    render :json => step
  end

  def reorder
    resp = { :success => false, :message => "Something went wrong." }
    order_data = {}    
    user = User.where("username = ?", params[:username]).first
    
    if (user == nil)
      resp[:message] = "User couldn't be found"
    else
      kit = Kit.where("slug = ? AND user_id = ? AND token = ?", params[:slug].downcase, user.id, params[:token]).first
      
      if(kit == nil)
        resp[:message] = "Kit couldn't be found."
      elsif(kit.published == 'published' || kit.published == 'waiting')
        resp[:message] = "Sorry! You'll need to unpublish your kit to edit it."
      else
        steps = Step.where("kit_id = ?", kit.id).order("num")
        steps_user = params[:order]
        steps_user.each do |s|
           s = s[1]
           step_db = steps.where("id = ? AND kit_id = ?", s['id'], kit.id).first
           step_db.num = s['order']
           order_data.merge!(step_db.num => step_db.id)
           step_db.save
        end
        resp = { :success => true, :order => order_data }
      end        
    end
    
    render :json => resp
  end
  
  def destroy
    resp = { :success => false, :message => "Something went wrong." }
    
    user = User.where("username = ?", params[:username]).first
    
    if (user == nil)
      resp[:message] = "User couldn't be found."
    else
      kit = Kit.where("slug = ? AND user_id = ? AND token = ?", params[:slug].downcase, user.id, params[:token]).first

      if(kit == nil)
        resp[:message] = "Kit couldn't be found."
      else
        step = Step.find(params[:id])
        
        if (step == nil)
          resp[:message] = "Step couldn't be found."
        else
          att = Attachment.where("attachable_id = ? AND pseudo_type = ? AND pseudo_id = ?", kit.id, 'step', step.id).first()
          att.destroy unless att.nil?
          step.destroy
          resp = { :success => true, :id => step.id }
        end
      end
    end
    
    render :json => resp
  end
end
