import exec from 'k6/execution';
import http from 'k6/http';

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
          {target: 2, duration: '2m'},
          {target: 25, duration: '15s'},
          {target: 2, duration: '15s'},
          {target: 2, duration: '3m'},
          {target: 25, duration: '15s'},
          {target: 2, duration: '15s'},
          {target: 2, duration: '3m'},
          {target: 25, duration: '15s'},
          {target: 2, duration: '15s'},
          {target: 2, duration: '2m30s'}
        ]
      }
    }
  }
} else {
  console.error("Please specifiy load type with variable LOAD! Options: constant / spiky");
}

export const options = config;

const lambda = __ENV.LAMBDA;

export default async function () {
  const req_id = parseFloat(exec.vu.idInTest + '.' + exec.vu.iterationInInstance);

  let res = http.get(lambda);

  console.log(req_id+'##'+res.status+'##'+res.body);
}