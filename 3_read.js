const util = require("util");
const { MongoClient } = require("mongodb");

const newListing = require("./airbnb.data.json");

const main = async () => {
  const uri = "mongodb://renderws.local:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    //await findOneListingByName(client, "Infinite Views");
    await findListingsWithMinBedRmBathRmAndMostRecentReviews(client, {
      minBathRms: 3,
    });
    await findListingsWithMinBedRmBathRmAndMostRecentReviews(client, {
      minBathRms: 6,
    });
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
    console.log("done");
  }
};

main().catch(console.error);

async function findOneListingByName(client, nameOfListing) {
  const result = await client
    .db("sample_airbnb")
    .collection("listingsAndReviews")
    .findOne({ name: nameOfListing });
  if (result) {
    console.log(util.inspect(result, false, null, true));
  } else {
    console.log("No listings found with", nameOfListing);
  }
}

async function findListingsWithMinBedRmBathRmAndMostRecentReviews(
  client,
  { minBedRms = 0, minBathRms = 0, maxResults = Number.MAX_SAFE_INTEGER }
) {
  const cursor = await client
    .db("sample_airbnb")
    .collection("listingsAndReviews")
    .find({ bedrooms: { $gte: minBedRms }, bathrooms: { $gte: minBathRms } })
    .sort({ last_review: -1 })
    .limit(maxResults);
  const result = await cursor.toArray();
  if (result) {
    console.log(util.inspect(result, false, null, true));
  } else {
    console.log("No listings found with parameters provided");
  }
}
