import exec from 'k6/execution';
import http from 'k6/http';

export const options = {
  scenarios: {
    loadlevel: {
      executor: 'per-vu-iterations',
        vus: 10,
        iterations: 20,
        maxDuration: '24h',
    }
  }
}

const lambda = __ENV.LAMBDA;

export default async function () {
  const req_id = parseFloat(exec.vu.idInTest + '.' + exec.vu.iterationInInstance);

  let res = http.get(lambda);

  console.log(req_id+'##'+res.status+'##'+res.body);
}
