function send_login_request(username, password_hashed) {
    let packet = {
        "type": 2, // TYPE_AUTHENTICATE
        "isFinal": true,
        "object": {
            "username": username,
            "password": password_hashed
        }
    };

    let f = async (e) => {
        let response = new Packet({
            "buffer": await e.data.bytes()
        });

        if (response.type == Application.PACKET_TYPE_ERROR) {
            document.getElementById("login-err-msg").innerHTML = "<div class=\"error-card\"><h2>Login failed</h2><p>Incorrect username or password.</p></div>"
            return;
        }
        else {
            app.data.user = response.getData();
            app.page = new Page(Page.PAGE_MAIN);
            app.load_page(() => {setup_messenger();});
        }
    }

    app.sock.onmessage = f;

    app.sock.send(new Packet(packet).getBytes());
}

async function attempt_login() {
    let username = document.getElementById("login_username_entry").value;
    let password = document.getElementById("login_password_entry").value;

    if (username == "" || password == "") {
        document.getElementById("login-err-msg").innerHTML = "<div class=\"error-card\"><h2>Login failed</h2><p>Please fill in all the fields.</p></div>"
        return;
    }

    send_login_request(username, await sha256(password));
}

function switch_to_new_user_page() {
    window.location = "https://data.nathcat.net/sso/?newUser";
    return;
}