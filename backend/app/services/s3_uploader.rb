class S3Uploader
  attr_reader :file, :key, :bucket
  def initialize(file, key)
    @file = file
    @key = key
    @bucket = Aws::S3::Resource.new.bucket(ENV['AWS_BUCKET_NAME'])
  end

  def upload
    object = bucket.object(key)
    object.upload_file(file, acl: 'public-read')
    object.public_url
  rescue Aws::S3::Errors::ServiceError => e
    Rails.logger.error "S3 upload failed: #{e.message}"
    nil
  end
end