import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// on save a temp user with password create a new account and after create a new user with extra fields and delete the old one
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