function attempt_login() {
    let username = document.getElementById("login_username_entry").value;
    let password = document.getElementById("login_password_entry").value;

    if (username == "" || password == "") {
        document.getElementById("login-err-msg").innerHTML = "<div class=\"error-card\"><h2>Login failed</h2><p>Please fill in all the fields.</p></div>"
        return;
    }

    let packet = {
        "type": 2, // TYPE_AUTHENTICATE
        "isFinal": true,
        "Username": username,
        "Password": password
    };

    app.sock.onmessage = (e) => {
        let response = JSON.parse(e.data);

        if (response.type == Application.PACKET_TYPE_ERROR) {
            document.getElementById("login-err-msg").innerHTML = "<div class=\"error-card\"><h2>Login failed</h2><p>Incorrect username or password.</p></div>"
            return;
        }
        else {
            app.data.user = response;
            app.page = new Page(Page.PAGE_MAIN);
            app.load_page();
        }
    }
    app.sock.send(JSON.stringify(packet));
}

setTimeout(() => {
    document.getElementById("login_username_entry").onkeydown = (e) => {
        if (e.key == "Enter") attempt_login();
    };
    
    document.getElementById("login_password_entry").onkeydown = (e) => {
        if (e.key == "Enter") attempt_login();
    };
}, 500);