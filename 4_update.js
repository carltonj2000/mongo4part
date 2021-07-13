const util = require("util");
const { MongoClient } = require("mongodb");

const newListing = require("./airbnb.data.json");

const main = async () => {
  const uri = "mongodb://renderws.local:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    //await updateListingByName(client, "Infinite Views", { guestRooms: 3 });
    //await upsertListingByName(client, "Cozy Cottage", { bathrooms: 1 });
    await updateAllListingToHavePropType(client);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
    console.log("done");
  }
};

main().catch(console.error);

async function updateListingByName(client, name, update) {
  const result = await client
    .db("sample_airbnb")
    .collection("listingsAndReviews")
    .updateOne({ name }, { $set: update });
  if (result) {
    console.log(util.inspect(result, false, null, true));
  } else {
    console.log("No update done for name of", name);
  }
}

async function upsertListingByName(client, name, update) {
  const result = await client
    .db("sample_airbnb")
    .collection("listingsAndReviews")
    .updateOne({ name }, { $set: update }, { upsert: true });
  if (result) {
    console.log(util.inspect(result, false, null, true));
  } else {
    console.log("No update done for name of", name);
  }
}

async function updateAllListingToHavePropType(client) {
  const result = await client
    .db("sample_airbnb")
    .collection("listingsAndReviews")
    .updateMany(
      { property_type: { $exists: false } },
      { $set: { property_type: "residential" } }
    );
  if (result) {
    console.log(util.inspect(result, false, null, true));
  } else {
    console.log("No update done for name of", name);
  }
}
