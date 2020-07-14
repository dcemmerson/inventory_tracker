
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


export function byQuantity(asc = true) {
    let sortDir;
    if (asc) sortDir = -1;
    else sortDir = 1;

    return function (a, b) {
        a.quantity = parseFloat(a.quantity);
        b.quantity = parseFloat(b.quantity);

        if (a.quantity < b.quantity) {
            return -1 * sortDir;
        }
        else if (a.quantity === b.quantity) {
            return 0;
        }
        else {
            return 1 * sortDir;
        }
    }
}

export function byDaysLeft(asc = true) {
    let sortDir;
    if (asc) sortDir = -1;
    else sortDir = 1;

    return function (a, b) {
        a.daysLeft = parseFloat(a.daysLeft);
        b.daysLeft = parseFloat(b.daysLeft);

        if (a.daysLeft < b.daysLeft) {
            return -1 * sortDir;
        }
        else if (a.daysLeft === b.daysLeft) {
            return 0;
        }
        else {
            return 1 * sortDir;
        }
    }
}

export function byBurnRate(asc = true) {
    let sortDir;
    if (asc) sortDir = -1;
    else sortDir = 1;

    return function (a, b) {
        a.burnRate = parseFloat(a.burnRate);
        b.burnRate = parseFloat(b.burnRate);

        if (a.burnRate < b.burnRate) {
            return -1 * sortDir;
        }
        else if (a.burnRate === b.burnRate) {
            return 0;
        }
        else {
            return 1 * sortDir;
        }
    }

}

export function byName(a, b,) {
    let sortDir;
    if (asc) sortDir = -1;
    else sortDir = 1;
    
    return function(a, b) {
        if (a.name < b.name) {
            return -1 * sortDir;
        }
        else if (a.name === b.name) {
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
