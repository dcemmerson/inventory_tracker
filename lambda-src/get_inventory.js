import faunadb from 'faunadb';
import { tallyInventory } from './tally_inventory';

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

const query = q.Map(
    q.Paginate(
        q.Match(q.Index("get_inventory"))
    ),
    q.Lambda("X", q.Get(q.Var("X")))
)

exports.handler = async function (event, context) {
    const { identity, user } = context.clientContext;

    let results;
    if (user) {
        let start = new Date();
        try {
            results = tallyInventory(await getInventory(context));
        }
        catch (err) {
            results = err;
            results.start = start;
            results.end = new Date();
        }
        finally {
            return {
                statusCode,
                headers,
                body: JSON.stringify(results),
            };
        }
    }
    else {
        return {
            statusCode,
            headers,
            body: JSON.stringify({
                msg: 'not logged in',
                loggedIn: false,
                context: context,
            }),
        };
    }
}

export function getInventory(context) {
    return client.query(query);
}
