require("dotenv").config();
const util = require("util");
const stream = require("stream");
const { MongoClient } = require("mongodb");

const main = async () => {
  const uri = "mongodb://renderws.local:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    const pipeline = [
      {
        $match: {
          operationType: "insert",
          "fullDocument.address.country": "Australia",
          "fullDocument.address.market": "Sydney",
        },
      },
    ];
    //await monitorListUseEE(client, 15000, pipeline);
    //await monitorListUseNext(client, 15000, pipeline);
    await monitorListUseStreamApi(client, 15000, pipeline);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
    console.log("done");
  }
};

main().catch(console.error);

async function monitorListUseStreamApi(
  client,
  timeInMs = 60000,
  pipeline = []
) {
  const collection = await client
    .db("sample_airbnb")
    .collection("listingsAndReviews");
  const changeStream = collection.watch(pipeline);

  changeStream.stream().pipe(
    new stream.Writable({
      objectMode: true,
      write: (doc, _, cb) => {
        console.log(doc);
        cb();
      },
    })
  );
  await closeChangeStream(timeInMs, changeStream);
}

async function monitorListUseNext(client, timeInMs = 60000, pipeline = []) {
  const collection = await client
    .db("sample_airbnb")
    .collection("listingsAndReviews");
  const changeStream = collection.watch(pipeline);
  closeChangeStream(timeInMs, changeStream);

  try {
    while (await changeStream.hasNext()) {
      const next = await changeStream.next();
      console.log(next);
    }
  } catch (e) {
    if (changeStream.closed) {
      console.log("change stream closed");
    } else {
      console.log(e);
    }
  }
}

async function monitorListUseEE(client, timeInMs = 60000, pipeline = []) {
  const collection = await client
    .db("sample_airbnb")
    .collection("listingsAndReviews");
  const changeStream = collection.watch(pipeline);
  changeStream.on("change", (next) => {
    console.log(next);
  });

  await closeChangeStream(timeInMs, changeStream);
}

function closeChangeStream(timeInMs = 60000, changeStream) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log("Closing Change Stream");
      changeStream.close();
      resolve();
    }, timeInMs);
  });
}
