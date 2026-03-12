import React, { useMemo, useState } from "react";
import pageStyles from "/styles/Page.module.css";
import styles from "/styles/ScriptTester.module.css";
import cardStyles from "/styles/CardCreator.module.css";
import popupStyles from "/styles/PopupCreator.module.css";

const mapTituloFont = (id) => {
    const value = String(id || "1");
    if (value === "3") return "20pt";
    if (value === "2") return "18pt";
    return "15pt";
};

const mapSubtituloFont = (id) => {
    const value = String(id || "1");
    if (value === "3") return "15pt";
    if (value === "2") return "14pt";
    return "13pt";
};

const detectType = (text) => {
    if (/MENU_ACO_MBK/i.test(text)) return "card";
    if (/INFORMAC_POPUP_ACO/i.test(text)) return "popup";
    return null;
};

const extractBase64 = (text) => {
    const match = text.match(/@str\s+varchar\(max\)\s*=\s*'([^']+)'/i);
    return match ? match[1].trim() : "";
};

const extractNumeroAcao = (text) => {
    const match = text.match(/VALUES\s*\(\s*([0-9]+)/i);
    return match ? match[1] : "";
};

const extractTipoLayout = (text) => {
    const match = text.match(/VALUES\s*\(\s*[0-9]+\s*,\s*7\s*,\s*([0-9]+)/i);
    return match ? match[1] : "";
};

const extractJson = (text) => {
    // 1) tenta pegar JSON com escapes (\")
    const matchEscaped = text.match(/'(\{\\"?Titulo\\"?.*?\})'/is);
    if (matchEscaped) {
        const normalized = matchEscaped[1].replace(/\\"/g, '"');
        return JSON.parse(normalized);
    }

    // 2) tenta pegar JSON "cru" (sem escapes), comum em scripts colados direto
    const matchRaw = text.match(/'(\{\s*"Titulo".*\})'/is);
    if (matchRaw) {
        return JSON.parse(matchRaw[1]);
    }

    throw new Error("Não consegui encontrar o JSON no script.");
};

const CardPreview = ({ data }) => {
    const layout = String(data.layout || "");
    const isLayoutDireita = ["322", "323", "324", "275"].includes(layout);
    const mostrarTitulo = !["321", "324"].includes(layout);
    const mostrarSubtitulo = !["320", "323"].includes(layout);
    const mostrarCTA = !["271", "275"].includes(layout);

    return (
        <div
            className={`${cardStyles.cardPreview} ${isLayoutDireita ? cardStyles.layoutDireita : cardStyles.layoutEsquerda}`}
            style={{
                backgroundImage: `linear-gradient(45deg, ${data.corInicio}, ${data.corFim})`,
            }}
        >
            <div
                className={cardStyles.cardPreviewIMG}
                style={{
                    backgroundImage: data.imagemSrc ? `url(${data.imagemSrc})` : "none",
                    backgroundPosition: isLayoutDireita ? "right center" : "left center",
                    backgroundSize: "cover",
                    order: isLayoutDireita ? 2 : 1,
                }}
            ></div>
            <div
                className={cardStyles.cardPreviewContent}
                style={{ order: isLayoutDireita ? 1 : 2 }}
            >
                {mostrarTitulo && (
                    <div
                        className={cardStyles.tituloPreview}
                        style={{ color: data.corTitulo }}
                    >
                        {data.titulo || "(sem título)"}
                    </div>
                )}
                {mostrarSubtitulo && (
                    <div
                        className={cardStyles.subtituloPreview}
                        style={{ color: data.corSubtitulo }}
                    >
                        {data.subtitulo || "(sem subtítulo)"}
                    </div>
                )}
                {mostrarCTA && (
                    <div className={cardStyles.ctaPreviewWrapper}>
                        <button
                            className={cardStyles.cardCTA}
                            style={{
                                color: data.corTextoCTA,
                                backgroundColor: data.corFundoCTA,
                                border: `2px solid ${data.corBordaCTA}`,
                            }}
                        >
                            {data.textoCTA || "CTA"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

const PopupPreview = ({ data }) => {
    const fontSizeTitle = mapTituloFont(data.tamanhoTitulo);
    const fontSizeSubtitle = mapSubtituloFont(data.tamanhoSubtitulo);

    const sharedCTA = (
        <div
            className={popupStyles.popupCTA}
            style={{
                color: data.corTextoCTA,
                backgroundColor: data.corFundoCTA,
                border: `2px solid ${data.corBordaCTA}`,
            }}
        >
            {data.textoCTA || "CTA"}
        </div>
    );

    if (data.layout === "335") {
        return (
            <div className={`${popupStyles.popupPreviewFull} ${popupStyles.layout335}`}>
                <div
                    className={popupStyles.popupImageFull}
                    style={{
                        backgroundImage: data.imagemSrc ? `url(${data.imagemSrc})` : "none",
                    }}
                >
                    <div
                        className={popupStyles.btnFechar}
                        style={{ color: data.corBtnFechar }}
                    >
                        X {data.textoBtnFechar}
                    </div>
                </div>
            </div>
        );
    }

    if (data.layout === "333") {
        return (
            <div
                className={`${popupStyles.popupPreview} ${popupStyles.layout333}`}
                style={{
                    backgroundImage: `linear-gradient(45deg, ${data.corInicio}, ${data.corFim})`,
                }}
            >
                <div
                    className={popupStyles.btnFechar}
                    style={{ color: data.corBtnFechar }}
                >
                    {data.textoBtnFechar} X
                </div>
                <div
                    className={popupStyles.popupImageTop}
                    style={{
                        backgroundImage: data.imagemSrc ? `url(${data.imagemSrc})` : "none",
                    }}
                ></div>
                <div className={popupStyles.popupContent}>
                    <div
                        className={popupStyles.popupTitle}
                        style={{ color: data.corTitulo, fontSize: fontSizeTitle }}
                    >
                        {data.titulo || "(sem título)"}
                    </div>
                    <div
                        className={popupStyles.popupSubtitle}
                        style={{ color: data.corSubtitulo, fontSize: fontSizeSubtitle }}
                    >
                        {data.subtitulo || "(sem subtítulo)"}
                    </div>
                </div>
                <div className={popupStyles.popupCTAWrapper}>{sharedCTA}</div>
            </div>
        );
    }

    return (
        <div
            className={`${popupStyles.popupPreview} ${popupStyles.layout334}`}
            style={{
                backgroundImage: `linear-gradient(45deg, ${data.corInicio}, ${data.corFim})`,
            }}
        >
            <div
                className={popupStyles.btnFechar}
                style={{ color: data.corBtnFechar }}
            >
                X {data.textoBtnFechar}
            </div>
            <div className={popupStyles.popupContent}>
                <div
                    className={popupStyles.popupTitle}
                    style={{ color: data.corTitulo, fontSize: fontSizeTitle }}
                >
                    {data.titulo || "(sem título)"}
                </div>
                <div
                    className={popupStyles.popupSubtitle}
                    style={{ color: data.corSubtitulo, fontSize: fontSizeSubtitle }}
                >
                    {data.subtitulo || "(sem subtítulo)"}
                </div>
            </div>
            <div
                className={popupStyles.popupImageMiddle}
                style={{
                    backgroundImage: data.imagemSrc ? `url(${data.imagemSrc})` : "none",
                }}
            ></div>
            <div className={popupStyles.popupCTAWrapper}>{sharedCTA}</div>
        </div>
    );
};

const PhoneMockup = ({ parsed }) => {
    if (!parsed) {
        return (
            <div className={styles.phonePlaceholder}>
                Cole o script e clique em "Carregar preview" para ver o mockup.
            </div>
        );
    }

    const now = new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    });

    if (parsed.type === "popup") {
        return (
            <div className={popupStyles.phoneMockup}>
                <div className={popupStyles.phoneNotch}></div>
                <div className={popupStyles.phoneScreen}>
                    <div className={popupStyles.popupContainer}>
                        <PopupPreview data={parsed} />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={cardStyles.phoneMockup}>
            <div className={cardStyles.phoneNotch}></div>
            <div className={cardStyles.phoneScreen}>
                <div className={cardStyles.statusBar}>
                    <div>{now}</div>
                    <div className={cardStyles.statusBarIcons}>
                        <span>•••</span>
                        <span>📶</span>
                        <span>🔋</span>
                    </div>
                </div>

                <div className={cardStyles.appHeader}>
                    <div className={cardStyles.headerTop}>
                        <div className={cardStyles.greeting}>Olá, Fulano(a)!</div>
                        <div className={cardStyles.headerControls}>
                            <div className={cardStyles.headerControl}>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="20"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
                                    <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
                                </svg>
                            </div>
                        </div>
                    </div>

                    <div className={cardStyles.accountInfo}>
                        Agência: 0001 | Conta: 09999999-1
                    </div>

                    <div className={cardStyles.balanceLabel}>Saldo</div>
                    <div className={cardStyles.balanceInfo}>
                        <div className={cardStyles.balanceValue}>R$ 2.138,28</div>
                        <div className={cardStyles.balanceAction}>Ver extrato &gt;</div>
                    </div>
                </div>

                <div className={cardStyles.quickMenu}>
                    <div className={cardStyles.quickAccessItem}>
                        <div className={cardStyles.quickAccessIcon}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={cardStyles.icon}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                            </svg>
                        </div>
                        <span className={cardStyles.quickAccessText}>Pix</span>
                    </div>
                    <div className={cardStyles.quickAccessItem}>
                        <div className={cardStyles.quickAccessIcon}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={cardStyles.icon}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <span className={cardStyles.quickAccessText}>Empréstimos</span>
                    </div>
                    <div className={cardStyles.quickAccessItem}>
                        <div className={cardStyles.quickAccessIcon}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={cardStyles.icon}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path>
                            </svg>
                        </div>
                        <span className={cardStyles.quickAccessText}>Investir</span>
                    </div>
                    <div className={cardStyles.quickAccessItem}>
                        <div className={cardStyles.quickAccessIcon}>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className={cardStyles.icon}
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
                            </svg>
                        </div>
                        <span className={cardStyles.quickAccessText}>Pagar</span>
                    </div>
                </div>

                <div className={cardStyles.appContent}>
                    <h3 className={cardStyles.appHeading}>Destaques para você</h3>
                    <CardPreview data={parsed} />
                </div>
            </div>
        </div>
    );
};

export default function ScriptTester() {
    const [scriptText, setScriptText] = useState("");
    const [forcedType, setForcedType] = useState("auto");
    const [parsed, setParsed] = useState(null);
    const [error, setError] = useState("");

    const handleParse = () => {
        setError("");
        setParsed(null);

        const text = scriptText.trim();
        if (!text) {
            setError("Cole o conteúdo do script gerado para visualizar.");
            return;
        }

        const typeDetected = forcedType !== "auto" ? forcedType : detectType(text);
        if (!typeDetected) {
            setError("Não consegui detectar se o script é de card ou popup.");
            return;
        }

        try {
            const numeroAcao = extractNumeroAcao(text);
            const layout = extractTipoLayout(text);
            const base64 = extractBase64(text);
            const json = extractJson(text);

            const itemCard = json?.Valor?.ItemCard || {};
            const imagemFundo = itemCard.ImagemFundo || {};
            const complemento = itemCard.Complemento || {};
            const navegacao = itemCard.Navegacao || {};
            const payload = navegacao.Payload || {};
            const botao = itemCard.BotaoLimpar || {};

            if (typeDetected === "card") {
                setParsed({
                    type: "card",
                    numeroAcao: numeroAcao || String(itemCard.IdentificadorAcao || ""),
                    layout: layout || String(itemCard.IdTipoRecurso || ""),
                    imagemSrc: base64 ? `data:image/png;base64,${base64}` : "",
                    titulo: json.Titulo || "",
                    subtitulo: complemento.SubTitulo || "",
                    textoCTA: complemento.TextoCta || "",
                    corTitulo: imagemFundo.CorTitulo || "#000000",
                    corSubtitulo: imagemFundo.CorSubTitulo || "#000000",
                    corTextoCTA: imagemFundo.CorTextoCta || "#000000",
                    corFundoCTA: imagemFundo.CorFundoCta || "#FFFFFF",
                    corBordaCTA: imagemFundo.CorBordaCta || "#FFFFFF",
                    corInicio: imagemFundo.CorInicio || "#FFFFFF",
                    corFim: imagemFundo.CorFim || "#FFFFFF",
                    metodo: navegacao.Metodo || "",
                    link: navegacao.Link || "",
                    codigo: navegacao.CodMensagemAlerta || "",
                    idCAT: payload.IdtCat ? String(payload.IdtCat) : "",
                });
                return;
            }

            setParsed({
                type: "popup",
                numeroAcao: numeroAcao || String(itemCard.IdentificadorAcao || ""),
                layout: layout || String(itemCard.IdTipoRecurso || ""),
                imagemSrc: base64 ? `data:image/png;base64,${base64}` : "",
                titulo: json.Titulo || "",
                subtitulo: complemento.SubTitulo || "",
                textoCTA: complemento.TextoCta || "",
                tamanhoTitulo: String(complemento.TamanhoTitulo || "1"),
                tamanhoSubtitulo: String(complemento.TamanhoSubtitulo || "1"),
                corTitulo: imagemFundo.CorTitulo || "#ffffff",
                corSubtitulo: imagemFundo.CorSubTitulo || "#ffffff",
                corTextoCTA: imagemFundo.CorTextoCta || "#000000",
                corFundoCTA: imagemFundo.CorFundoCta || "#ffffff",
                corBordaCTA: imagemFundo.CorBordaCta || "#ffffff",
                corInicio: imagemFundo.CorInicio || "#9EEBFF",
                corFim: imagemFundo.CorFim || "#000596",
                metodo: navegacao.Metodo || "",
                link: navegacao.Link || "",
                codigo: navegacao.CodMensagemAlerta || "",
                idCAT: payload.IdtCat ? String(payload.IdtCat) : "",
                textoBtnFechar: botao.Texto || "Fechar",
                corBtnFechar: botao.CorTexto || "#ffffff",
            });
        } catch (err) {
            console.error(err);
            setError(err.message || "Erro ao interpretar o script.");
        }
    };

    return (
        <div className={pageStyles.pageContainer}>
            <div className={pageStyles.pageHeader}>
                <h1 className={pageStyles.pageTitle}>Testar script</h1>
                <p className={styles.subtitle}>
                    Cole o .txt gerado pelo criador de card ou popup para visualizar o mockup.
                </p>
            </div>

            <div className={styles.testerGrid}>
                <div className={styles.leftColumn}>
                    <label className={styles.label}>Script gerado (.txt)</label>
                    <textarea
                        className={styles.textarea}
                        value={scriptText}
                        onChange={(e) => setScriptText(e.target.value)}
                        placeholder="Cole aqui o conteúdo completo do script"
                    />

                    <div className={styles.controlsRow}>
                        <div className={styles.selectWrapper}>
                            <label className={styles.labelSmall}>Tipo</label>
                            <select
                                className={styles.select}
                                value={forcedType}
                                onChange={(e) => setForcedType(e.target.value)}
                            >
                                <option value="auto">Detectar automaticamente</option>
                                <option value="card">Forçar Card</option>
                                <option value="popup">Forçar Popup</option>
                            </select>
                        </div>
                        <button className={styles.primaryButton} onClick={handleParse}>
                            Carregar preview
                        </button>
                    </div>

                    {error && <div className={styles.errorBox}>{error}</div>}
                </div>

                <div className={styles.rightColumn}>
                    <PhoneMockup parsed={parsed} />
                </div>
            </div>
        </div>
    );
}
