
/*  name: deepCopy
    description: Perform deep copy of object/array passed in. Should 
                    be used to copy object coming out of db. This method
                    also ensure we do not attempt to make copies of new
                    photos that user tried to add, but did not upload 
                    and actual photo.
*/
export function deepCopy(current) {
    //Remember, typof null === "object" in js.
    if (typeof current !== "object" || current === null) return current;

    let next = Array.isArray(current) ? [] : {};

    for (let key in current) {
        next[key] = deepCopy(current[key]);
    }
    return next;
}

export function getSortMethod(sortBy, asc = true) {
    if(sortBy === "byQuantity") {
        return byQuantity(asc);
    }
    else if(sortBy === "byDaysLeft") {
        return byDaysLeft(asc);
    }
    else if(sortBy === "byBurnRate") {
        return byBurnRate(asc);
    }
    else {
        return byName(asc);
    }
}

function byQuantity(asc = true) {
    let sortDir = 1;
    if (!asc) sortDir = -1;

    return function (a, b) {
        a.data.quantity = parseFloat(a.data.quantity);
        b.data.quantity = parseFloat(b.data.quantity);

        if (a.data.quantity < b.data.quantity) {
            return -1 * sortDir;
        }
        else if (a.data.quantity === b.data.quantity) {
            return 0;
        }
        else {
            return 1 * sortDir;
        }
    }
}

function byDaysLeft(asc = true) {
    let sortDir = 1;
    if (!asc) sortDir = -1;

    return function (a, b) {
        a.data.daysLeft = parseFloat(a.data.daysLeft);
        b.data.daysLeft = parseFloat(b.data.daysLeft);

        if (a.data.daysLeft < b.data.daysLeft) {
            return -1 * sortDir;
        }
        else if (a.data.daysLeft === b.data.daysLeft) {
            return 0;
        }
        else {
            return 1 * sortDir;
        }
    }
}

function byBurnRate(asc = true) {
    let sortDir = 1;
    if (!asc) sortDir = -1;

    return function (a, b) {
        a.data.burnRate = parseFloat(a.data.burnRate);
        b.data.burnRate = parseFloat(b.data.burnRate);

        if (a.data.burnRate < b.data.burnRate) {
            return -1 * sortDir;
        }
        else if (a.data.burnRate === b.data.burnRate) {
            return 0;
        }
        else {
            return 1 * sortDir;
        }
    }

}

function byName(asc = true) {
    let sortDir = 1;
    if (!asc) sortDir = -1;
    
    return function (a, b) {
        if (a.data.name < b.data.name) {
            return -1 * sortDir;
        }
        else if (a.data.name === b.data.name) {
            return 0;
        }
        else {
            return 1 * sortDir;
        }
    }

}

export function reverseArray(arr) {
    return arr.slice().reverse();
}
