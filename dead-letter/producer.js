#!/usr/bin/env node

var amqp = require('amqplib/callback_api');

amqp.connect('amqp://localhost', function(error0, connection) {
  if (error0) {
    throw error0;
  }
  connection.createChannel(function(error1, channel) {
    if (error1) {
      throw error1;
    }
    var EXCHANGE_NAME = 'payment-orders.exchange';
    var ROUTING_KEY_NAME = "payment-orders";

    var msg = process.argv.slice(2).join(' ') || "<empty>";

    channel.publish(EXCHANGE_NAME, ROUTING_KEY_NAME, Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
  });

  setTimeout(function() {
    connection.close();
    process.exit(0);
  }, 500);

});
