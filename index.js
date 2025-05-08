require('dotenv').config();
const imaps = require('imap-simple');

// Configuration for IMAP connection
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

// Connect to Gmail inbox and fetch the latest email
imaps.connect(config).then(connection => {
  return connection.openBox('INBOX').then(() => {
    const searchCriteria = ['ALL'];
    const fetchOptions = {
      bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)', 'TEXT'],
      markSeen: false
    };
    return connection.search(searchCriteria, fetchOptions);
  }).then(messages => {
    // Get the latest email
    const latest = messages[messages.length - 1];
    const subject = latest.parts.find(p => p.which === 'HEADER.FIELDS (FROM TO SUBJECT DATE)').body.subject?.[0] || 'No Subject';
    const body = latest.parts.find(p => p.which === 'TEXT').body;

    console.log('Latest Subject:', subject);
    console.log('Contains Cash App?', /cash app/i.test(body));
  }).catch(error => {
    console.error('Error fetching emails:', error);
  });
});
