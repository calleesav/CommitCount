const dotenv = require('dotenv');
dotenv.config();
https = require('https');
adoAPI = require('./adoAPI');


const adoAPIWrapper = new adoAPI();

async function runRequests()
{
    const test = await adoAPIWrapper.getCommits(10, '2023-02-07');

    console.log(test);
}


runRequests();