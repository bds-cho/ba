import exec from 'k6/execution';
import http from 'k6/http';

var config = {};
if (__ENV.LOAD == "constant") {
  config = {
    scenarios: {
      contacts: {
        executor: 'constant-arrival-rate',
        duration: '3h',
        rate: 1,
        timeUnit: '5s',
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
        startRate: 1,
        timeUnit: '5s',
        preAllocatedVUs: 1,
        maxVUs: 10,
        stages: [
          {target: 1, duration: '20m'},
          {target: 80, duration: '15s'},
          {target: 1, duration: '15s'},
          {target: 1, duration: '6m'},
          {target: 80, duration: '15s'},
          {target: 1, duration: '15s'},
          {target: 1, duration: '6m'},
          {target: 80, duration: '15s'},
          {target: 1, duration: '15s'},
          {target: 1, duration: '6m'},
          {target: 80, duration: '15s'},
          {target: 1, duration: '15s'},
          {target: 1, duration: '6m'},
          {target: 80, duration: '15s'},
          {target: 1, duration: '15s'},
          {target: 1, duration: '6m'},
          {target: 80, duration: '15s'},
          {target: 1, duration: '15s'},
          {target: 1, duration: '6m'},
          {target: 1, duration: '10m'}
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
