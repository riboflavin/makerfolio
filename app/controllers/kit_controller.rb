class KitController < ApplicationController

#take this out when @price view logic is moved to a helper
include ActionView::Helpers::NumberHelper
include ActionView::Helpers::TextHelper
  
  def getkits
      @kits = Kit.where("published = ?", "published").limit(5)
      @return_kits = @kits.clone
  
      @return_kits.each do |k|
      k[:price] = Item.where("kit_id = ? AND optional = false", k.id).sum(:price)
      k[:src] = Attachment.where("attachable_id = ? AND attachable_type = ?", k.id, 'kit').first().thumb_url
      k[:username] = User.where("id = ?", k.user_id).first().username
      k[:link_to_kit] = "#{k[:username]}/#{k.slug}/"
      end

      render :json => @return_kits
  
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
        kit.destroy    
        resp = { :success => true, :id => kit.id }
      end
    end  
    render :json => resp
  end

  def browse
  end
  
  def index
    @user = User.where("username = ?", params[:username]).first    
    if (@user == nil)
        render "notfound"
    else
      @kit = Kit.where("slug = ?", params[:slug].downcase).first
      
      if (@kit == nil)
        render "notfound"
      else
        @editable = (params[:token] != nil && params[:token] == @kit.token)
        @hasoptionals = true if (Item.where("kit_id = ? AND optional = true", @kit.id).count > 0)        
        @price = Item.where("kit_id = ? AND optional = false", @kit.id).sum(:price)
        #move this to a helper
        @price = number_to_currency(@price, :locale => :us, :precision => 2)
        @customizations = Customization.where("kit_id = ?", @kit.id)
      
        #check to see if there are any existing temporary pseudo attachments. if so,
        #delete them - specify non-kit objects since kit attachments will *never* have
        #a pseudo_id
        p = Attachment.where("attachable_id = ?", @kit.id).where(:pseudo_id => nil).where(:pseudo_type => ['step','item','customization'])
        p.each do |p|
          p.destroy
        end

        #if the previous 5 lines did what they were supposed to, all remaining 
        #attachments with no pseudo_id (and no pseudo_type) should be kit attachments
        @attachments = Attachment.where("attachable_id = ?", @kit.id).where(:pseudo_id => nil).where(:pseudo_type => nil).limit(5)
      
        @embed = true if (params[:e] == 'y')
        if @embed
          @topbar_v = 'hide'
          @bottombar_v = 'hide'
          render 'embed'
        end

      end
    end
  end
  
  def new
  end
  
  def create
      params[:title] ||= 'New Kit'

      user_id = nil
      username = ''
      
      if(cookies[:username] != nil)
        user = User.where("username = ?", cookies[:username]).first
        if(user != nil)
          user_id = user.id
          username = user.username
        end
      end
      
      if(user_id == nil)
        user = User.new
        user.username = User.generate_unique_username
        user.save
        user_id = user.id
        cookies[:username] = { :value => user.username, :expires => 1.year.from_now }
        username = user.username
      end
      
      kit = Kit.new
      kit.title = params[:title]
      kit.user_id = user_id
      kit.token = Kit.generate_unique_token!
      kit.generate_slug
      kit.author = ""
      kit.contact = ""
      kit.instructions = ""
      kit.published = "unpublished"
      kit.khost = true
      kit.save
      
      redirect_to "/#{username}/#{kit.slug}/#{kit.token}"
  end
  
  def update
    kit = Kit.where("slug = ? AND token = ?", params[:slug].downcase, params[:token]).first
    
    if (kit == nil)
      render :json => { :success => false, :message => "There was an error finding your kit." }
    elsif ((kit.published == 'published' || kit.published == 'waiting') && params[:published] != 'unpublished')
      render :json => { :success => false, :message => "Sorry! You'll need to unpublish your kit before you can make any changes." }
    else
      username = User.where("id = ?", kit.user_id).first().username

      #fix possible nulls
      kit.khost ||= false
      kit.published ||= "unpublished"

      #quick way to overwrite what's in the database with what the client submits
      kit.instructions = params[:instructions] || kit.instructions
      kit.author = params[:author] || kit.author
      kit.khost = params[:khost] || kit.khost
      kit.description = truncate(params[:description], :length => 200, :separator => ' ') || kit.description
      
      #more complicated handling for things we don't want to do every time
      if(params[:title] != nil && params[:title] != kit.title)
        kit.title = params[:title]
        kit.generate_slug
        result_code = :redirect
        Mailer.welcome(kit.contact,"","kitify.com/#{params[:username].downcase}/#{params[:slug].downcase}/#{params[:token]}","kitify.com/#{params[:username].downcase}/#{params[:slug].downcase}/#{params[:token]}").deliver
      end

      if(params[:contact] != nil && params[:contact] != kit.contact)
        if (kit.contact != "")
        #add a method to model to get URL
        Mailer.changed(params[:contact],kit.contact,"kitify.com/#{params[:username].downcase}/#{params[:slug].downcase}/#{params[:token]}","kitify.com/#{params[:username].downcase}/#{params[:slug].downcase}/#{params[:token]}").deliver
        result_code = :changed
        else
        Mailer.welcome(params[:contact],"","kitify.com/#{params[:username].downcase}/#{params[:slug].downcase}/#{params[:token]}","kitify.com/#{params[:username].downcase}/#{params[:slug].downcase}/#{params[:token]}").deliver
        result_code = :sent
        end
        kit.contact = params[:contact]
      end

      kit.published = (params[:published] || kit.published)

        if (kit.published == 'waiting')
        Mailer.waiting("kitify.com/#{params[:username].downcase}/#{params[:slug].downcase}/#{params[:token]}").deliver
        end

      kit.save ? result_code ||= true : result_code = false        
      render :json => {:success => result_code, :kit => kit}
    end
    
  end
end
