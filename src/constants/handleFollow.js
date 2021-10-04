import firebase, { db } from "../firebase/config";

export const handleFollow = (follow, user) => {
  db.collection("users")
    .where("uid", "==", follow.uid)
    .get()
    .then((snapshot) => {
      return snapshot.docs.map((doc) => {
        const listFollowerOld = doc.data().listFollower;
        db.collection("users")
          .doc(doc.id)
          .update({
            listFollower:
              listFollowerOld.length > 0
                ? [
                    ...listFollowerOld,
                    {
                      uid: user.uid,
                      displayName: user.displayName,
                      photoURL: user.photoURL,
                      createdAtFollow: firebase.firestore.Timestamp.now(),
                    },
                  ]
                : [
                    {
                      uid: user.uid,
                      displayName: user.displayName,
                      photoURL: user.photoURL,
                      createdAtFollow: firebase.firestore.Timestamp.now(),
                    },
                  ],
            nofication: false,
          });
      });
    });
  db.collection("users")
    .where("uid", "==", user.uid)
    .get()
    .then((snapshot) => {
      return snapshot.docs.map((doc) => {
        const listFollowOld = doc.data().listFollow;
        db.collection("users")
          .doc(doc.id)
          .update({
            listFollow:
              listFollowOld.length > 0
                ? [
                    ...listFollowOld,
                    {
                      uid: follow.uid,
                      displayName: follow.displayName,
                      photoURL: follow.photoURL,
                      createdAtFollow: firebase.firestore.Timestamp.now(),
                    },
                  ]
                : [
                    {
                      uid: follow.uid,
                      displayName: follow.displayName,
                      photoURL: follow.photoURL,
                      createdAtFollow: firebase.firestore.Timestamp.now(),
                    },
                  ],
          });
      });
    });
};

export const handleCancelFollow = (follow, user) => {
  
  db.collection("users")
    .where("uid", "==", follow.uid)
    .get()
    .then((snapshot) => {
      return snapshot.docs.map((doc) => {
        let listFollowerOld = doc.data().listFollower;
        listFollowerOld = listFollowerOld.filter((id) => id.uid !== user.uid);
        db.collection("users")
          .doc(doc.id)
          .update({ listFollower: [...listFollowerOld] });
      });
    });
  db.collection("users")
    .where("uid", "==", user.uid)
    .get()
    .then((snapshot) => {
      return snapshot.docs.map((doc) => {
        let listFollowOld = doc.data().listFollow;
        listFollowOld = listFollowOld.filter((id) => id.uid !== follow.uid);
        db.collection("users")
          .doc(doc.id)
          .update({ listFollow: [...listFollowOld] });
      });
    });
};
