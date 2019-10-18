const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.addAdminRole = functions.https.onCall((data, context) => {
  
  if(context.auth.token.admin !== true){
    return {error: 'nie posiadasz uprawnien administratora!'}
  }

  //get user by email
  return admin.auth().getUserByEmail(data.email).then(user => {
    return admin.auth().setCustomUserClaims(user.uid, {admin: true});
  }).then(() => {
    return {
      message: `${data.email} otrzymal uprawnienia Administratora`
    }
  }).catch(err => {
    return err;
  })
})