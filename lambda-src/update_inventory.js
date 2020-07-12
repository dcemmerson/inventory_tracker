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

exports.handler = async function (event, context) {
    const data = JSON.parse(event.body)
    const query = q.Update(
        q.Select("ref",
        q.Get(
            q.Match(q.Index("inventory_id"), data.id)
        )),
        {
            data: {
                "name": data.name,
                "quantity": data.quantity,
                "burn_rate": data.burnRate, 
             }
        }
    )

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
            body: JSON.stringify(results),
        };
    }
}

