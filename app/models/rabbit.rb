class Rabbit < ActiveRecord::Base
  has_and_belongs_to_many :items
  belongs_to :tab

  def subtotal
  	return 0 if items.empty?
  	(items.pluck[:price]).reduce(:+)
  end
end
