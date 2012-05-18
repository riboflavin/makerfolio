class ItemController < ApplicationController
  def index
    user = User.where("username = ?", params[:username]).first    
    items = []
    
    if (user != nil)    
      kit = Kit.where("slug = ? AND user_id = ?", params[:slug].downcase, user.id).first
    
      if (kit != nil)
        items = Item.where("kit_id = ?", kit.id).order("created_at")
        items.each do |i|
          att = Attachment.where("attachable_id = ? AND pseudo_type = ? AND pseudo_id = ?", kit.id, 'item', i.id).first()
          (i[:url] = att.url) unless att.nil?
          (i[:thumb_url] = att.thumb_url) unless att.nil?
          (i[:att_id] = att.id) unless att.nil?
        end
      end
    end
    
    render :json => items
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
        item = Item.new
        item.kit_id = kit.id
        item.name = params[:name]
        item.quantity = params[:quantity].to_i
        item.merchant_url = params[:merchant_url].gsub('http://','')
        item.optional = params[:optional]
        item.heavy = params[:heavy]
        item.units = params[:units]
        item.notes = params[:notes]

        item.save

        pseudo_temp = Attachment.where("attachable_id = ? AND pseudo_type = ?", kit.id, 'item').where(:pseudo_id => nil).first
        if (pseudo_temp != nil)
          pseudo_temp.pseudo_id = item.id
          pseudo_temp.save
          item[:url] = pseudo_temp.url
          item[:thumb_url] = pseudo_temp.thumb_url
        end

        render :json => item
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
        item = Item.where("id = ?", params[:id]).first

        if(item == nil)
          resp[:message] = "Item couldn't be found."
        else
          item.name = params[:name]
          item.quantity = params[:quantity].to_i
          item.merchant_url = params[:merchant_url]
#          item.price = params[:price].to_f
          item.notes = params[:notes]
          item.optional = params[:optional]
          item.heavy = params[:heavy]
          item.units = params[:units]
  
#         standardize return / result codes... return array as with kits?
          item.save

          att = Attachment.where("attachable_id = ? AND pseudo_type = ? AND pseudo_id = ?", kit.id, 'item', item.id).first()
          (item[:url] = att.url) unless att.nil?
          (item[:thumb_url] = att.thumb_url) unless att.nil?
          (item[:att_id] = att.id) unless att.nil?

          resp = item
        end
      end
    end
    
    render :json => resp
  end
  
  def destroy
    resp = { :success => false, :message => "Something went wrong." }
    
    user = User.where("username = ?", params[:username]).first
    
    if (user == nil)
      resp[:message] = "User couldn't be found"
    else
      kit = Kit.where("slug = ? AND user_id = ? AND token = ?", params[:slug].downcase, user.id, params[:token]).first

      if(kit == nil)
        resp[:message] = "Kit couldn't be found."
      else
        item = Item.find(params[:id])
        
        if (item == nil)
          resp[:message] = "Item couldn't be found."
        else
          att = Attachment.where("attachable_id = ? AND pseudo_type = ? AND pseudo_id = ?", kit.id, 'item', item.id).first()
          att.delete unless att.nil?
          item.delete
          resp = { :success => true, :id => item.id }
        end
      end
    end
    
    render :json => resp
  end
end
