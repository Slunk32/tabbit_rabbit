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
	uri = "https://api.twilio.com/2010-04-01/Accounts/AC4dd9d8bed4276df4336151a0a8d1ac02/Messages"
	p uri
	HTTParty.post(uri,body: {
		'From' => '+18327722248',
		'To' => '+1' + params[:phone],
		'Body' => "#{params[:name]} just calculated your tab using Tabbit Rabbit. See your tab online at http://#{request.host}/tab/#{params[:tab_id]}"})
end