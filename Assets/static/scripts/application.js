class Page {
    static PAGE_LOGIN = 0;
    static PAGE_MAIN = 1;
    static PAGE_CONNECT_ERR = 2;

    constructor(state) {
        this.state = state;
    }

    async get_page_content() {
        let url = "http://13.40.94.202";

        if (this.state == Page.PAGE_LOGIN) {
            url = "http://13.40.94.202/pages?path=Login-page.html";
        }
        else if (this.state == Page.PAGE_MAIN) {
            url = "http://13.40.94.202/pages?path=Main-page.html";
            setTimeout(setup_messenger, 1000);
        }
        else if (this.state = Page.PAGE_CONNECT_ERR) {
            url = "http://13.40.94.202/pages?path=Connect-error.html";
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
        this.sock = new WebSocket("ws://13.40.94.202:1234");
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
            console.log("An error occured and the socket failed to connect!");
            this.page = new Page(Page.PAGE_CONNECT_ERR);
            this.load_page();
        }
    }

    async load_page() {
        let html_content = await this.page.get_page_content();
        let content = await html_content.text();
        content = [...content];

        let isInTemplate = false;
        let templateStart = 0;
        for (let i = 0; i < content.length; i++) {
            if (content[i] == "$" && !isInTemplate) {
                isInTemplate = true;
                templateStart = i;
            }
            else if (content[i]  == "$" && isInTemplate) {
                isInTemplate = false;
                let template = content.join("").substring(templateStart + 1, i).split(".");
                let item = app.data;
                for (let x = 0; x < template.length; x++) {
                    if (item == undefined) break;
                    item = item[template[x]];
                }
                
                content.splice(templateStart, i - templateStart + 1, item);
            }
        }

        document.getElementById("page-content").innerHTML = content.join("");
    }

    get_user(userID) {
        if (this.data.user == undefined) return null;

        if (this.data.user.UserID == userID) return this.data.user;
        else {
            for (let i = 0; i < this.data.known_users.length; i++) {
                if (this.data.known_users[i].UserID == userID) {
                    return this.data.known_users[i];
                }
            }
        }

        return null;
    }
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