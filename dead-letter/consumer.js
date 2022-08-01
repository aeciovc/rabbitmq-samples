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

        var INCOMING_QUEUE_NAME = "payment-orders.incoming.queue";
        var DEAD_LETTER_QUEUE_NAME = "payment-orders.dead-letter.queue";
        
        channel.assertQueue(INCOMING_QUEUE_NAME, {
            durable: true,
            deadLetterExchange: "",
            deadLetterRoutingKey: DEAD_LETTER_QUEUE_NAME
          });

        channel.prefetch(1);
        console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", INCOMING_QUEUE_NAME);

        channel.consume(INCOMING_QUEUE_NAME, function(msg) {
            console.log(" [x] Received %s", msg.content.toString());
            
            if (msg.properties.headers != undefined){
                console.log(" [x] Headers details:", msg.properties.headers['x-death'])
            }

            setTimeout(function() {
                console.log(" [x] Done");
                channel.reject(msg, false);
              }, 2000);
        }, {
            noAck: false
        });
    });
});
