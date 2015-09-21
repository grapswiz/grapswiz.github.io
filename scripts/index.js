"use strict";

((global) => {
    const DOM_CONTENT_LOADED = "DOMContentLoaded";
    const SERVICE_WORKER = "serviceWorker";
    const SHOW_NOTIFICATION = "showNotification";
    const PUSH_MANAGER = "PushManager";
    const DENIED = "denied";
    const CLICK = "click";
    const PUSH_BUTTON = ".js-push-button";
    const SEND_PUSH_BUTTON = ".js-send-push-button";
    const ENABLE_PUSH_MESSAGES = "ボドゲしたいを受け取る";
    const DISABLE_PUSH_MESSAGES = "ボドゲしたいを受け取らない";

    let isPushEnabled = false;

    global.document.addEventListener(DOM_CONTENT_LOADED, () => {
        let pushButton = global.document.querySelector(PUSH_BUTTON);
        pushButton.addEventListener(CLICK, () => {
            if (isPushEnabled) {
                unsubscribe();
            } else {
                subscribe();
            }
        });

        let sendPushButton = global.document.querySelector(SEND_PUSH_BUTTON);
        sendPushButton.addEventListener(CLICK, () => {
            fetch("//push-notification-1075.appspot.com/send").then(() => {
                console.log("send");
            });
        });
    });

    let sendSubscriptionToServer = (subscription) => {
        fetch("//push-notification-1075.appspot.com/register", {
            method: "POST",
            body: subscription.endpoint
        }).then(() => {
            console.log("register endpoint: " + subscription.endpoint);
        });
    };

    let sendUnsubscriptionToServer = (subscription) => {
        fetch("//push-notification-1075.appspot.com/unregister", {
            method: "POST",
            body: subscription.endpoint
        }).then(() => {
            console.log("unregister endpoint: " + subscription.endpoint);
        });
    };

    let initializeState = () => {
        if (!(SHOW_NOTIFICATION in global.ServiceWorkerRegistration.prototype)) {
            console.warn("Notifications are not supported.");
            return;
        }

        if (global.Notification.permission === DENIED) {
            console.warn("The user has blocked notifications.");
            return;
        }

        if (!(PUSH_MANAGER in global)) {
            console.warn("Push messaging is not supported.");
            return;
        }

        navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
            serviceWorkerRegistration.pushManager.getSubscription().then((subscription) => {
                let pushButton = global.document.querySelector(PUSH_BUTTON);
                pushButton.disabled = false;

                if (!subscription) {
                    return;
                }

                sendSubscriptionToServer(subscription);
                pushButton.textContent = DISABLE_PUSH_MESSAGES;
                isPushEnabled = true;
            }).catch((err) => {
                console.warn("Error during getSubscription()", err);
            });
        });
    };

    if (SERVICE_WORKER in global.navigator) {
        global.navigator.serviceWorker.register("/serviceWorker.js").then(initializeState);
    } else {
        console.warn("Service workers are not supported in this browser.");
    }

    let subscribe = () => {
        let pushButton = global.document.querySelector(PUSH_BUTTON);
        pushButton.disabled = true;

        global.navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
            serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true}).then((subscription) => {
                pushButton.textContent = DISABLE_PUSH_MESSAGES;
                pushButton.disabled = false;

                return sendSubscriptionToServer(subscription);
            }).catch((e) => {
                if (global.Notification.permission === DENIED) {
                    console.error("Permission for Notification was denied.");
                } else {
                    console.error("Unable to subscribe to push.", e);
                    pushButton.disabled = false;
                    pushButton.text = ENABLE_PUSH_MESSAGES;
                }
            });
        });
    };

    let unsubscribe = () => {
        let pushButton = global.document.querySelector(PUSH_BUTTON);
        pushButton.disabled = true;

        global.navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
            serviceWorkerRegistration.pushManager.getSubscription().then((pushSubscription) => {
                if (!pushSubscription) {
                    isPushEnabled = false;
                    pushButton.disabled = false;
                    pushButton.textContent = ENABLE_PUSH_MESSAGES;
                    return;
                }

                pushSubscription.unsubscribe().then((successful) => {
                    pushButton.disabled = false;
                    sendUnsubscriptionToServer(pushSubscription);
                    pushButton.textContent = ENABLE_PUSH_MESSAGES;
                    isPushEnabled = false;
                }).catch((e) => {
                    console.log("Unsbscription error:", e);
                    pushButton.disabled = false;
                    pushButton.textContent = ENABLE_PUSH_MESSAGES;
                }).catch((e) => {
                    console.error("Error thrown while unsubscribing from push messaging.", e)
                });
            });
        });
    };
})(window);