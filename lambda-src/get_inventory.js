import faunadb from 'faunadb';

require('dotenv').config();

const statusCode = 200;
const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type"
};

const q = faunadb.query
const client = new faunadb.Client({
    secret: process.env.DB_SERVER_KEY
})
const index = q.CreateIndex({
    name: "posts",
    source: q.Collection("posts"),
})

const query = q.Map(
    q.Paginate(
        q.Match(q.Index("get_inventory"))
    ),
    q.Lambda("X", q.Get(q.Var("X")))
)
exports.handler = async function (event, context) {
    let results;
    try {
        results = await client.query(query)

    }
    catch (err) {
        results = err;
    }
    finally {
        return {
            statusCode,
            headers,
            //        body: 'hello',
            body: JSON.stringify(results),
        };
    }
}

