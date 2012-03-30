var https = require('https');
var util = require('util');

var options = {
    host: 'api.twitter.com',
    path: '/oauth/request_token',
    method: 'POST',
    port: 443,
    headers: {
        'OAuth': 'oauth_nonce="K7ny27JTpKVsTgdyLdDfmQQWVLERj2zAK5BslRsqyw", oauth_callback="http%3A%2F%2Fmyapp.com%3A3005%2Ftwitter%2Fprocess_callback", oauth_signature_method="HMAC-SHA1", oauth_timestamp="1300228849", oauth_consumer_key="OqEqJeafRSF11jBMStrZz", oauth_signature="Pc%2BMLdv028fxCErFyi8KXFM%2BddU%3D", oauth_version="1.0"'
    }
};

https.request(options,function(res) {
    util.print(res);
});