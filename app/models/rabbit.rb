class Rabbit < ActiveRecord::Base
  has_and_belongs_to_many :items
  has_and_belongs_to_many :tabs
  belongs_to :user

  def subtotal
  	return 0 if items.empty?
  	(items.pluck[:price]).reduce(:+)
  end
end
