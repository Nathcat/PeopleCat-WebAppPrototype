function send_login_request(username, password_hashed) {
    let packet = {
        "type": 2, // TYPE_AUTHENTICATE
        "isFinal": true,
        "Username": username,
        "Password": password_hashed
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
            app.load_page(() => {setup_messenger();});
        }
    }
    app.sock.send(JSON.stringify(packet));
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

async function create_new_user() {
    let username = document.getElementById("create_user_username_entry").value;
    let display_name = document.getElementById("create_user_displayname_entry").value;
    let password = document.getElementById("create_user_password_entry").value;
    let password2 = document.getElementById("create_user_password2_entry").value;

    if (username == "" || display_name == "" || password == "" || password2 == "") {
        document.getElementById("new-user-err-msg").innerHTML = "<div class=\"error-card\"><h2>Invalid entry</h2><p>Please ensure that non of the fields are empty</p></div>";
        return;
    }
    else if (password != password2) {
        document.getElementById("new-user-err-msg").innerHTML = "<div class=\"error-card\"><h2>Passwords do not match</h2><p>The passwords you have entered do not match, please try again</p></div>";
        return;
    }

    app.sock.onmessage = (e) => {
        let response = JSON.parse(e.data);
        if (response.type == Application.PACKET_TYPE_ERROR) {
            console.log(response);
            document.getElementById("new-user-err-msg").innerHTML = "<div class=\"error-card\"><h2>" + response.name + "</h2><p>" + response.msg + "</p></div>";
            return;
        }
        else {
            send_login_request(response.Username, response.Password);
        }
    };

    app.sock.send(JSON.stringify({
        "type": Application.PACKET_TYPE_CREATE_NEW_USER,
        "isFinal": true,
        "Username": username,
        "Password": await sha256(password),
        "DisplayName": display_name
    }));
}

function switch_to_new_user_page() {
    window.location = "https://data.nathcat.net/sso/?newUser";
    return;
    // Creating new users is now delegated solely to AuthCat
    app.page = new Page(Page.PAGE_CREATE_USER); app.load_page(() => {
        document.getElementById('create_user_username_entry').onkeydown = (e) => {
            if (e.key == 'Enter') create_new_user();
        };
        
        document.getElementById('create_user_password_entry').onkeydown = (e) => {
            if (e.key == "Enter") create_new_user();
        };

        document.getElementById('create_user_password2_entry').onkeydown = (e) => {
            if (e.key == "Enter") create_new_user();
        };

        document.getElementById('create_user_displayname_entry').onkeydown = (e) => {
            if (e.key == "Enter") create_new_user();
        };
    });
}