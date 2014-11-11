helpers do
	TITLE = 'Tabbit Rabbit'

	def dollarize(price)
		"$%.2f" % (price/100.0)
	end

	COLOR_CLASSES = ["success","info","warning","danger","primary"].each

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
	
end