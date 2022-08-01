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
    var INCOMING_QUEUE_NAME = "payment-orders.incoming.queue";
    var DEAD_LETTER_QUEUE_NAME = "payment-orders.dead-letter.queue";

    channel.assertExchange(EXCHANGE_NAME, 'direct', {
      durable: false
    });

    channel.assertQueue(INCOMING_QUEUE_NAME, {
      durable: true,
      deadLetterExchange: "",
      deadLetterRoutingKey: DEAD_LETTER_QUEUE_NAME
    });

    channel.bindQueue(INCOMING_QUEUE_NAME, EXCHANGE_NAME, ROUTING_KEY_NAME);

    channel.assertQueue(DEAD_LETTER_QUEUE_NAME, {
      durable: true,
      //Delay to resend to the original QUEUE
      deadLetterExchange: "",
      deadLetterRoutingKey: INCOMING_QUEUE_NAME,
      messageTtl: 10000
    });

    console.log(" [x] Created '%s' exchange with routing '%s'", EXCHANGE_NAME, ROUTING_KEY_NAME);
  });

  setTimeout(function() {
    connection.close();
    process.exit(0)
  }, 500);
});