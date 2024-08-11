import sql from 'k6/x/sql';

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

// UTIL FUNCTION TO GENERATE RANDOM INT
function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

// CONNECT TO RDS (MYSQL)
const db = sql.open('mysql', 'admin:adminadmin@tcp(rds.cja2s0gm0289.eu-central-1.rds.amazonaws.com:3306)/rds-mysql-db');

// ITERATION FUNCTION
export default function () {
    const query = "SELECT * FROM users WHERE users.id = "+(randomIntFromInterval(1,1000))+";"
    const result = sql.query(db,query);
    console.log(toString(result));
}
