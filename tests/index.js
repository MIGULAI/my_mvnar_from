const {
  default: axios
} = require("axios");
const https = require('https');
const cluster = require('node:cluster');
const numCPUs = require('node:os').availableParallelism();

const cookie = 'session=eyJqd3QiOiJleUpoYkdjaU9pSklVekkxTmlJc0luUjVjQ0k2SWtwWFZDSjkuZXlKcFpDSTZJalkxWmpaaVl6RmpZMlk0TVdWaFpUWTVPV00yWW1VME5pSXNJbVZ0WVdsc0lqb2lkR1V5YzNSQWRIRjNkSGN1WkdWMklpd2lhV0YwSWpveE56RXdOalk0T0RJNGZRLmJRdFNLaGlyVEdLS0ZTR1c1U1lja2xRTUM0cjVaOXJDQ1JMY3NkTXBGVVkifQ==;'

console.log(process.env.NODE_TLS_REJECT_UNAUTHORIZED);

const request = async () => {
  // const response = await axios.get(
  //   'https://ticketing.dev/api/users/currentUser', {

  //     headers: {
  //       cookie
  //     },
  //   }
  // );
  // console.log(response.data);
  // return;
  const {
    data
  } = await axios.post(
    'https://ticketing.dev/api/tickets', {
      title: 'test',
      price: 20
    }, {
      httpsAgent: new https.Agent({
        // checkServerIdentity: false,
        rejectUnauthorized: false
      }),
      headers: {
        'Cookie': [cookie]
      }
    }
  );
  await axios.put(
    `https://ticketing.dev/api/tickets/${data.id}`, {
      title: 'test',
      price: 10
    }, {
      httpsAgent: new https.Agent({
        // checkServerIdentity: false,
        rejectUnauthorized: false
      }),
      headers: {
        cookie
        
      }
    }
  );
  axios.put(
    `https://ticketing.dev/api/tickets/${data.id}`, {
      title: 'test',
      price: 15
    }, {
      httpsAgent: new https.Agent({
        // checkServerIdentity: false,
        rejectUnauthorized: false
      }),
      headers: {
         cookie
      }
    }
  );
  // console.log('request complited');
};



if (cluster.isPrimary) {
  console.log(`Primary ${process.pid} is running`);

  console.log(numCPUs);
  // Fork workers.
  for (let i = 0; i < 6; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`worker ${worker.process.pid} died`);
  });
} else {

  (async () => {
    for (let i = 0; i < 400; i++) {
      await request();
    }
    console.log('done');
  })();
}