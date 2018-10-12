const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.aggregateComments = functions.firestore
    .document('activities/{activityId}')
    .onWrite(event => {

    const activityId = event.params.activityId;
    
    // ref to the count document
    const docCountRef = admin.firestore().collection('activityAggregation');

    // ref to the parent document
    const docRef = admin.firestore().collection('activities').doc(activityId);
    
    // get all activities and aggregate
    return docRef.collection('activities').orderBy('createdAt', 'desc')
         .get()
         .then(querySnapshot => {

            // get the total activity count
            const activityCount = querySnapshot.size

            const last = {};

            // add data from the most recent activity to the array
            querySnapshot.forEach(doc => {
                last = doc.data();
            });

            // data to update on the document
            const data = { count: activityCount }
            
            // run update
            return docCountRef.update(data)
         })
         .catch(err => console.log(err) )
});