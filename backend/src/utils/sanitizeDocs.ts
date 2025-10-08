// backend/src/utils/sanitizeDocs.ts

/**
 * Cleans Mongoose documents or plain JS objects:
 *  - Converts `_id` → `id`
 *  - Removes `__v`
 *  - Supports arrays and plain objects
 */
export function sanitizeDocs<T>(data: T): T {
    if (Array.isArray(data)) {
        // recursively sanitize arrays
        return data.map((doc) => sanitizeDocs(doc)) as T;
    }

    if (!data) return data;

    // If Mongoose doc, convert to plain object
    const plain: any =
        typeof (data as any).toObject === "function"
            ? (data as any).toObject()
            : data;

    const { _id, __v, ...rest } = plain;
    const id = _id ? _id.toString() : undefined;

    return { ...rest, ...(id && { id }) } as T;
}
