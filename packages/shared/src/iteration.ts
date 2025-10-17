/**
 * Callback function that receives a key during iteration.
 */
interface KeyIterationCallback<Type, ReturnType = void> {
    (key: keyof Type, index: number, obj: Type): ReturnType;
}

/**
 * Callback function that receives a value during iteration.
 */
interface ValueIterationCallback<Type, ReturnType = void> {
    (value: Type[keyof Type], index: number, obj: Type): ReturnType;
}

/**
 * Callback function that receives a key-value entry during iteration.
 */
interface EntryIterationCallback<Type, ReturnType = void> {
    (entry: [keyof Type, Type[keyof Type]], index: number, obj: Type): ReturnType;
}

/**
 * Iterates over each own enumerable key of an object.
 *
 * @param obj        - The object to iterate over
 * @param callbackFn - Function called for each key
 */
export const forEachKey = <Type>(obj: Type, callbackFn: KeyIterationCallback<Type>) => {
    let index = 0;

    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            callbackFn(key, index, obj);

            index += 1;
        }
    }
};

/**
 * Iterates over each own enumerable value of an object.
 *
 * @param obj        - The object to iterate over
 * @param callbackFn - Function called for each value
 */
export const forEachValue = <Type>(obj: Type, callbackFn: ValueIterationCallback<Type>) => {
    let index = 0;

    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            callbackFn(obj[key], index, obj);

            index += 1;
        }
    }
};

/**
 * Iterates over each own enumerable key-value entry of an object.
 *
 * @param obj        - The object to iterate over
 * @param callbackFn - Function called for each entry
 */
export const forEachEntry = <Type>(obj: Type, callbackFn: EntryIterationCallback<Type>) => {
    let index = 0;

    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            callbackFn([key, obj[key]], index, obj);

            index += 1;
        }
    }
};

/**
 * Maps each own enumerable value of an object to a new value, returning a new object.
 *
 * @param   obj        - The object to map
 * @param   callbackFn - Function that transforms each value
 * @returns              A new object with transformed values
 */
export const mapEachValue = <Type, ReturnType = Type>(
    obj: Type,
    callbackFn: ValueIterationCallback<Type>,
): ReturnType => {
    let index = 0;
    let newObj = {} as ReturnType;

    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            newObj = {
                ...newObj,
                [key]: callbackFn(obj[key], index, obj),
            };

            index += 1;
        }
    }

    return newObj;
};

/**
 * Maps each own enumerable entry of an object to a new key-value pair, returning a new object.
 *
 * @param   obj        - The object to map
 * @param   callbackFn - Function that transforms each entry to a new [key, value] pair
 * @returns              A new object with transformed entries
 */
export const mapEachEntry = <Type, ReturnType = Type>(
    obj: Type,
    callbackFn: EntryIterationCallback<Type, [key: PropertyKey, value: unknown]>,
): ReturnType => {
    let index = 0;
    let newObj = {} as ReturnType;

    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            const [newKey, newValue] = callbackFn([key, obj[key]], index, obj);

            newObj = {
                ...newObj,
                [newKey]: newValue,
            };

            index += 1;
        }
    }

    return newObj;
};

/**
 * Filters an object by keys, returning a new object with only entries where the predicate returns true.
 *
 * @param   obj        - The object to filter
 * @param   callbackFn - Predicate function that returns true for keys to keep
 * @returns              A new object with filtered entries
 */
export const filterEachKey = <Type>(
    obj: Type,
    callbackFn: KeyIterationCallback<Type, boolean>,
): Partial<Type> => {
    let index = 0;
    let newObj = {};

    for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) {
            if (callbackFn(key, index, obj)) {
                newObj = {
                    ...newObj,
                    [key]: obj[key],
                };
            }

            index += 1;
        }
    }

    return newObj;
};
