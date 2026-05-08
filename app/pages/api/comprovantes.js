export default async function handler(req, res) {
  try {
    const [
      consumo,
      das,
      fgts,
      gps,
      dae,
      ficha,
      tributo,
    ] = await Promise.all([
      import("../consumo/index").then((m) => ({
        tipo: "consumo",
        config: m.utilityBillReceiptConfig,
      })),
      import("../das/index").then((m) => ({ tipo: "das", config: m.dasReceiptConfig })),
      import("../fgts/index").then((m) => ({ tipo: "fgts", config: m.fgtsReceiptConfig })),
      import("../gps/index").then((m) => ({ tipo: "gps", config: m.gpsReceiptConfig })),
      import("../dae/index").then((m) => ({ tipo: "dae", config: m.daeDafReceiptConfig })),
      import("../ficha/index").then((m) => ({
        tipo: "ficha",
        config: m.compensationSlipReceiptConfig,
      })),
      import("../tributo_municipal/index").then((m) => ({
        tipo: "tributo_municipal",
        config: m.municipalTaxReceiptConfig,
      })),
    ]);

    const itens = [consumo, das, fgts, gps, dae, ficha, tributo]
      .map(({ tipo, config }) => ({
        tipo,
        title: config?.title || tipo,
        subtitle: config?.subtitle || "",
        href: `/comprovante/${tipo}`,
      }))
      .sort((a, b) => a.title.localeCompare(b.title, "pt-BR"));

    res.status(200).json({ itens });
  } catch (e) {
    res.status(500).json({ itens: [] });
  }
}

