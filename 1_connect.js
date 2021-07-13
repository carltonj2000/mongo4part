require("dotenv").config();
const util = require("util");
const { MongoClient } = require("mongodb");

const main = async () => {
  const uri = "mongodb://renderws.local:27017";
  const client = new MongoClient(uri);

  try {
    await client.connect();
    await listDatabases(client);
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
