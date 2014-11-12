require 'aws-sdk'

AWS.config({
:access_key_id => ENV['AWSACCESSKEYID'],
:secret_access_key => ENV['AWSSECRETKEY'],
})

class Image < AWS::Record::Base
  attr_accessible :image


  def upload_file
	  # get an instance of the S3 interface using the default configuration
	  file_name = APP_ROOT.join('public', 'img', 'test_receipt.jpg')
	  s3 = AWS::S3.new

	  # find a bucket
	  # b = s3.buckets.create(bucket_name)
	  bucket = s3.buckets['tabbitrabbit']

	  # upload a file
	  basename = File.basename(file_name)
	  o = bucket.objects[basename]

	  # obj = bucket.objects.create('key', 'data')

	  o.write(:file => file_name)

	  puts "Uploaded #{file_name} to:"
	  puts o.public_url

	  # generate a presigned URL
	  puts "\nUse this URL to download the file:"
	  puts o.url_for(:read)
	end
	  # puts "(press any key to delete the object)"
	  # $stdin.getc

	  # o.delete

end 