import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "url";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

(async () => {
  const title = process.env.TITLE;
  const estimate = process.env.ESTIMATE;
  const outputPath = process.env.OUTPUT_PATH || "./thumbnail.png";

  const [lucidaGrande, palatino, pfp] = await Promise.all([
    fs.readFile(path.join(__dirname, "fonts", "Lucida Grande.ttf")),
    fs.readFile(path.join(__dirname, "fonts", "Palatino Bold.ttf")),
    fs.readFile(path.join(__dirname, "..", "..", "pfp.png")),
  ]);
  const svg = await satori(
    {
      type: "div",
      props: {
        children: [
          {
            type: "img",
            props: {
              src: pfp.buffer,
              width: 80,
              height: 80,
            },
          },
          {
            type: "h2",
            props: {
              children: "Ricardo Lopes",
              style: {
                fontFamily: "Palatino",
                fontSize: "3.5em",
                color: "#e00000",
              },
            },
          },
          {
            type: "h1",
            props: {
              children: title,
              style: {
                fontWeight: "bold",
                fontFamily: "Palatino",
                fontSize: "6em",
                textAlign: "center",
              },
            },
          },
          {
            type: "p",
            props: {
              children: `${estimate} min read`,
              style: {
                fontFamily: "Lucida Grande",
                fontSize: "2em",
              },
            },
          },
        ],
        style: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-evenly",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          background: "#111111",
          color: "#eeeeee",
          padding: "4em 3em",
          alignItems: "center",
        },
      },
    },
    {
      width: 1200,
      height: 631,
      fonts: [
        { name: "Lucida Grande", data: lucidaGrande },
        { name: "Palatino", data: palatino },
      ],
    }
  );
  const resvg = new Resvg(svg);
  const png = resvg.render();

  // Ensure the directory exists
  await fs.mkdir(path.dirname(outputPath), { recursive: true });

  // Write the file to the specified output path
  await fs.writeFile(outputPath, png.asPng());

  console.log(`Image generated successfully at: ${outputPath}`);
})();
