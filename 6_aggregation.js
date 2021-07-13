require("dotenv").config();
const util = require("util");
const { MongoClient } = require("mongodb");

const main = async () => {
  const uri = "mongodb://renderws.local:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    await aggregate(client);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
    console.log("done");
  }
};

main().catch(console.error);

const pipeline = [
  {
    $match: {
      bedrooms: 1,
      "address.country": "Australia",
      "address.market": "Sydney",
      "address.suburb": {
        $exists: 1,
        $ne: "",
      },
      room_type: "Entire home/apt",
    },
  },
  {
    $group: {
      _id: "$address.suburb",
      averagePrice: {
        $avg: "$price",
      },
    },
  },
  {
    $sort: {
      averagePrice: 1,
    },
  },
  {
    $limit: 10,
  },
];
async function aggregate(client) {
  const aggCursor = client
    .db("sample_airbnb")
    .collection("listingsAndReviews")
    .aggregate(pipeline);
  const result = [];
  await aggCursor.forEach((e) => {
    result.push({
      id: e._id,
      avePrice: e.averagePrice,
    });
  });
  console.log(util.inspect(result, false, null, true));
}
