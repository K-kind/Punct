creds = Aws::Credentials.new(
  Rails.application.credentials.dig(:ses, :access_key_id),
  Rails.application.credentials.dig(:ses, :secret_access_key)
)
Aws::Rails.add_action_mailer_delivery_method(:aws_sdk, credentials: creds, region: 'ap-northeast-1')
