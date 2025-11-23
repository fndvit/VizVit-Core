import net from "net";

const port = parseInt(process.argv[2], 10);

function wait() {
  const client = new net.Socket();

  client.once("error", () => {
    setTimeout(wait, 200);
  });

  client.connect({ port }, () => {
    client.end();
    process.exit(0);
  });
}

wait();
