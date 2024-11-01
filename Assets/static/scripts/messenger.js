var __n = (d) => {};

function get_new_message() {
    let f = async (e) => {
        let response = new Packet({"buffer": new Uint8Array(await e.data.arrayBuffer())});

        if (response.type == Application.PACKET_TYPE_NOTIFICATION_MESSAGE) {
            __n(response);
        }

        else if (response.type == Application.PACKET_TYPE_GET_MESSAGE_QUEUE && response.isFinal) {
            push_message([response.getData()], 0);
            
            if (!VISIBLE) {
                const notif = new Notification("New message", {
                    body: "You have a new message",
                    icon: "https://nathcat.net:8080/images?path=favicon.png"
                });

                document.addEventListener("visibilitychange", () => {
                    if (document.visibilityState === "visible") {
                        notif.close();
                    }
                });
            }
        }
    };

    app.sock.onmessage = f;

    app.sock.send(new Packet({
        "type": Application.PACKET_TYPE_GET_MESSAGE_QUEUE,
        "isFinal": true,
        "object": { "ChatID": 1 }
    }).getBytes());
}

function notification(data) {
    console.log(data);
    if (data.ChatID == 1) {
        get_new_message();
    }
}

__n = notification;

function message_to_html(message, displayName) {
    let str = "<div class=\"row\" style=\"justify-content: ";
    if (message.SenderID == app.data.user.id) {
        str += "right;\">";
    }
    else {
        str += "left;\">"
    }
    
    str += "<div class=\"message-"
    if (message.SenderID == app.data.user.id) {
        str += "to\">";
    }
    else {
        str += "from\">"
    }

    str += "<h3>" + displayName + "</h3><p>" + message.Content + "</p></div></div>";
    return str;
}

function push_message(messages, i) {
    if (i == messages.length) return;

    if (!VISIBLE) {
        document.getElementById("icon").href = "/images?path=favicon_notification.png";
        new Audio("/sounds?path=notification.mp3").play();
    }

    let message = messages[i];
    let container = document.getElementById("message-container");

    let user = app.get_user(message.SenderID);
    if (user == null) {
        /*
        app.sock.onmessage = (e) => {
            let response = JSON.parse(e.data);
            if (response.type == Application.PACKET_TYPE_NOTIFICATION_MESSAGE) {
                notification(response);
                return;
            }

            app.data.known_users.push(response);
            container.innerHTML = container.innerHTML + message_to_html(message, response.fullName);
            push_message(messages, ++i);
            container.scrollTop = container.scrollHeight;
        }

        app.sock.send(JSON.stringify({
            "type": Application.PACKET_TYPE_GET_USER,
            "isFinal": true,
            "ID": message.SenderID
        }));*/
        // Request the user through AuthCat
        fetch("https://data.nathcat.net/sso/user-search.php", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "id": message.SenderID
            })
        }).then((r) => r.json()).then((r) => {
            let u;
            if (r.state == "success") {
                u = r.results[message.SenderID];
            }
            else {
                u = {"id": message.SenderID, "fullName": "USER NOT FOUND", "username": "USERNOTFOUND", "pfpPath": "default.png"}
            }

            app.data.known_users.push(u);
            container.innerHTML = container.innerHTML + message_to_html(message, u.fullName);
            push_message(messages, ++i);
            container.scrollTop = container.scrollHeight;
        });
    }
    else {
        container.innerHTML = container.innerHTML + message_to_html(message, user.fullName);
        push_message(messages, ++i);
        container.scrollTop = container.scrollHeight;
    }
}

function send_message() {
    let msg_entry = document.getElementById("message_entry");

    let content = [...msg_entry.value];//.replace(/[^\x00-\x7F]/g, "??");
    msg_entry.value = "";

    if (content == "") return;

    let i2 = content.length;
    for (let i = 0; i < i2; i++) {
        if (content[i].codePointAt(0) >= 256) {
            content.splice(i, 1, "&#" + content[i].codePointAt(0) + ";");
            i2 = content.length;
        }
    }

    content = content.join("");
    content = content.replace("<", "&lt;").replace(">", "&gt;");

    let f = async (e) => {
        let response = new Packet({"buffer": new Uint8Array(await e.data.arrayBuffer())});

        if (response.type == Application.PACKET_TYPE_NOTIFICATION_MESSAGE) {
            notification(response.getData());
            return;
        }
        else if (response.type == Application.PACKET_TYPE_PING) {
            console.log("Message sent");
            get_new_message();
        }
    }

    app.sock.onmessage = f;

    app.sock.send(new Packet({
        "type": Application.PACKET_TYPE_SEND_MESSAGE,
        "isFinal": true,
        "object": {
            "ChatID": 1,
            "Content": content,
            "TimeSent": new Date().getTime()
        }
    }).getBytes());
}

function load_messages() {
    document.getElementById("message_entry").onkeydown = (e) => {
        if (e.key == "Enter") {
            send_message();
        }
    };

    let messages = [];
    let f = async (e) => {
        let response = new Packet({"buffer": new Uint8Array(await e.data.arrayBuffer())});

        if (response.type == Application.PACKET_TYPE_NOTIFICATION_MESSAGE) {
            notification(response.getData());
            return;
        }
        
        if (response.type == Application.PACKET_TYPE_ERROR) {
            return;
        }
        else {
            messages.push(response.getData());
        }

        if (response.isFinal) {
            push_message(messages, 0);
            get_online_users();
        }
    }

    app.sock.onmessage = f;

    let request = new Packet({
        "type": Application.PACKET_TYPE_GET_MESSAGE_QUEUE,
        "isFinal": true,
        "object": {"ChatID": 1}
    });

    app.sock.send(request.getBytes());
}

function setup_messenger() {
    let f = async (e) => {
        let data = new Packet({"buffer": new Uint8Array(await e.data.arrayBuffer())});

        if (data.type == Application.PACKET_TYPE_NOTIFICATION_MESSAGE) {
            notification(data.getData());
            return;
        }

        else if (data.type == Application.PACKET_TYPE_JOIN_CHAT || data.type == Application.PACKET_TYPE_ERROR) {
            console.log(data.getData());
            setTimeout(load_messages, 1000);
            return;
        }
    };

    app.sock.onmessage = f;

    app.sock.send(new Packet({
        "type": Application.PACKET_TYPE_JOIN_CHAT,
        "isFinal": true,
        "object": {
            "ChatID": 1,
            "JoinCode": "0f1a3167-9"
        }
    }).getBytes());
}

function get_online_users() {
    let prev_callback = app.sock.onmessage;
    let f = async (e) => {
        let d = new Packet({"buffer": new Uint8Array(await e.data.arrayBuffer())});

        if (d.type != Application.PACKET_TYPE_GET_ACTIVE_USER_COUNT && prev_callback != undefined) prev_callback(e);
        else {
            document.getElementById("online-count").innerText = "Users online: " + d.getData()["users-online"];
        }

        app.sock.onmessage = prev_callback;
    }

    app.sock.onmessage = f;

    app.sock.send(new Packet({
        "type": Application.PACKET_TYPE_GET_ACTIVE_USER_COUNT,
        "isFinal": true
    }).getBytes());

    setTimeout(get_online_users, 5000);
}

function request_notifications() {
    if (!("Notification" in window)) {
        alert("Your browser does not support notifications!");
        return;
    }

    Notification.requestPermission().then((permission) => {
        document.getElementById("notif-permission-button").style.display = permission === "granted" ? "none" : "block";
    });
}
