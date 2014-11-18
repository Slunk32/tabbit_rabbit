after do
  ActiveRecord::Base.clear_active_connections!
end

post '/tab/:tab_id/rabbit/new' do
	user = current_user
	rabbit = Rabbit.new(name: params[:name], phone_number: params[:phone_number], email: params[:email])
	tab = Tab.find(params[:tab_id])
	rabbit.tabs << tab
	rabbit.user = user
	if rabbit.save
		content_type :json
		rabbit.to_json
	else
		halt 400, rabbit.errors.to_json
	end
end

# edit the rabbit
put '/rabbit/:rabbit_id' do
	rabbit = Rabbit.find(params[:rabbit_id])
	if rabbit.update_params(params)
		content_type :json
		rabbit.to_json
	else
		halt 400, rabbit.errors.to_json
	end
end

# remove the rabbit from the tab (but not from the DB!)
delete '/tab/:tab_id/rabbit/:rabbit_id' do
	tab = Tab.find(params[:tab_id])
	rabbit = Rabbit.find(params[:rabbit_id])
	if tab && tab.rabbits.delete(rabbit)
		content_type :json
		{id: rabbit.id}.to_json
	else
		halt 400, rabbit.errors.to_json
	end
end

# remove the rabbit entirely
delete '/rabbit/:rabbit_id' do
	rabbit = Tab.find(params[:rabbit_id])
	if rabbit.destroy
		204
	else
		halt 400, rabbit.errors.to_json
	end
end