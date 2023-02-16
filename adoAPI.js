const reposList = require('./privateresources/repos-list.json');

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

    getRequestPromise(requestOptions)
    {
        return new Promise(function(resolve, reject){
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
    }
    
    async getCommits(repository, totalCommits, fromDate)
    {
        const getCommits = this.urlToPCM + `/_apis/git/repositories/${repository}/commits?searchCriteria.$top=${totalCommits}&searchCriteria.fromDate=${fromDate}&api-version=4.1`

        const requestOptions = {
            host: this.baseUrl,
            path: getCommits,
        };

        let bodyPromise = this.getRequestPromise(requestOptions);
        return await bodyPromise;
    }

    async getCommitsAllRepos(totalCommits, fromDate)
    {
        const pcmCommits = await this.getCommits(reposList.pcm, totalCommits, fromDate);
        const cadlinksCommits = await this.getCommits(reposList.cadlinks, totalCommits, fromDate);
        const cloudhostingCommits = await this.getCommits(reposList.cloudhosting, totalCommits, fromDate);
        const viewerCommits = await this.getCommits(reposList.viewer, totalCommits, fromDate);

        return pcmCommits.value.concat(cadlinksCommits.value).concat(cloudhostingCommits.value).concat(viewerCommits.value);
    }

    async getAllCommitsByAuthor(author, fromDate)
    {
        const commitsAllRepos = await this.getCommitsAllRepos(10000, fromDate);
        const commitsByAuthor = commitsAllRepos.filter(commit => commit.author.email === author);

        console.log(`${author} has ${commitsByAuthor.length} commit(s) since ${fromDate}`);
        return commitsByAuthor;
    }
}