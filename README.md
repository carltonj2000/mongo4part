# MongoDb Node JS Introduction

The code in this repository is base on the following videos.

- [MongoDB & Node.js: Connecting & CRUD Operations (Part 1 of 4)](https://youtu.be/fbYExfeFsI0)
- [MongoDB & Node.js: Aggregation & Data Analysis (Part 2 of 4)](https://youtu.be/iz37fDe1XoM)
- []()
- []()

[Associate repo for above videos](https://github.com/mongodb-developer/nodejs-quickstart).

Data sets:

- [Air BnB](https://docs.atlas.mongodb.com/sample-data/sample-airbnb/)

The dataset was setup on Atlas and `MongoDB Compass` was use to export and import it
to a local machine for faster testing.

A comparison of mongodb and mongoose can be seen in the
[MongoDB Native Driver vs Mongoose: Performance Benchmarks](https://blog.jscrambler.com/mongodb-native-driver-vs-mongoose-performance-benchmarks/)
article and
[this is the repo](https://github.com/JscramblerBlog/native-mongoose-mongo-db/blob/master/index.js).

```bash
mongodb+srv://<user>:<password>@<host>/sample_airbnb?retryWrites=true&w=majority
mongoexport  --uri="mongodb://username@location/<db-name>"  --collection=<collection-name>  --out=<filename>.json
```

```bash
docker run --name exportmongo -d -v /media/renderws/carltonData/cj2021/code/mongo/mongo4part:/mongoexport mongo
```
