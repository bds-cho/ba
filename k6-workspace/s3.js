import exec from 'k6/execution';
import {AWSConfig,S3Client} from 'https://jslib.k6.io/aws/0.12.3/s3.js';

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

// AWS CONFIG
const awsConfig = new AWSConfig({
  region: 'eu-central-1',
  accessKeyId: 'AKIA4MTWMFVALETNCPO4',
  secretAccessKey: '9rBCoUwVpM3oaH061F2L\+9rOFe792WbrWnJry9CO',
});

const s3 = new S3Client(awsConfig);

// ITERATION FUNCTION
export default async function () {
  const req_id = parseFloat(exec.vu.idInTest + '.' + exec.vu.iterationInInstance);

  const start = Date.now(); 
  const object = await s3.getObject('tf-ba-bucket','s3-object.txt');
  const end = Date.now();

  console.log(req_id+'##'+start+'##'+JSON.stringify(object.data)+'##'+end);
}
