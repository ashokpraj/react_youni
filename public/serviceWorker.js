/* eslint-disable no-undef */

/* eslint-disable-line global-require */
/* eslint-disable no-restricted-globals */
self.importScripts("https://cdn.jsdelivr.net/npm/lodash@4.17.11/lodash.min.js");

self.addEventListener("push", function (event) {

  const eventJson = event.data.json();



  // notification Type 0 ------------------------------------------------------------

  if (_.get(eventJson, "collectionName") === "post_like") {
    const name = _.get(eventJson, "userLikedPost.name", "");
    const profileImg = _.get(eventJson, "userLikedPost.profileImg", "");

    const title = `${name} liked your Post.`;
    const options = {
      body: `${_.get(eventJson, "postData.postText", "")} `,
      icon: profileImg,
      //image: _.get(eventJson, 'postData.postMedia.0.url', ""),
      data: eventJson,
      vibrate: [200, 100, 200, 100, 200, 100, 200],
    };

    event.waitUntil(self.registration.showNotification(title, options));




    // notification Type 4 -----------------------------------------------------------

  } else if (_.get(eventJson, "collectionName") === "post_comments_create") {
    const name = _.get(eventJson, "commentData.userData.name", "");
    const profileImg = _.get(eventJson, "commentData.userData.profileImg", "");

    const title = `${name} commented on your Post.`;
    const options = {
      body: ` "${_.get(eventJson, "commentData.comment.text", "")}" `,
      //  image: _.get(eventJson, 'commentData.comment.images.0', ""),
      icon: profileImg,
      // badge: "assets/images/provider-login/bidclips-icon.png",
      data: eventJson,
      vibrate: [200, 100, 200, 100, 200, 100, 200],
    };

    event.waitUntil(self.registration.showNotification(title, options));

    // notification Type 
  } else if(_.get(eventJson, "collectionName") === "post_comments_like") {
    const name = _.get(eventJson, "userLikedCmt.name", "");
    const profileImg = _.get(eventJson, "userLikedCmt.profileImg", "");

    const title = `${name} liked your Comment.`;
    const options = {
      body: `-${_.get(eventJson, "commentData.comment.text", "")} `,
      icon: profileImg,
      //image: _.get(eventJson, 'postData.postMedia.0.url', ""),
      data: eventJson,
      vibrate: [200, 100, 200, 100, 200, 100, 200],
    };
    Notification.onclick = (e) =>{
      window.location.href ="https://google.com"
    }
    event.waitUntil(self.registration.showNotification(title, options));



    // notification Type 2 -----------------------------------------------------------------

  } else if (_.get(eventJson, "collectionName") === "follower_user") {
    const name = _.get(eventJson, "followUser.name", "");
    const profileImg = _.get(eventJson, "followUser.profileImg", "");

    const title = `${name} started following you.`;
    const options = {
      icon: !_.isNull(profileImg)
        ? profileImg
        : "https://highstrike.s3.ap-south-1.amazonaws.com/HighStrikeBull+(2).png",
      //image: _.get(eventJson, 'postData.postMedia.0.url', ""),
      data: eventJson,
      vibrate: [200, 100, 200, 100, 200, 100, 200],
    };
    event.waitUntil(self.registration.showNotification(title, options));
    self.registration.showNotification.onclick = (e) =>{
      window.location.href ="https://google.com"
    }
    notification.onclick = function(event) {
      event.preventDefault(); // prevent the browser from focusing the Notification's tab
      window.open('http://www.mozilla.org', '_blank');
    }



    // notification Type 3 -----------------------------------------------------------------

  } else if (_.get(eventJson, "collectionName") === "follow_request") {

    const name = _.get(eventJson, 'followRequestUser.name', '');
    const profileImg = _.get(eventJson, 'followRequestUser.profileImg', '');

    const title = `${name} has Requested to follow.`;
    const options = {
      icon: !_.isNull(profileImg) ? profileImg : 'https://highstrike.s3.ap-south-1.amazonaws.com/HighStrikeBull+(2).png',
      //image: _.get(eventJson, 'postData.postMedia.0.url', ""),
      data: eventJson,
      vibrate: [200, 100, 200, 100, 200, 100, 200]
    };
    Notification.onclick = (e) =>{
      window.location.href ="https://google.com"
    }

    event.waitUntil(self.registration.showNotification(title, options));


  } else if (_.get(eventJson, "collectionName") === "accept_request") {
    const name = _.get(eventJson, "confirmRequestUser.name", "");
    const profileImg = _.get(eventJson, "confirmRequestUser.profileImg", "");

    const title = `${name} accpted your follow Request.`;
    const options = {
      icon: !_.isNull(profileImg)
        ? profileImg
        : "https://highstrike.s3.ap-south-1.amazonaws.com/HighStrikeBull+(2).png",
      //image: _.get(eventJson, 'postData.postMedia.0.url', ""),
      data: eventJson,
      vibrate: [200, 100, 200, 100, 200, 100, 200],
    };

    event.waitUntil(self.registration.showNotification(title, options));

    Notification.onclick = (e) =>{
      window.location.href ="https://google.com"
    }


    // notification Type 5 ------------------------------------------------------------

  } else if (_.get(eventJson, "collectionName") === "post_create") {

    const name = _.get(eventJson, 'PostCreatedUser.name', '');
    const profileImg = _.get(eventJson, 'PostCreatedUser.profileImg', '');

    const title = `${name} Created a New Post.`;
    const options = {
      icon: !_.isNull(profileImg) ? profileImg : 'https://highstrike.s3.ap-south-1.amazonaws.com/HighStrikeBull+(2).png',
      body: _.get(eventJson, 'postData.postText', ""),
   //   image: _.get(eventJson, 'postData.postMedia[0].url', ""),
      data: eventJson,
      vibrate: [200, 100, 200, 100, 200, 100, 200]
    };

    event.waitUntil(self.registration.showNotification(title, options));
  }

});


self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  let clickResponsePromise = Promise.resolve();
  clickResponsePromise = clients.openWindow("http://localhost:3000/home");
  event.waitUntil(
    Promise.all([
      clickResponsePromise,
      self.analytics.trackEvent("notification-click"),
    ])
  );
});
// self.addEventListener("notificationclose", function (event) {
//   event.waitUntil(
//     Promise.all([self.analytics.trackEvent("notification-close")])
//   );
// });