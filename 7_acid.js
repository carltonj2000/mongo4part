require("dotenv").config();
const util = require("util");
const { MongoClient } = require("mongodb");

const main = async () => {
  const uri = "mongodb://renderws.local:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    await createReservation(
      client,
      "l@a.b",
      "Infinite Views",
      [new Date("2021-12-31"), new Date("2022-01-01")],
      {
        pricePerNight: 180,
        specialRequests: "Late checkout",
        breakfastIncluded: true,
      }
    );
  } catch (e) {
    console.error(e);
  } finally {
    await client.close();
    console.log("done");
  }
};

main().catch(console.error);

async function createReservation(
  client,
  userEmail,
  nameOfListing,
  reservationDates,
  reservationDetails
) {
  const usersC = await client.db("sample_airbnb").collection("users");
  const listingsC = await client
    .db("sample_airbnb")
    .collection("listingsAndReviews");
  const res = createReservationDoc(
    nameOfListing,
    reservationDates,
    reservationDetails
  );
  const session = client.startSession();
  const transactionOptions = {
    readPreference: "primary",
    readConcern: { level: "local" },
    writeConcern: { w: "majority" },
  };
  try {
    const results = await session.withTransaction(async () => {
      const usersURes = await usersC.updateOne(
        { email: userEmail },
        { $addToSet: { reservations: res } },
        { upsert: true, session }
      );
      console.log(util.inspect({ usersURes }, false, null, true));
      const isListReserved = await listingsC.findOne(
        {
          name: nameOfListing,
          datesReserved: { $in: reservationDates },
        },
        { session }
      );
      if (isListReserved) {
        await session.abortTransaction();
        console.error("Error. Location booked for dates provided.");
        return;
      }

      const listNreviewUpdateR = await listingsC.updateOne(
        { name: nameOfListing },
        { $addToSet: { datesReserved: { $each: reservationDates } } },
        { session }
      );
      console.log(util.inspect({ listNreviewUpdateR }, false, null, true));
    }, transactionOptions);

    if (results) {
      console.log("transaction completed.");
    } else {
      console.error("transaction aborted.");
    }
  } catch (e) {
    console.error(e);
  } finally {
    await session.endSession();
  }
}

function createReservationDoc(
  nameOfListing,
  reservationDates,
  reservationDetails
) {
  let reservation = { name: nameOfListing, dates: reservationDates };
  for (let detail in reservationDetails) {
    reservation[detail] = reservationDetails[detail];
  }
  return reservation;
}
