const addResourcesToCache = async(r) => {
    const cache = await caches.open("v1");
    await cache.addAll(r);
};

var sock;
var notifications = [];

self.addEventListener("install", (e) => {
    sock = new WebSocket("wss://nathcat.net:1234");
    sock.onopen = (e) => {
        console.log("Notification socket open! Waiting for auth data.");
    };

    sock.onerror = (e) => {
        console.log(`Notification socket error! ${e}`);
    }

    sock.onclose = (e) => {
        console.log("Notification socket closed!");
    }
});

self.addEventListener("message", (e) => {
    let d = JSON.parse(e.data);

    if (d.type === "StartAuth") {
        sock.onmessage = (r) => {
            let d = JSON.parse(r.data);

            if (d.type == 2) {
                console.log("Notification socket authenticated!");
            }
            else if (d.type == 8) {
                const notif = new Notification("New message", {
                    body: "You have a new message",
                    icon: "https://nathcat.net:8080/images?path=favicon.png"
                });

                notifications.push(notif);
            }
        };

        sock.send(JSON.stringify({
            "type": 2,
            "isFinal": true,
            "Username": d.Username,
            "Password": d.Password
        }));
    }
    else if (d.type === "VisibilityChange") {
        if (d.visible === true) {
            for (n in notifications) {
                n.close();
            }
        }
    }
});