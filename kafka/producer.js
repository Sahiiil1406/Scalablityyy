const { Kafka } = require('kafkajs');

const kafka = new Kafka({
  clientId: 'test',
  brokers: ['localhost:9092'],  // Assuming Kafka is running on localhost
});

const producer = kafka.producer();

const produce = async (x, msg) => {
  await producer.connect();
  console.log("Producer connected");

  await producer.send({
    topic: x,
    messages: [
      { value: msg },
    ],
  });

  console.log("Msg sent");
  await producer.disconnect();
  console.log("Disconnected");
};

const run = async () => {
  try {
    await produce("A", "Msg 1");
    await produce("A", "Msg 2");
    await produce("A", "Msg 3");
  } catch (error) {
    console.error("Error producing message:", error);
  }
};

run();
