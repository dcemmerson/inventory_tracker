import faunadb from 'faunadb';
require('dotenv').config();

const SECONDS_PER_DAY = 60;//60 * 60 * 24;

const q = faunadb.query
const client = new faunadb.Client({
    secret: process.env.DB_SERVER_KEY
})

export function tallyInventory(inventory) {
    inventory.data = inventory.data.map(item => {
        item.data = consumeSupplies(item.data);
        return item;
    })

    return inventory;
}

function consumeSupplies(data) {
    const currentTimestamp = Math.round(new Date().getTime() / 1000);
    const daysToSubtract = Math.trunc((currentTimestamp - data.lastModified) / SECONDS_PER_DAY);

    if(daysToSubtract > 0) {
        data.lastModified += (SECONDS_PER_DAY * daysToSubtract);
        data.quantity -= (data.burnRate * daysToSubtract);
        updateItemInDb(data, currentTimestamp);
    }

    if (data.quantity < 0) {
        data.quantity = 0;
    }
    return data;
}

async function updateItemInDb (data, currentTimestamp) {
    const query = q.Update(
        q.Select("ref",
        q.Get(
            q.Match(q.Index("inventory_id"), data.id)
        )),
        {
            data: {
                "name": data.name,
                "quantity": data.quantity,
                "burnRate": data.burnRate,
                "lastModified": currentTimestamp,
             }
        }
    )

    let results;
    try {
        //Fire off db update but don't worry about waiting to
        // check if it returned.
        await client.query(query);

    }
    catch (err) {
        results = err;
    }

}
