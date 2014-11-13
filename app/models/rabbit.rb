class Rabbit < ActiveRecord::Base
  has_and_belongs_to_many :items
  has_and_belongs_to_many :tabs
  belongs_to :user

  def subtotal(tab)
  	return 0 if items.empty?
  	return 0 unless self.tabs.include?(tab)
  	sum = 0
  	tab.items.each do |item|
  		if item.rabbits.include?(self)
  			sum += ( item.price / (1.0 * item.rabbits.length) )
  		end
  	end
  	sum
  end
end
