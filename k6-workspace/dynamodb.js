import http from 'k6/http';
import exec from 'k6/execution';
import {Endpoint,SignatureV4} from 'https://jslib.k6.io/aws/0.12.3/signature.js';

export const options = {
  scenarios: {
    loadlevel: {
      executor: 'per-vu-iterations',
        vus: 1,
        iterations: 10,
        maxDuration: '24h',
    }
  }
}

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

// UTIL FUNCTIONS
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
}

// ITERATION FUNCTION
export default function () {
  // DYNAMIC PAYLOAD CREATION (QUERY)
  const payload = JSON.stringify({
    TableName: 'dynamo',
    KeyConditionExpression: 'id = :id',
    ExpressionAttributeValues: {
      ':id': { N: randomIntFromInterval(1,10) }  // Querying for id = 1
    }
  });
  // SIGN REQUEST
  const signedRequest = signer.sign(
    {
      method: 'POST',
      endpoint: new Endpoint('https://dynamodb.eu-central-1.amazonaws.com'),
      path: '/',
      headers: {
        'Content-Type': 'application/x-amz-json-1.0',
        'X-Amz-Target': 'DynamoDB_20120810.Query',
      },
      body: payload
    }
  );

  const req_id = parseFloat(exec.vu.idInTest + '.' + exec.vu.iterationInInstance);
  
  const start = Date.now();
  const res = http.post(signedRequest.url, signedRequest.body ,{headers: signedRequest.headers});
  const end = Date.now();

  console.log(req_id+'##'+res.status+'##'+start+'##'+res.body+'##'+end);
}
