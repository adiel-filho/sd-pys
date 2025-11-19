export default async function handler(req, res) {

  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const url = "https://cdn5.editmysite.com/app/store/api/v28/editor/users/43097125/sites/223996372125883883/products?page=1&per_page=150&sort_by=created_date&sort_order=desc&include=images,media_files,discounts";

    const response = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
        "Accept": "application/json",
      }
    });

    const data = await response.json();

    // 👇 TENTANDO TODOS OS FORMATOS POSSÍVEIS
    const raw =
      data?.[0]?.data ||      // formato N8N
      data?.data?.data ||     // formato HTTP Request antigo
      data?.data ||           // formato puro
      [];

    const products = raw.map(p => {
      const image =
        p.images?.data?.[0]?.absolute_url ||
        p.thumbnail?.data?.absolute_url ||
        "";

      return {
        id: p.id,
        name: p.name,
        description: p.short_description || "",
        price: p.price?.low_formatted || "",
        image,
        link: p.absolute_site_link || ""
      };
    });

    return res.status(200).json(products);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load products" });
  }
}
