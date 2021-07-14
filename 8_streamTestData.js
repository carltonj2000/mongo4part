require("dotenv").config();
const path = require("path");
const fs = require("fs");
const util = require("util");
const { MongoClient, ObjectId } = require("mongodb");

const main = async () => {
  const uri = "mongodb://renderws.local:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();

    if (process.argv.length && process.argv[2] === "-d") {
      return await removeListings(client);
    }
    const operaHouseViews = await createListing(client, {
      name: "Opera House Views",
      summary:
        "Beautiful apartment with views of the iconic Sydney Opera House",
      property_type: "Apartment",
      bedrooms: 1,
      bathrooms: 1,
      beds: 1,
      address: {
        market: "Sydney",
        country: "Australia",
      },
    });

    const privateRoomInLondon = await createListing(client, {
      name: "Private room in London",
      property_type: "Apartment",
      bedrooms: 1,
      bathroom: 1,
    });

    const beautifulBeachHouse = await createListing(client, {
      name: "Beautiful Beach House",
      summary: "Enjoy relaxed beach living in this house with a private beach",
      bedrooms: 4,
      bathrooms: 2.5,
      beds: 7,
      last_review: new Date(),
    });

    await updateListing(client, operaHouseViews, { beds: 2 });

    await updateListing(client, beautifulBeachHouse, {
      address: {
        market: "Sydney",
        country: "Australia",
      },
    });

    const italianVilla = await createListing(client, {
      name: "Italian Villa",
      property_type: "Entire home/apt",
      bedrooms: 6,
      bathrooms: 4,
      address: {
        market: "Cinque Terre",
        country: "Italy",
      },
    });

    const sydneyHarbourHome = await createListing(client, {
      name: "Sydney Harbour Home",
      bedrooms: 4,
      bathrooms: 2.5,
      address: {
        market: "Sydney",
        country: "Australia",
      },
    });

    await deleteListing(client, sydneyHarbourHome);
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
    console.log("done");
  }
};

main().catch(console.error);

const file = path.join(__dirname, "8_streamTestDataIds.json");

async function saveListingId(id) {
  const ids = [id];
  if (fs.existsSync(file)) {
    const data = fs.readFileSync(file, "utf-8");
    ids.push(...JSON.parse(data));
  }
  fs.writeFileSync(file, JSON.stringify(ids, null, 2));
}

async function removeListings(client) {
  if (!fs.existsSync(file)) return;
  const data = fs.readFileSync(file, "utf-8");
  const ids = JSON.parse(data);
  for (let i = 0; i < ids.length; i++) {
    await deleteListing(client, new ObjectId(ids[i]));
  }
  fs.unlinkSync(file);
}

async function createListing(client, newListing) {
  const result = await client
    .db("sample_airbnb")
    .collection("listingsAndReviews")
    .insertOne(newListing);
  console.log("create", util.inspect(result, false, null, true));
  saveListingId(result.insertedId);
  return result.insertedId;
}

async function updateListing(client, listingId, updatedListing) {
  const result = await client
    .db("sample_airbnb")
    .collection("listingsAndReviews")
    .updateOne({ _id: listingId }, { $set: updatedListing });

  console.log("update", util.inspect(result, false, null, true));
}

async function deleteListing(client, listingId) {
  const result = await client
    .db("sample_airbnb")
    .collection("listingsAndReviews")
    .deleteOne({ _id: listingId });
  console.log("delete", listingId, util.inspect(result, false, null, true));
}
