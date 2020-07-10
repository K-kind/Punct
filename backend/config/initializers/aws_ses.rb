ActionMailer::Base.add_delivery_method :ses,
                                       AWS::SES::Base,
                                       access_key_id: Rails.application.credentials.dig(:ses, :access_key_id),
                                       secret_access_key: Rails.application.credentials.dig(:ses, :secret_access_key),
                                       server: 'email.ap-northeast-1.amazonaws.com'
