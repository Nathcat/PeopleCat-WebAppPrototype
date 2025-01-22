package com.nathcat.peoplecat_prototype;

import java.io.ByteArrayInputStream;
import java.io.FileInputStream;
import java.io.IOException;
import java.security.cert.Certificate;
import java.security.KeyFactory;
import java.security.KeyStore;
import java.security.NoSuchAlgorithmException;
import java.security.PrivateKey;
import java.security.cert.CertificateFactory;
import java.security.cert.X509Certificate;
import java.security.cert.CertificateException;
import java.security.interfaces.RSAPrivateKey;
import java.security.spec.InvalidKeySpecException;
import java.security.spec.PKCS8EncodedKeySpec;
import java.util.Arrays;
import java.util.Base64;

import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import org.json.simple.JSONObject;


/**
 * Provide SSLContext from a Let's Encrypt certificate chain
 * 
 * @author Nathan Baines
 */
public class LetsEncryptProvider {

    private final JSONObject config;

    /**
     * @param sslConfig Should specify the file path of the certificate information:
     * 
     *                  <pre>
     * {
     *      "certchain-path": String,
     *      "privatekey-path": String
     * }
     *                  </pre>
     */
    public LetsEncryptProvider(JSONObject sslConfig) {
        config = sslConfig;
    }

    public SSLContext getContext() {
        try {
            SSLContext context = SSLContext.getInstance("TLS");


            byte[] keyBytes = parseDERFromPEM(getBytes((String) config.get("privatekey-path")),
                    "-----BEGIN PRIVATE KEY-----", "-----END PRIVATE KEY-----");

            Certificate[] certs = getCertificateChain((String) config.get("certchain-path"));
            PrivateKey key = generatePrivateKeyFromDER(keyBytes);

            KeyStore keyStore = KeyStore.getInstance("JKS");
            keyStore.load(null);
            keyStore.setCertificateEntry("cert-alias", certs[0]);
            keyStore.setKeyEntry("key-alias", key, "pass".toCharArray(), certs);

            KeyManagerFactory kmf = KeyManagerFactory.getInstance("SunX509");
            kmf.init(keyStore, "pass".toCharArray());

            context.init(kmf.getKeyManagers(), null, null);
            return context;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }

    private static byte[] parseDERFromPEM(byte[] pem, String delimStart, String delimEnd) {
        String data = new String(pem);
        String[] tokens = data.split(delimStart);
        tokens = tokens[1].split(delimEnd);
        return Base64.getDecoder().decode(tokens[0].replaceAll("\n", ""));
    }

    public static PrivateKey generatePrivateKeyFromDER(byte[] key)
            throws InvalidKeySpecException, NoSuchAlgorithmException {
        PKCS8EncodedKeySpec spec = new PKCS8EncodedKeySpec(key);
        KeyFactory f = KeyFactory.getInstance("EC");
        return f.generatePrivate(spec);
    }

    private static X509Certificate generateCertificateFromDER(byte[] cert) throws CertificateException {
        CertificateFactory f = CertificateFactory.getInstance("X.509");

        return (X509Certificate) f.generateCertificate(new ByteArrayInputStream(cert));
    }

    private static byte[] getBytes(String path) {
        try (FileInputStream fis = new FileInputStream(path)) {
            return fis.readAllBytes();
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private static Certificate[] getCertificateChain(String fullChainPEM) {
        String pem = new String(getBytes(fullChainPEM));

        return Arrays.stream(pem.split("-----BEGIN CERTIFICATE-----"))
            .filter((Object i) -> {
                return !i.equals("");
            })
            .map((Object i) -> {
                try {
                    return generateCertificateFromDER(
                            Base64.getDecoder().decode(
                                    ((String) i).split("-----END CERTIFICATE-----")[0].replaceAll("\n", "")));
                } catch (CertificateException e) {
                    throw new RuntimeException(e);
                }
            })
            .toList().toArray(new Certificate[0]);
    }
}
