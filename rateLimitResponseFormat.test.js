import http from 'k6/http';
import {check} from 'k6';

export let options = {
    vus: 1000,
    duration: '5m',
};

export default function() {
    const projectId = ''
    const projectSecret = ''
    const credentials = `${projectId}:${projectSecret}`;
    let hitRateLimit = false

    const url = `https://${credentials}@ropsten.infura.io/v3/${projectId}`
    const  params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const data = JSON.stringify({
        jsonrpc:"2.0",
        method:"eth_blockNumber",
        params: [],
        id:1
    });
    let res = http.post(url, data, params);
    if(res.status === 429){
        hitRateLimit = true
        // console.log(res.status)
        // console.log(JSON.stringify(JSON.parse(res.body).error.data))
        check(res, { 'allowed_rps check': (r) => JSON.parse(res.body).error.data.rate.allowed_rps >= 1 });
        check(res, { 'backoff_seconds check': (r) =>  
            JSON.parse(res.body).error.data.rate.backoff_seconds >= 0 &&  JSON.parse(res.body).error.data.rate.backoff_seconds < 60 
        });
        check(res, { 'current_rps check': (r) =>  JSON.parse(res.body).error.data.rate.current_rps > 1 });    
    }
    check(res, { 'Tot. rate limit hits:': (r) => hitRateLimit === true });
}