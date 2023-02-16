const fs = require('fs').promises;
const express = require('express');
const dotenv = require('dotenv');
dotenv.config();

const https = require('http');

const teamList = require('./privateresources/team-list.json')
const adoAPI = require('./adoAPI');

module.exports = class commitCountServer
{
    constructor()
    {
        this.app = express();
        this.host = 'localhost';
        this.port = 8000;
        this.adoAPI = new adoAPI();
        this.teamList = require('./privateresources/team-list.json');
    }

    handleServerRequest(request, response, self)
    {
    }

    updateCommits()
    {
        this.adoAPI.getAllCommitsAllRepos(10000, )
    }

    async setupServer()
    {
        let self = this;
        this.app.get('/', function(request, response){
            self.handleServerRequest(request, response, self);
        });
    }

    start()
    {
        this.setupServer();
        this.app.listen(this.port, this.host, () => {
            console.log(`Server listening on http://${this.host}:${this.port}`);
        });
    }


    async updateCommitsFromAllRepos()
    {
        this.allCommits = await this.adoAPI.getCommitsAllRepos(10000, this.currentSprint);
    }

    async getCommitsByAuthor(author)
    {
        const fromDate = '02-08-2023';
        const commitsAllRepos = await this.adoAPI.getCommitsAllRepos(10000, fromDate);
        const commitsByAuthor = commitsAllRepos.filter(commit => commit.author.email === author);

        console.log(`${author} has ${commitsByAuthor.length} commit(s) since ${fromDate}`);

        return commitsByAuthor;
    }
    async
}