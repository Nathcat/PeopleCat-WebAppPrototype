import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;

public class Test {
    private static class PyThread extends Thread {
        public Process p = null;

        @Override
        public void run() {
            ProcessBuilder builder = new ProcessBuilder("/usr/bin/python3.11");
            try {
                p = builder.start();

            } catch (IOException e) {
                throw new RuntimeException(e);
            }

        }
    }

    public static void main(String[] args) throws Exception {
        PyThread t = new PyThread();
        t.setDaemon(true);
        t.start();
        while (t.p == null) {
            System.out.print("");
        }

        InputStream is = t.p.getInputStream();
        OutputStream os = t.p.getOutputStream();

        os.write("exit()\n\r".getBytes());
        os.flush();

        System.out.println("Running");

        while (t.p.isAlive() || is.available() != 0) {
            byte[] b = new byte[is.available()];
            int r = is.read(b);
            if (r != 0) System.out.println(new String(b, StandardCharsets.UTF_8));
        }

        System.out.println("Finished");
    }
}
