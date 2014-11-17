get '/' do
	if authenticated?
		@user = current_user
		@tabs = Tab.where(user_id: @user.id).order(id: :desc)
	else
		@tabs = nil
	end

	erb :home
end

before '/tabs/*' do
	redirect '/login' unless authenticated?
end

get '/tabs/new' do
	@tab = session[:tab]
	@errors = session[:errors]
	session[:errors] = nil
	session[:tab] = nil
	erb :'tab/create'
end

post '/tabs/new' do
  @user = current_user
  @tab = Tab.create(name: "Untitled Tab")
  @tab.items = get_items(params)
  @tab.user = @user
  @tab.rabbits << Rabbit.find(@user.avatar_rabbit_id)
  if @tab.save
    redirect "/tab/#{@tab.id}"
  else
    session[:tab] = @tab
    session[:errors] = "Could not save tab"
    redirect '/tab/new'
  end
end

get '/tab/:tab_id/totals' do
	@user = current_user
	@tab = Tab.includes(:items).find(params[:tab_id])
	@rabbits = @tab.rabbits
	@subtotal = @rabbits.map { |rabbit| rabbit.subtotal(@tab) }.reduce(:+)
	erb :'tab/totals'
end


get '/tab/:tab_id' do
	if request.xhr?
		content_type :json
		tab = Tab.includes(:rabbits).includes(:items).find(params[:tab_id])
		rabbits = tab.rabbits
		items = tab.items
		{tab: tab, rabbits: rabbits, items: items, item_owners: item_owners(items)}.to_json
	else
		@user = current_user
		@tab = Tab.includes(:items).find(params[:tab_id])
		@rabbits = @tab.rabbits
		@unused_rabbits = @user.rabbits.reject { |rabbit| @tab.rabbits.include?(rabbit) }
		erb :'tab/tab'
	end
end

post '/tab/:id/rename' do
	@tab = Tab.find(params[:id])
	content_type :json
	if @tab.update_attributes(name: params[:value])
		{id: @tab.id}.to_json
	else
		{errors: @tab.errors}.to_json
	end
end

put '/tab/:tab_id' do
	if request.xhr?
		@tab = Tab.find(params[:tab_id])
		# {"items"=>{"16"=>["1"], "17"=>["21"]}, "splat"=>[], "captures"=>["18"], "tab_id"=>"18"}
		params['items'].each do |item_id, rabbits|
			item = Item.find(item_id.to_i)
			item.rabbits = rabbits.map{ |rabbit| Rabbit.find(rabbit.to_i) }
			item.save!
		end
		content_type :json
		tab = Tab.includes(:rabbits).includes(:items).find(params[:tab_id])
		rabbits = tab.rabbits
		items = tab.items.includes(:rabbits)
		{tab: tab, rabbits: rabbits, items: items}.to_json
	end
end

post '/tab/newimage' do
	@image = params[:image]
end

post '/tab/:tab_id/sms' do
	@user = current_user
	account_sid = ENV['TWILIOSID']
	auth_token = ENV['TWILIOAUTHTOKEN'] 

	@client = Twilio::REST::Client.new account_sid, auth_token 

	body = "#{@user.name} requests payment of #{params[:total]}. See your tab online at http://#{request.host}/tab/#{params[:tab_id]}"
	
	@client.account.messages.create({
		:from => '+18327722248', 
		:to => params[:phone], 
		:body => body
	})

	# uri = "https://api.twilio.com/2010-04-01/Accounts/AC4dd9d8bed4276df4336151a0a8d1ac02/Messages"
	# 
	# p params['phone']
	# p params[:phone]
	# p body
	# response = HTTParty.post(uri, body: {
	# 	:from => '+18327722248', 
	# 	:to => '4152094815', 
	# 	:body => 'Hello from Tabbit Rabbit',  
	# 	:status_callback => 'http://localhost:9393/twiliostatus',
	# 	:Authorization => "Basic AC4dd9d8bed4276df4336151a0a8d1ac02:d281581fcfd0adb3590de5d07807fcc7"
	# 	})
	# To: '+1' + params['phone'],
	# Body: body,
	# StatusCallback: 'http://localhost:9393/twiliostatus',
	# Auth_Token: 'AC4dd9d8bed4276df4336151a0a8d1ac02',
	# Account_Sid: 'd281581fcfd0adb3590de5d07807fcc7'
end

post '/twiliostatus' do 
	p request
	p request.body
end

get '/add_venmo' do
	url = "https://api.venmo.com/v1/oauth/authorize?client_id=#{ENV['VENMOID']}&scope=make_payments&response_type=code&redirect_uri=http://tabbitrabbit.herokuapp.com/venmo/#{current_user.id}"
	redirect url
end


get '/venmo/:user_id' do
	params[:code]
	url = 'https://api.venmo.com/v1/oauth/access_token'
	response = HTTParty.post(url, body: {
		"client_id" => ENV['VENMOID'],
		   "client_secret" => ENV['VENMOSECRET'],
		   "code" => params[:code]
		})
	@response
	erb :response
	# parsed_response = JSON.parse(response)
	# p parsed_response
	# # @user = User.find(params[:user_id])
	# # @user.vm_authtoken = parsed_response[:access_token]
	# # @user.vm_authrefreshtoken = parsed_response[:refresh_token]
	# # @user.save
	# parsed_response
end

post '/venmo' do
	p request
end
