require "csv"

FILE = APP_ROOT.join('db','TestReceipt.txt')

[Tab,Rabbit,Item].each do |table|
	table.send(:delete_all)
end


file = CSV.read(FILE, {:col_sep => "\t"})
tab = Tab.create()

file.each do |item|
	name = item[0]
	price = 100 * item[1].to_i
	Item.create(name: name, price: price, tab_id: tab.id)
end

rabbit = Rabbit.create(	name: 'Andrew',
												email: 'andrew.m.archer@gmail.com',
												phone_number: '415-555-5555'
											)

tab.rabbits << rabbit