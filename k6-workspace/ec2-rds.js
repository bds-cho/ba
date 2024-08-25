import exec from 'k6/execution';
import sql from 'k6/x/sql';

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

// UTIL FUNCTION TO CONVERT ASCII-INTS TO STRING
function toString(data){
  return data.map(item => {
    return {
      id: String.fromCharCode(...item.id),
      name: String.fromCharCode(...item.name),
      address: String.fromCharCode(...item.address),
      email: String.fromCharCode(...item.email)
    };
  });
}

// CONNECT TO RDS (MYSQL)
const db = sql.open('mysql','admin:adminadmin@tcp(rds.cja2s0gm0289.eu-central-1.rds.amazonaws.com:3306)/rds-mysql-db');

// ITERATION FUNCTION
export default function () {
  const req_id = parseFloat(exec.vu.idInTest + '.' + exec.vu.iterationInInstance);
  const query = "SELECT * FROM users WHERE users.id = 500;";
  
  const start = Date.now();
  const result = sql.query(db,query);
  const end = Date.now();
  
  console.log(req_id+'##'+start+'##'+JSON.stringify(toString(result))+'##'+end);
}
