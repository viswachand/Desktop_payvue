export const globalToJSONTransform = {
    virtuals: true,
    transform(_doc: any, ret: Record<string, any>) {
        ret.id = ret._id?.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        return ret;
    },
};
