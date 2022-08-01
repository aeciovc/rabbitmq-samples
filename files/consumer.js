#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
const fs = require('fs');

var args = ['save', 'delete', 'replace', 'append']

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var exchange = 'contracts_files';

    channel.assertExchange(exchange, 'topic', {
      durable: false
    });

    channel.assertQueue('', {
      exclusive: false
    }, function(error2, q) {
      if (error2) {
        throw error2;
      }
      console.log(' [*] Waiting for logs. To exit press CTRL+C');

      args.forEach(function(key) {
        channel.bindQueue(q.queue, exchange, key);
      });

      channel.consume(q.queue, function(msg) {        
        fs.writeFileSync('aprendi-java-cara.pdf', msg.content);
        console.log(" [x] %s: File saved at '%s'", msg.fields.routingKey, 'aprendi-java-cara.pdf');    
      }, {
        noAck: true
      });
    });
  });
});