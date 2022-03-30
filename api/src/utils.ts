export const wrapDocument = (doc) => ({
    updateOne: {
      filter: { gDate: doc.gDate },
      update: { 
        $set: { 
          ...doc
        } 
      },
      upsert:true
    },
});