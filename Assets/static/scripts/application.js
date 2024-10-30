class Page {
    static PAGE_LOGIN = 0;
    static PAGE_MAIN = 1;
    static PAGE_CONNECT_ERR = 2;
    static PAGE_CREATE_USER = 3;

    constructor(state) {
        this.state = state;
    }

    async get_page_content() {
        let url = "/";

        if (this.state == Page.PAGE_LOGIN) {
            url = "/pages?path=Login-page.html";
        }
        else if (this.state == Page.PAGE_MAIN) {
            url = "/pages?path=Main-page.html";
        }
        else if (this.state == Page.PAGE_CONNECT_ERR) {
            url = "/pages?path=Connect-error.html";
        }
        else if (this.state == Page.PAGE_CREATE_USER) {
            url = "/pages?path=Create-New-User-page.html";
        }

        return await fetch(url);
    }
}

class Application {
    static PACKET_TYPE_ERROR = 0;
    static PACKET_TYPE_PING = 1;
    static PACKET_TYPE_AUTHENTICATE = 2;
    static PACKET_TYPE_CREATE_NEW_USER = 3;
    static PACKET_TYPE_CLOSE = 4;
    static PACKET_TYPE_GET_USER = 5;
    static PACKET_TYPE_GET_MESSAGE_QUEUE = 6;
    static PACKET_TYPE_SEND_MESSAGE = 7;
    static PACKET_TYPE_NOTIFICATION_MESSAGE = 8;
    static PACKET_TYPE_JOIN_CHAT = 9;

    constructor() {
        this.sock = new WebSocket("wss://nathcat.net:1234");
        this.page = new Page(Page.PAGE_LOGIN);
        this.data = {};
        this.data.known_users = [];

        this.sock.onopen = (e) => {
            console.log("Socket is open!");
            console.log(e);
        };

        this.sock.onclose = (e) => {
            console.log("Socket is closed!");
            console.log(e);
        }

        this.sock.onerror = (e) => {
            console.log("An error occurred and the socket failed to connect!");
            this.page = new Page(Page.PAGE_CONNECT_ERR);
            this.load_page();
        }
    }

    async load_page(on_finish) {
        let html_content = await this.page.get_page_content();
        let content = await html_content.text();

        content = content.split("$");
        for (let i = 1; i < content.length; i += 2) {
            if (i == content.length - 1) { break; }

            let reference = content[i].split(".");
            console.log("Got reference: " + reference);
            let value = this.data[reference[0]];
            console.log(value);
            for (let ii = 1; ii < reference.length; ii++) {
                if (value === undefined) break;
                value = value[reference[ii]];
                console.log(value);
            }

            content[i] = value;
        }

        document.getElementById("page-content").innerHTML = content.join("");
        if (on_finish != undefined) on_finish();
    }

    get_user(userID) {
        if (this.data.user == undefined) return null;

        if (this.data.user.id == userID) return this.data.user;
        else {
            for (let i = 0; i < this.data.known_users.length; i++) {
                if (this.data.known_users[i].id == userID) {
                    return this.data.known_users[i];
                }
            }
        }

        return null;
    }
}

function sha256(string) {
    const utf8 = new TextEncoder().encode(string);
    return crypto.subtle.digest('SHA-256', utf8).then((hashBuffer) => {
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map((bytes) => bytes.toString(16).padStart(2, '0'))
        .join('');
      return hashHex;
    });
  }

var THEME = 0;
function toggle_theme() {
    THEME = (THEME + 1) % 2;
    if (THEME == 0) {
        document.querySelector(":root").style.setProperty('--primary-color', '#251D3A', 'important');document.querySelector(":root").style.setProperty('--secondary-color', '#2A2550', 'important');document.querySelector(":root").style.setProperty('--tertiary-color', '#E04D01', 'important');document.querySelector(":root").style.setProperty('--quad-color', '#FF7700', 'important');
    }
    else if (THEME == 1) {
        document.querySelector(":root").style.setProperty('--primary-color', '#2c2f33', 'important');document.querySelector(":root").style.setProperty('--secondary-color', '#262729', 'important');document.querySelector(":root").style.setProperty('--tertiary-color', '#ff7700', 'important');document.querySelector(":root").style.setProperty('--quad-color', '#ffffff', 'important');
    }
    else {
        console.log("Oops");
    }
}

var VISIBLE = true;

function pageFocus() {
    document.getElementById("icon").href = "/images?path=favicon.png";
    VISIBLE = true;
}

window.addEventListener("focus", pageFocus);
window.addEventListener("pageshow", pageFocus);
window.addEventListener("blur", () => VISIBLE = false);
window.addEventListener("pagehide", () => VISIBLE = false);