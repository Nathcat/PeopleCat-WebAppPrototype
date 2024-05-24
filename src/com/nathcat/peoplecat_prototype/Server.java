package com.nathcat.peoplecat_prototype;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;
import com.sun.net.httpserver.HttpServer;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.json.simple.parser.ParseException;

import java.io.*;
import java.net.InetSocketAddress;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

public class Server {
    public static String phpExecPath;

    /**
     * Get the server's configuration file located at Assets/Server_Config.json
     * @return A JSONObject with the files contents
     * @throws FileNotFoundException Thrown if the config file does not exist
     * @throws ParseException Thrown if the config file contains a JSON syntax error
     */
    public static JSONObject getConfigFile() throws FileNotFoundException, ParseException {
        Scanner f = new Scanner(new File("Assets/Server_Config.json"));
        StringBuilder sb = new StringBuilder();
        while (f.hasNextLine()) {
            sb.append(f.nextLine());
        }

        return (JSONObject) new JSONParser().parse(sb.toString());
    }

    public static void main(String[] args) throws Exception {
        JSONObject config = null;
        try {
            config = getConfigFile();
        } catch (FileNotFoundException e) {
            System.err.println("Config file not found! Please make sure the config file exists at Assets/Server_Config.json!");
            System.exit(-1);
        } catch (ParseException e) {
            System.err.println("Syntax error in config file! Please check your JSON.");
            System.exit(-2);
        }

        assert config != null;
        phpExecPath = (String) config.get("php_exec_path");

        if (phpExecPath != null || config.get("port") != null) {
            System.err.println("Missing one or more fields in the config file, please ensure it includes \"php_exec_path\" and \"port\" fields.");
            System.exit(-3);
        }

        HttpServer server = HttpServer.create(new InetSocketAddress((int) config.get("port")), 0);
        server.createContext("/", new WelcomePageHandler());
        server.createContext("/script", new ServeStaticHandler("text/javascript", "Assets/static/scripts"));
        server.createContext("/styles", new ServeStaticHandler("text/css", "Assets/static/styles"));
        server.createContext("/images", new ServeStaticHandler("image/apng", "Assets/static/images"));
        server.createContext("/pages", new ServeStaticHandler("text/html", "Assets/static/HTML"));
        server.createContext("/login", new LoginHandler());
        server.setExecutor(null);
        server.start();
    }

    /**
     * Transform a URI query string into a map of parameters to values.
     * @param query The query string
     * @return A map of parameter names to their values within the query string.
     */
    public static Map<String, String> queryToMap(String query) {
        Map<String, String> res = new HashMap<>();

        for (String s : query.split("&")) {
            String[] pv = s.split("=");
            if (pv.length > 1) {
                res.put(pv[0], pv[1]);
            }
            else {
                res.put(pv[0], "");
            }
        }

        return res;
    }

    /**
     * Process a PHP file given a set of parameters.
     * @param file The PHP file
     * @param params The parameters
     * @return The processed HTML
     * @throws IOException thrown in case of errors with the file I/O
     */
    public static String getPHPFile(String file, Map<String, String> params) throws IOException {
        String[] commands = new String[params.size() + 2];
        commands[0] = "/usr/bin/php"; commands[1] = file;
        int i = 2;
        for (String key : params.keySet()) {
            commands[i] = key + "=" + params.get(key).replace(" ", "%20");
            i++;
        }

        ProcessBuilder builder = new ProcessBuilder(commands);
        Process p = builder.start();

        while (p.isAlive()) {}

        InputStream is = p.getInputStream();
        if (is.available() == 0) return "";
        else {
            byte[] buffer = new byte[is.available()];
            is.read(buffer);
            return new String(buffer);
        }
    }

    /**
     * Handler class which serves a static file
     */
    static class ServeStaticHandler implements HttpHandler {
        private final String cType, basePath;

        public ServeStaticHandler(String cType, String basePath) {
            this.cType = cType;
            this.basePath = basePath;
        }

        @Override
        public void handle(HttpExchange t) throws IOException {
            Map<String, String> query = queryToMap(t.getRequestURI().getQuery());
            Headers responseHeaders = t.getResponseHeaders();
            byte[] response = new byte[0];
            int responseCode;

            String filePath = query.get("path");
            if (filePath == null) {
                responseCode = 500;
            }
            else {
                File file = new File(basePath + "/" + filePath);
                if (file.exists()) {
                    responseCode = 200;
                    InputStream is = new FileInputStream(file);
                    response = new byte[is.available()];
                    is.read(response);
                    is.close();
                }
                else {
                    responseCode = 404;
                }
            }

            responseHeaders.set("Content-Type", cType);
            responseHeaders.set("Access-Control-Allow-Origin", "*");
            t.sendResponseHeaders(responseCode, response.length);
            OutputStream os = t.getResponseBody();
            os.write(response);
            os.close();
        }
    }

    static class WelcomePageHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange t) throws IOException {
            Scanner f = new Scanner(t.getRequestBody());
            String body = f.hasNextLine() ? f.nextLine() : "";
            Map<String, String> params = queryToMap(body);

            String response = getPHPFile("Assets/static/HTML/Application.html", params);

            t.getResponseHeaders().set("Content-Type", "text/html");
            t.sendResponseHeaders(200, response.length());
            OutputStream os = t.getResponseBody();
            os.write(response.getBytes());
            os.close();
        }
    }

    static class LoginHandler implements HttpHandler {
        @Override
        public void handle(HttpExchange t) throws IOException {
            Map<String, String> query = queryToMap(new Scanner(t.getRequestBody()).nextLine());
            HashMap<String, String> params = new HashMap<>();
            if (!(query.get("username") != null && !query.get("username").contentEquals("")) || !(query.get("password") != null && !query.get("password").contentEquals(""))) {
                params.put("login_error", "Neither field should be left blank!");
            }

            String response = getPHPFile("Assets/static/HTML/Welcome.php", params);
            t.sendResponseHeaders(200, response.length());
            OutputStream os = t.getResponseBody();
            os.write(response.getBytes());
            os.close();
        }
    }
}