import sql from 'k6/x/sql';
import { sleep } from 'k6';

export const options = {
  scenarios: {
    loadlevel: {
      executor: 'per-vu-iterations',
      vus: 1,
      iterations: 3,
      maxDuration: '24h',
    }
  }
}

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

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

const db = sql.open('mysql', 'admin:adminadmin@tcp(rds.cja2s0gm0289.eu-central-1.rds.amazonaws.com:3306)/rds-mysql-db');

export default function () {
    let query = "SELECT * FROM users WHERE users.id = "+(randomIntFromInterval(1,1000))+";"
    let result = sql.query(db,query);
    console.log(toString(result));
    sleep(1);
}
