export async function readCSV(file: File): Promise<Record<string, string>[]> {
  const content = await file.text(); // read file as string
  const lines = content.trim().split("\n");

  const headers = lines[0].split(",");
  const rows = lines.slice(1).map((line) => {
    const values = line.split(",");
    const row: Record<string, string> = {};
    headers.forEach((h, i) => (row[h] = values[i]));
    return row;
  });

  return rows;
}

export async function readCSVFromURL(
  url: string
): Promise<Record<string, string>[]> {
  const content = await fetch(url).then((res) => res.text());
  const lines = content.trim().split("\n");

  const headers = lines[0].split(",");
  const rows = lines.slice(1).map((line) => {
    const values = line.split(",");
    const row: Record<string, string> = {};
    headers.forEach((h, i) => (row[h] = values[i]));
    return row;
  });

  return rows;
}
