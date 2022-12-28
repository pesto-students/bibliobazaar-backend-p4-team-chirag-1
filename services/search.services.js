import https from 'https'
import querystring from 'querystring'
import { API_BASE_URL } from '../config/config'

const searchService = async (params, callback) => {
    var url = API_BASE_URL;
    if (params) {
        url += '?' + querystring.stringify(params);
    }
    https.get(url, function(response) {
        if (response.statusCode !== 200) {
            return callback(new Error('Google Books API error. Status Code: ' + response.statusCode));
        }

        var body = '';

        response.on('data', function(data) {
            body += data;
        });

        response.on('end', function() {
            var err, data;
            try {
                data = JSON.parse(body);
            } catch (e) {
                err = new Error('Invalid response from Google Books API.');
            }
            
            if (data.error) {
                callback(new Error(data.error.message));
            } else {
                callback(err, data);
            }            

        });
    }).on('error', function(error) {
        callback(error);
    });
}
  
export { searchService }