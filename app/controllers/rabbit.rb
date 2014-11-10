post '/tab/:tab_id/rabbit/new' do
	rabbit = Rabbit.new(name: params[:name], phone_number: params[:phone_number], email: params[:email], )
	tab = Tab.find(params[:tab_id])
	tab.rabbits << rabbit
	if rabbit.save
		content_type :json
		rabbit.to_json
	else
		p rabbit.errors
		status 500
	end
end