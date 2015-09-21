"use strict";

const PUSH = "push";

self.addEventListener(PUSH, (event) => {
    console.log("Received a push message", event);

    event.waitUntil(self.registration.showNotification("ボドゲしたい", {
        body: "ボドゲしたくない？",
        icon: "/images/test.png",
        tag: "simple-push-demo-notification-tag"
    }))
});