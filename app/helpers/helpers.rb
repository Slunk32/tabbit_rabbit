helpers do
	TITLE = 'Tabbit Rabbit'

	def dollarize(price)
		"$%.2f" % (price/100.0)
	end

	COLOR_CLASSES = ["success","info","warning","danger","primary","success","info","warning","danger","primary"]

	def authenticated?
		(! current_user.nil?)
	end

	def current_user
		begin
			return User.find(session[:user_id])
		rescue
			nil
		end
	end

	def get_items(params)
		items = []
		items_params = params.select { |k,v| k =~ /\d/ }
		items_params.each do |item_params|
			set_params = item_params[1].select {|_,v| (! v.empty?) }
			next if set_params.length < 3
			p set_params
			set_params[:name] = quantity_and_name(set_params['quantity'], set_params['name'])
			set_params[:price] = (set_params['price'].to_f * 100).to_i
			items << Item.create(name: set_params[:name],
												price: set_params[:price] )
		end
		items
	end

	def quantity_and_name(quantity, name)		
		case quantity
		when "1", 1, nil
			qanda = name
		else
			qanda = quantity + " " + name
		end
		qanda
	end
	
end