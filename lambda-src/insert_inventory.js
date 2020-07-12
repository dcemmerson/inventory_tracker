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
    if(event.httpMethod !== 'POST' || !event.body) {
        return {
            statusCode,
            headers,
            body: JSON.stringify({
                success: false, 
                msg:'Invalid submit method.'
            }),
        }
    }

    const data = JSON.parse(event.body)
    const query = q.Create(
        q.Collection("inventory"),
        {
            data: {
                "id": data.id,
                "name": data.name,
                "quantity": data.quantity,
                "burn_rate": data.burnRate, 
            }
    })

    let results;
    try {
        results = await client.query(query)
        results = {...results, success: true}
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

