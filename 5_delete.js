const util = require("util");
const { MongoClient } = require("mongodb");

const newListing = require("./airbnb.data.json");

const main = async () => {
  const uri = "mongodb://renderws.local:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    //await deleteListingByName(client, "Cozy Cottage");
    await deleteListingScrapedBeforeDate(client, new Date("2019-02-15"));
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
    console.log("done");
  }
};

main().catch(console.error);

async function deleteListingByName(client, name) {
  const result = await client
    .db("sample_airbnb")
    .collection("listingsAndReviews")
    .deleteOne({ name });
  if (result) {
    console.log(util.inspect(result, false, null, true));
  } else {
    console.log("No update done for name of", name);
  }
}

async function deleteListingScrapedBeforeDate(client, date) {
  const result = await client
    .db("sample_airbnb")
    .collection("listingsAndReviews")
    .deleteMany({ last_scraped: { $lt: date } });
  if (result) {
    console.log(util.inspect(result, false, null, true));
  } else {
    console.log("No update done for date of", date);
  }
}
