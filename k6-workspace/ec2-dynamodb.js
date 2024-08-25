import http from 'k6/http';
import exec from 'k6/execution';
import {Endpoint,SignatureV4} from 'https://jslib.k6.io/aws/0.12.3/signature.js';

var config = {};
if (__ENV.LOAD == "constant") {
  config = {
    scenarios: {
      contacts: {
        executor: 'constant-arrival-rate',
        duration: '14h',
        rate: 2,
        timeUnit: '1s',
        preAllocatedVUs: 1,
        maxVUs: 5
      }
    }
  }
} else if (__ENV.LOAD == "spiky") {
  config = {
    scenarios: {
      contacts: {
        executor: 'ramping-arrival-rate',
        startRate: 2,
        timeUnit: '1s',
        preAllocatedVUs: 5,
        maxVUs: 20,
        stages: [
          {target: 2, duration: '2h'},
          {target: 25, duration: '15m'},
          {target: 2, duration: '15m'},
          {target: 2, duration: '3h'},
          {target: 25, duration: '15m'},
          {target: 2, duration: '15m'},
          {target: 2, duration: '3h'},
          {target: 25, duration: '15m'},
          {target: 2, duration: '15m'},
          {target: 2, duration: '2h30m'}
        ]
      }
    }
  }
} else {
  console.error("Please specifiy load type with variable LOAD! Options: constant / spiky");
}

export const options = config;

// AWS HTTP REQUEST SIGNATURE
const signer = new SignatureV4({
  service: 'dynamodb',
  region: 'eu-central-1',
  credentials: {
    accessKeyId: 'AKIA4MTWMFVALETNCPO4',
    secretAccessKey: '9rBCoUwVpM3oaH061F2L\+9rOFe792WbrWnJry9CO',
  },
  uriEscapePath: false,
  applyChecksum: true,
});

// HTTP REQUEST
const req = {
  method: 'POST',
  endpoint: new Endpoint('https://dynamodb.eu-central-1.amazonaws.com'),
  path: '/',
  headers: {
    'Content-Type': 'application/x-amz-json-1.0',
    'X-Amz-Target': 'DynamoDB_20120810.Query',
  },
  body: JSON.stringify({
    TableName: 'dynamo',
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': { N: '5' }
    }
  })
};

// ITERATION FUNCTION
export default function () {
  const signedRequest = signer.sign(req);

  const req_id = parseFloat(exec.vu.idInTest + '.' + exec.vu.iterationInInstance);
  
  const start = Date.now();
  const res = http.post(signedRequest.url, signedRequest.body ,{headers: signedRequest.headers});
  const end = Date.now();

  console.log(req_id+'##'+start+'##'+res.body+'##'+end+'##'+res.status);
}
