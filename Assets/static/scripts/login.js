function send_login_request(username, password, cookie) {
    let packet = {
        "type": 2, // TYPE_AUTHENTICATE
        "isFinal": true,
        "object": {
            "username": username,
            "password": password,
            "cookieAuth": cookie
        }
    };

    let f = async (e) => {
        let response = new Packet({
            "buffer": new Uint8Array(await e.data.arrayBuffer())
        });

        if (response.type == Application.PACKET_TYPE_ERROR) {
            if (!cookie) document.getElementById("login-err-msg").innerHTML = "<div class=\"error-card\"><h2>Login failed</h2><p>Incorrect username or password.</p></div>"
            return;
        }
        else {
            app.data.user = response.getData();
            app.page = new Page(Page.PAGE_MAIN);
            app.load_page(() => {setup_messenger();});
        }
    }

    app.sock.onmessage = f;

    if (app.sock.readyState === WebSocket.CONNECTING) app.sock.onopen = (e) => app.sock.send(new Packet(packet).getBytes());
    else app.sock.send(new Packet(packet).getBytes());
}

async function attempt_login() {
    let username = document.getElementById("login_username_entry").value;
    let password = document.getElementById("login_password_entry").value;

    if (username == "" || password == "") {
        document.getElementById("login-err-msg").innerHTML = "<div class=\"error-card\"><h2>Login failed</h2><p>Please fill in all the fields.</p></div>"
        return;
    }

    send_login_request(username, password);
}

function switch_to_new_user_page() {
    window.location = "https://data.nathcat.net/sso/?newUser";
    return;
}
