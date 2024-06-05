const admin = require("firebase-admin");

const serviceAccount = require("../services/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

function formatPhoneNumber(phoneNumber) {
  if (phoneNumber.startsWith("0")) {
    return "+84" + phoneNumber.slice(1);
  }
  return phoneNumber;
}

exports.sendSMS = async (phoneNumber) => {
  phoneNumber = formatPhoneNumber(phoneNumber);
  try {
    const user = await admin.auth().createUser({
      phoneNumber: phoneNumber,
    });
    console.log(user);
  } catch (error) {
    console.log(error);
  }
};
