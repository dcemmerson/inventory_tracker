import faunadb from 'faunadb';
import { getInventory } from './get_inventory';
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

exports.handler = async function (event, context) {
    const { identity, user } = context.clientContext;

    let results;
    if (user) {

        const currentTimestamp = Math.round(new Date().getTime() / 1000)
        const inventory = JSON.parse(event.body)

        let awaitPromises = inventory.map(item => {
            if (item.newItem) {
                return insertItem(item, currentTimestamp)
            }
            else if (item.deleteItem) {
                return deleteItem(item);
            }
            else if (item.editted) {
                return updateItem(item, currentTimestamp);
            }
            return null;
        })

        const res = await Promise.all(awaitPromises)
            .then(() => {
                return getInventory(context);
            })
            .then(dbInventory => {
                return { ...(tallyInventory(dbInventory)), success: true };
            })
            .catch(err => {
                return {
                    success: false,
                    error: err,
                };
            })

        return {
            statusCode,
            headers,
            body: JSON.stringify(res),
        };
    }
    else {
        return {
            statusCode,
            headers,
            body: JSON.stringify({
                msg: 'not logged in',
                context: context,
            }),
        };
    }
}

function deleteItem(item) {
    try {
        const query = q.Delete(
            q.Select(
                "ref",
                q.Get(
                    q.Match(q.Index("inventory_id"), item.data.id)
                )
            )
        );
        return client.query(query);
    }
    catch (err) {
        return { ...item, error: true, msg: "Error: insert error" };
    }
}

function insertItem(item, currentTimestamp) {
    try {
        const query = q.Create(
            q.Collection("inventory"),
            {
                data: {
                    "id": item.data.id,
                    "name": item.data.name,
                    "quantity": item.data.quantity,
                    "burnRate": item.data.burnRate,
                    "lastModified": currentTimestamp
                }
            });
        return client.query(query);
    }
    catch (err) {
        return { ...item, error: true, msg: "Error: insert error" };
    }


}

function updateItem(item, currentTimestamp) {
    try {
        const query = q.Update(
            q.Select("ref",
                q.Get(
                    q.Match(q.Index("inventory_id"), item.data.id)
                )),
            {
                data: {
                    "name": item.data.name,
                    "quantity": item.data.quantity,
                    "burnRate": item.data.burnRate,
                    "lastModified": currentTimestamp,
                }
            }
        )
        return client.query(query);
    }
    catch (err) {
        return { ...item, error: true, msg: "Error: insert error" };
    }
}