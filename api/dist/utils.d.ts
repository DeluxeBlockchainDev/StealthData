export declare const wrapDocument: (doc: any) => {
    updateOne: {
        filter: {
            gDate: any;
        };
        update: {
            $set: any;
        };
        upsert: boolean;
    };
};
