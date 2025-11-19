export default async function handler(req, res) {

  // CORS liberado
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    const url = "https://cdn5.editmysite.com/app/store/api/v28/editor/users/43097125/sites/223996372125883883/products?page=1&per_page=150&sort_by=created_date&sort_order=desc&include=images,media_files,discounts";

    const response = await fetch(url);
    const data = await response.json();
    
    // A API do Square devolve assim:
    // [{ data: [ ...produtos... ] }]
    const rawProducts = data?.[0]?.data || [];

    const products = rawProducts.map(p => {
      const image =
        p.images?.data?.[0]?.absolute_url ||
        p.thumbnail?.data?.absolute_url ||
        "";

      return {
        id: p.id,
        name: p.name,
        price: p.price?.low_formatted || "",
        image,
        description: p.short_description || "",
        link: p.absolute_site_link || ""
      };
    });

    return res.status(200).json(products);

  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to load products" });
  }
}
