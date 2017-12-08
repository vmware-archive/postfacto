require 'sendgrid_vcap_parser'

describe SendgridVCAPParser do
  it 'parses a CF-style VCAP_SERVICES string to generate a SendgridConfiguration' do
    vcap_services = {
      thewrongkey: [],
      sendgrid: [
        {
          credentials: {
            hostname: 'host',
            password: 'pass',
            username: 'user'
          }
        }
      ]
    }

    config = SendgridVCAPParser.get_configuration(vcap_services.to_json)
    expect(config.hostname).to eq('host')
    expect(config.username).to eq('user')
    expect(config.password).to eq('pass')
  end

  it 'fails if the services do not include sendgrid' do
    expect { SendgridVCAPParser.get_configuration('{"thewrongkey": []}') }.to raise_error(KeyError)
  end

  it 'fails if the services do not include sendgrid entries' do
    expect { SendgridVCAPParser.get_configuration('{"sendgrid": []}') }.to raise_error(NoMethodError)
  end

  it 'fails if the services do not include sendgrid credentials' do
    expect { SendgridVCAPParser.get_configuration('{"sendgrid": [{"nope": []}]}') }.to raise_error(KeyError)
  end

  it 'fails if the services do not include all sendgrid credentials' do
    vcap_services = {
      thewrongkey: [],
      sendgrid: [
        {
          credentials: {
            hostname: 'host',
            pass: 'wrong-key-name',
            username: 'user'
          }
        }
      ]
    }

    expect { SendgridVCAPParser.get_configuration(vcap_services.to_json) }.to raise_error(KeyError)
  end
end
