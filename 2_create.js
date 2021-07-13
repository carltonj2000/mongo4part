const util = require("util");
const { MongoClient } = require("mongodb");

const newListing = require("./airbnb.data.json");

const main = async () => {
  const uri = "mongodb://renderws.local:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    //await listDatabases(client);
    //await createListing(client, newListing);
    await createListings(client, [
      {
        name: "Infinite Views",
        summary: "Modern home with infinite views from the infinity pool",
        property_type: "House",
        bedrooms: 5,
        bathrooms: 4.5,
        beds: 5,
      },
      {
        name: "Private room in London",
        property_type: "Apartment",
        bedrooms: 1,
        bathroom: 1,
      },
      {
        name: "Beautiful Beach House",
        summary:
          "Enjoy relaxed beach living in this house with a private beach",
        bedrooms: 4,
        bathrooms: 2.5,
        beds: 7,
        last_review: new Date(),
      },
    ]);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
    console.log("done");
  }
};

main().catch(console.error);

async function listDatabases(client) {
  const databases = await client.db().admin().listDatabases();
  console.log(util.inspect(databases, false, null, true));
}

async function createListing(client, newListing) {
  const result = await client
    .db("sample_airbnb")
    .collection("listingsAndReviews")
    .insertOne(newListing);
  console.log("id", result.insertedId);
}

async function createListings(client, newListings) {
  const result = await client
    .db("sample_airbnb")
    .collection("listingsAndReviews")
    .insertMany(newListings);
  console.log(`Inserted ${result.insertedCount} with the following IDs`);
  console.log(util.inspect(result.insertedIds, false, null, true));
}
