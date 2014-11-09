require 'date'

class CreateBaseSchema < ActiveRecord::Migration
  def change
  	create_table :tabs do |t|
  		t.string :name, default: "Untitled Tab"
  		t.date :dine_date, default: Date.today
  		t.text :raw_text
  		t.string :url
  		t.string :img_url
  		t.timestamps
  	end

  	create_table :items do |t|
  		t.string :name
      t.integer :price
  		t.belongs_to :tab
  		t.timestamps
  	end

  	create_table :rabbits do |t|
  		t.string :name
  		t.string :email
  		t.string :phone_number
      t.belongs_to :tab
  		t.timestamps
  	end

  	create_table :rabbits_tabs do |t|
  		t.belongs_to :tab
  		t.belongs_to :rabbit
  		t.timestamps
  	end

  	create_table :items_rabbits do |t|
	  	t.belongs_to :item
	  	t.belongs_to :rabbit
	  	t.timestamps	
	  end
  end
end
