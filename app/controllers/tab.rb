after do
  ActiveRecord::Base.clear_active_connections!
end

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
	@tab = Tab.find(params[:tab_id])

	unless @user.vm_authtoken.nil?
		# venmo_url = 'https://api.venmo.com/v1/payments'
		# res = HTTParty.post(url, body: { "access_token" => @user.vm_authtoken,
		# 	'audience' => 'friends',
		# 	'note' => "Our tab on Tabbit Rabbit",
		# 	'amount' => '-' + params[:total],
		# 	'phone' => params[:phone]})
		body += " Pay easily with Venmo: https://venmo.com/?txn=pay&recipients=#{@user.phone_number}&amount=#{params[:total]}&note=#{@tab.name}"
	end

	@client.account.messages.create({
		:from => '+18327722248', 
		:to => params[:phone], 
		:body => body
	})

end

post '/twiliostatus' do 
	p request
	p request.body
end

get '/add_venmo' do
	url = "https://api.venmo.com/v1/oauth/authorize?client_id=#{ENV['VENMOID']}&scope=make_payments&response_type=code&redirect_uri=http://tabbitrabbit.herokuapp.com/venmo/#{current_user.id}/"
	redirect url
end


get '/remove_venmo' do
	@user = current_user
	@user.vm_authtoken = nil
	@user.vm_authrefreshtoken = nil
	@user.save
	redirect '/'
end

get '/venmo/:user_id/' do
	url = 'https://api.venmo.com/v1/oauth/access_token'
	res = HTTParty.post(url, body: { "client_id" => ENV['VENMOID'], "client_secret" => ENV['VENMOSECRET'], "code" => params[:code] })
	@user = User.find(params[:user_id])
	@user.vm_authtoken = res['access_token']
	@user.vm_authrefreshtoken = res['refresh_token']
	@user.save
	redirect '/'
end

post '/venmo' do
	p request
end
