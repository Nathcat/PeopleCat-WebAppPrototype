export function load({ url }) {
    return {
        path: url.pathname.split("/").filter((s) => s != ""),
    };
}