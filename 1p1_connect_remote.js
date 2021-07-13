require("dotenv").config();
const util = require("util");
const { MongoClient } = require("mongodb");

const main = async () => {
  const {
    MONGODB_PW: pw,
    MONGODB_USER: user,
    MONGODB_HOST: host,
  } = process.env;
  const uri = `mongodb+srv://${user}:${pw}@${host}/sample_airbnb?retryWrites=true&w=majority`;
  console.log({ uri });
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
