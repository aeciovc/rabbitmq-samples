#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

const fs = require('fs');

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var exchange = 'contracts_files';
    var args = process.argv.slice(2);
    var key = (args.length > 0) ? args[0] : 'save';

    const filePath = 'aprenda-java.pdf';

    const fileBuffer = fs.readFileSync(filePath);

    channel.assertExchange(exchange, 'topic', {
      durable: false
    });
    channel.publish(exchange, key, fileBuffer);
    console.log(" [x] Sent %s:'%s'", key, filePath);
  });

  setTimeout(function() {
    connection.close();
    process.exit(0)
  }, 500);
});
