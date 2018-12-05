import * as admin from 'firebase-admin';
import * as functions from 'firebase-functions';

admin.initializeApp();
admin.firestore().settings({ timestampsInSnapshots: true });

// save a temp user with password then create a new auth account and after a new user with extra fields and delete the old one
export const createUser = functions.firestore
    .document('newUsers/{userId}')
    .onCreate(async (snap, context) => {
        const userId = context.params.userId;
        const newUser = await admin.auth().createUser({
            disabled: false,
            displayName: snap.get('displayName'),
            email: snap.get('email'),
            password: snap.get('password')
        });
        //  store the new user in another collection with extra fields
        await admin.firestore().collection('users').doc(newUser.uid).set({
            uid: newUser.uid,
            email: newUser.email,
            displayName: newUser.displayName,
            photoURL: null,
            status: 'A',
            roles: { controller: true },
            createdAt: new Date(),
            course: snap.get('course'),
            institution: snap.get('institution')
        });
        // Delete the temp document
        return admin.firestore().collection('newUsers').doc(userId).delete();
    });

export const aggregateActivities = functions.firestore.document('activitiesUser/{userId}/activities/{activityId}')
    .onWrite(async (_event, context) => {
        const userId = context.params.userId;
        const activityId = context.params.activityId;

        // ref to the parent document
        const docRef = admin.firestore().collection('activitiesUser').doc(userId)

        // get all activities and aggregate
        try {
            const querySnapshot = await docRef.collection('activities').orderBy('createdAt', 'desc').get();
            // get the total activity count
            const activityCount = querySnapshot.size;
            const activityArray = [];
            // Snapshot to array
            querySnapshot.forEach(doc => {
                activityArray.push(doc.data());
            });
            const approveds = activityArray.filter(activity => activity.status === 'Aprovada');
            const approvedCount = approveds.length;

            const rejecteds = activityArray.filter(activity => activity.status === 'Reprovada');
            const rejectedCount = rejecteds.length;

            const pendings = activityArray.filter(activity => activity.status === 'Pendente');
            const pendingCount = pendings.length;
            
            // record last activity timestamp
            const lastActivity = activityArray[0].createdAt;
            // data to update on the documemnt
            const data = { activityCount, approvedCount, rejectedCount, pendingCount, lastActivity };
            // run update
            return docRef.update(data);
        }
        catch (err) {
            return console.log(err);
        }
    })