const dotenv = require('dotenv');
dotenv.config();

https = require('https');

module.exports = class adoAPI
{
    constructor()
    {
        this.accessToken = process.env.ADO_ACCESS_TOKEN;
        this.baseUrl = 'dev.azure.com';
        this.urlToPCM = '/AVEVA-VSTS/Point%20Cloud%20Manager';
    }

    getRequestPromise(response)
    {

    }
    
    async getCommits(totalCommits, fromDate)
    {
        const getCommits = this.urlToPCM + `/_apis/git/repositories/5a23e8f9-6a27-4f40-ba1f-73ca04917c07/commits?searchCriteria.$top=${totalCommits}&searchCriteria.fromDate=${fromDate}&api-version=4.1`

        const requestOptions = {
            host: this.baseUrl,
            path: getCommits,
        };

        let self = this;
        let bodyPromise = new Promise(function(resolve, reject){

            const request = https.request(requestOptions, function(response){
                if(response.statusCode < 200 || response.statusCode >= 300){
                    return reject(new Error('STATUS CODE: ' + response.statusCode));
                }
        
                let responseBodyData = [];
                response.on('data', function(dataChunk){
                    responseBodyData += dataChunk;
                });
        
                response.on('end', function() {
                    try{
                        JSON.parse(responseBodyData);
                    } catch(exception)
                    {
                        reject(exception);
                    }
                    resolve(JSON.parse(responseBodyData));
                });
            });
            request.setHeader('Content-Type', 'application/json; charset=utf-8;');
            request.setHeader("Authorization", "Basic " + btoa('Basic' + ":" + process.env.ADO_ACCESS_TOKEN));
            request.end();

        })

        return await bodyPromise;
    }

    getCommitsAllRepos()
    {
    }
}