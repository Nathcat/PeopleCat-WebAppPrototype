var __n = (d) => {};

function get_new_message() {
    app.sock.onmessage = (e) => {
        let response = JSON.parse(e.data);
        if (response.type == Application.PACKET_TYPE_NOTIFICATION_MESSAGE) {
            __n(response);
        }

        else if (response.type == Application.PACKET_TYPE_GET_MESSAGE_QUEUE && response.isFinal) {
            push_message([response], 0);
        }
    }

    app.sock.send(JSON.stringify({
        "type": Application.PACKET_TYPE_GET_MESSAGE_QUEUE,
        "isFinal": true,
        "ChatID": 1
    }));
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

    app.sock.onmessage = (e) => {
        let response = JSON.parse(e.data);
        if (response.type == Application.PACKET_TYPE_NOTIFICATION_MESSAGE) {
            notification(response);
            return;
        }
        else if (response.type == Application.PACKET_TYPE_PING) {
            console.log("Message sent");
            get_new_message();
        }
    }

    app.sock.send(JSON.stringify({
        "type": Application.PACKET_TYPE_SEND_MESSAGE,
        "isFinal": true,
        "ChatID": 1,
        "Content": content,
        "TimeSent": new Date().getTime()
    }));
}

function load_messages() {
    document.getElementById("message_entry").onkeydown = (e) => {
        if (e.key == "Enter") {
            send_message();
        }
    };

    let messages = [];
    app.sock.onmessage = (e) => {
        let response = JSON.parse(e.data);
        if (response.type == Application.PACKET_TYPE_NOTIFICATION_MESSAGE) {
            notification(response);
            return;
        }
        
        if (response.type == Application.PACKET_TYPE_ERROR) {
            return;
        }
        else {
            messages.push(response);
        }

        if (response.isFinal) {
            push_message(messages, 0);
            get_online_users();
        }
    }

    let request = JSON.stringify({
        "type": Application.PACKET_TYPE_GET_MESSAGE_QUEUE,
        "isFinal": true,
        "ChatID": 1
    });

    app.sock.send(request);
}

function setup_messenger() {
    app.sock.onmessage = (e) => {
        let data = JSON.parse(e.data);
        if (data.type == Application.PACKET_TYPE_NOTIFICATION_MESSAGE) {
            notification(data);
            return;
        }

        else if (data.type == Application.PACKET_TYPE_JOIN_CHAT || data.type == Application.PACKET_TYPE_ERROR) {
            console.log(data);
            setTimeout(load_messages, 1000);
            return;
        }
    }

    app.sock.send(JSON.stringify({
        "type": Application.PACKET_TYPE_JOIN_CHAT,
        "isFinal": true,
        "ChatID": 1,
        "JoinCode": "0f1a3167-9"
    }));
}

function get_online_users() {
    let prev_callback = app.sock.onmessage;
    app.sock.onmessage = (e) => {
        let d = JSON.parse(e.data);
        if (d.type != Application.PACKET_TYPE_GET_ACTIVE_USER_COUNT && prev_callback != undefined) prev_callback(e);
        else {
            document.getElementById("online-count").innerText = "Users online: " + d["users-online"];
        }

        app.sock.onmessage = prev_callback;
    }

    app.sock.send(JSON.stringify({
        "type": Application.PACKET_TYPE_GET_ACTIVE_USER_COUNT,
        "isFinal": true
    }));

    setTimeout(get_online_users, 5000);
}