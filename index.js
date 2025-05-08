require('dotenv').config();
const imaps = require('imap-simple');

const config = {
  imap: {
    user: process.env.EMAIL_ADDRESS,
    password: process.env.EMAIL_PASSWORD, // app password!
    host: 'imap.gmail.com',
    port: 993,
    tls: true,
    authTimeout: 3000
  }
};

imaps.connect(config).then(connection => {
  return connection.openBox('INBOX').then(() => {
    const searchCriteria = ['ALL'];
    const fetchOptions = {
      bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
      markSeen: false
    };
    return connection.search(searchCriteria, fetchOptions);
  }).then(messages => {
    const latest = messages[messages.length - 1];
    const subject = latest.parts.find(p => p.which === 'HEADER.FIELDS (FROM TO SUBJECT DATE)').body.subject[0];
    const body = latest.parts.find(p => p.which === 'TEXT').body;

    console.log('Latest Subject:', subject);
    console.log('Contains Cash App?', /cash app/i.test(body));
  });
});
