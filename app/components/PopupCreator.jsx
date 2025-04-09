import React, { useState, useEffect, useRef } from "react";
import styles from "/styles/PopupCreator.module.css";
import { ChevronDown } from "lucide-react";

const PopupCreator = () => {
  // Estados para gerenciar os valores do formulário
  const [numeroAcao, setNumeroAcao] = useState("");
  const [imagem, setImagem] = useState(null);
  const [imagemPreview, setImagemPreview] = useState("");
  const [tipoLayout, setTipoLayout] = useState("333");
  const [titulo, setTitulo] = useState("Escreva um título");
  const [corTitulo, setCorTitulo] = useState("#ffffff");
  const [tamanhoTitulo, setTamanhoTitulo] = useState("65");
  const [subtitulo, setSubtitulo] = useState("Escreva um subtítulo");
  const [corSubtitulo, setCorSubtitulo] = useState("#ffffff");
  const [tamanhoSubtitulo, setTamanhoSubtitulo] = useState("22");
  const [textoCTA, setTextoCTA] = useState("Escreva a CTA");
  const [corTextoCTA, setCorTextoCTA] = useState("#000000");
  const [corFundoCTA, setCorFundoCTA] = useState("#ffffff");
  const [corBordaCTA, setCorBordaCTA] = useState("#FFFFFF");
  const [corInicio, setCorInicio] = useState("#9EEBFF");
  const [corFim, setCorFim] = useState("#000596");
  const [textoBtnFechar, setTextoBtnFechar] = useState("Fechar");
  const [corBtnFechar, setCorBtnFechar] = useState("#ffffff");
  const [tipoLink, setTipoLink] = useState("3");
  const [link, setLink] = useState("");
  const [codigo, setCodigo] = useState("");
  const [codigoManual, setCodigoManual] = useState("");
  const [ID, setID] = useState("");
  const [IDManual, setIDManual] = useState("");
  const [statusArquivo, setStatusArquivo] = useState("");
  const [statusArquivoCor, setStatusArquivoCor] = useState("");

  // Estados para controlar as seções abertas do accordion
  const [secaoAberta, setSecaoAberta] = useState({
    informacoesBasicas: true,
    tipoLayout: false,
    conteudoEstilo: false,
    configuracoesLink: false,
  });

  // Refs para os inputs de cor
  const corTituloRef = useRef(null);
  const corSubtituloRef = useRef(null);
  const corTextoCTARef = useRef(null);
  const corFundoCTARef = useRef(null);
  const corBordaCTARef = useRef(null);
  const corInicioRef = useRef(null);
  const corFimRef = useRef(null);
  const corBtnFecharRef = useRef(null);

  // Efeito para atualizar os inputs de cor quando os valores mudam
  useEffect(() => {
    if (corTituloRef.current) corTituloRef.current.value = corTitulo;
    if (corSubtituloRef.current) corSubtituloRef.current.value = corSubtitulo;
    if (corTextoCTARef.current) corTextoCTARef.current.value = corTextoCTA;
    if (corFundoCTARef.current) corFundoCTARef.current.value = corFundoCTA;
    if (corBordaCTARef.current) corBordaCTARef.current.value = corBordaCTA;
    if (corInicioRef.current) corInicioRef.current.value = corInicio;
    if (corFimRef.current) corFimRef.current.value = corFim;
    if (corBtnFecharRef.current) corBtnFecharRef.current.value = corBtnFechar;
  }, [
    corTitulo,
    corSubtitulo,
    corTextoCTA,
    corFundoCTA,
    corBordaCTA,
    corInicio,
    corFim,
    corBtnFechar,
  ]);

  // Função para alternar seção do accordion
  const toggleSecao = (secao) => {
    setSecaoAberta((prev) => {
      const novoEstado = { ...prev };

      // Fechamos todas as seções primeiro
      Object.keys(novoEstado).forEach((key) => {
        novoEstado[key] = false;
      });

      // Abrimos apenas a selecionada, a menos que já estivesse aberta
      novoEstado[secao] = !prev[secao];

      return novoEstado;
    });
  };

  // Função para lidar com o upload de imagem
  const handleImagemChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagem(file);
      setStatusArquivo(`Arquivo selecionado: ${file.name}`);
      setStatusArquivoCor("green");

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagemPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagem(null);
      setImagemPreview("");
      setStatusArquivo("Nenhum arquivo selecionado");
      setStatusArquivoCor("red");
    }
  };

  // Definir qual preview de layout mostrar
  const getPopupPreview = () => {
    // Variáveis para tamanho de fonte baseado nos valores selecionados
    const fontSizeTitle =
      tamanhoTitulo === "65"
        ? "20pt"
        : tamanhoTitulo === "50"
          ? "18pt"
          : "15pt";
    const fontSizeSubtitle =
      tamanhoSubtitulo === "32"
        ? "15pt"
        : tamanhoSubtitulo === "28"
          ? "14pt"
          : "13pt";

    switch (tipoLayout) {
      case "333": // Imagem superior
        return (
          <div
            className={styles.popupPreview}
            style={{
              backgroundImage: `linear-gradient(45deg, ${corInicio}, ${corFim})`,
            }}
          >
            <div className={styles.btnFechar} style={{ color: corBtnFechar }}>
              {textoBtnFechar}
            </div>
            <div
              className={styles.popupImageTop}
              style={{
                backgroundImage: imagemPreview
                  ? `url(${imagemPreview})`
                  : "none",
              }}
            ></div>
            <div className={styles.popupContent}>
              <div
                className={styles.popupTitle}
                style={{ color: corTitulo, fontSize: fontSizeTitle }}
              >
                {titulo}
              </div>
              <div
                className={styles.popupSubtitle}
                style={{ color: corSubtitulo, fontSize: fontSizeSubtitle }}
              >
                {subtitulo}
              </div>
            </div>
            <div
              className={styles.popupCTA}
              style={{
                color: corTextoCTA,
                backgroundColor: corFundoCTA,
                border: `2px solid ${corBordaCTA}`,
              }}
            >
              {textoCTA}
            </div>
          </div>
        );

      case "334": // Imagem inferior
        return (
          <div
            className={styles.popupPreview}
            style={{
              backgroundImage: `linear-gradient(45deg, ${corInicio}, ${corFim})`,
            }}
          >
            <div className={styles.btnFechar} style={{ color: corBtnFechar }}>
              {textoBtnFechar}
            </div>
            <div className={styles.popupContent}>
              <div
                className={styles.popupTitle}
                style={{ color: corTitulo, fontSize: fontSizeTitle }}
              >
                {titulo}
              </div>
              <div
                className={styles.popupSubtitle}
                style={{ color: corSubtitulo, fontSize: fontSizeSubtitle }}
              >
                {subtitulo}
              </div>
            </div>
            <div
              className={styles.popupImageMiddle}
              style={{
                backgroundImage: imagemPreview
                  ? `url(${imagemPreview})`
                  : "none",
              }}
            ></div>
            <div
              className={styles.popupCTA}
              style={{
                color: corTextoCTA,
                backgroundColor: corFundoCTA,
                border: `2px solid ${corBordaCTA}`,
              }}
            >
              {textoCTA}
            </div>
          </div>
        );

      case "335": // Imagem livre
        return (
          <div className={styles.popupPreviewFull}>
            <div
              className={styles.popupImageFull}
              style={{
                backgroundImage: imagemPreview
                  ? `url(${imagemPreview})`
                  : "none",
              }}
            ></div>
          </div>
        );

      default:
        return null;
    }
  };

  // Função para limpar o formulário
  const handleReset = () => {
    setNumeroAcao("");
    setImagem(null);
    setImagemPreview("");
    setTipoLayout("333");
    setTitulo("Escreva um título");
    setCorTitulo("#ffffff");
    setTamanhoTitulo("65");
    setSubtitulo("Escreva um subtítulo");
    setCorSubtitulo("#ffffff");
    setTamanhoSubtitulo("22");
    setTextoCTA("Escreva a CTA");
    setCorTextoCTA("#000000");
    setCorFundoCTA("#ffffff");
    setCorBordaCTA("#FFFFFF");
    setCorInicio("#9EEBFF");
    setCorFim("#000596");
    setTextoBtnFechar("Fechar");
    setCorBtnFechar("#ffffff");
    setTipoLink("3");
    setLink("");
    setCodigo("");
    setCodigoManual("");
    setID("");
    setIDManual("");
    setStatusArquivo("Formulário limpo");
    setStatusArquivoCor("blue");
  };

  // Gerar o script
  const gerarScript = () => {
    // Validações básicas
    if (!imagem) {
      alert("É necessário selecionar uma imagem.");
      return;
    }

    if (!numeroAcao) {
      alert("É necessário informar o número de ação.");
      return;
    }

    // Preparar valores para o script
    let idCATFinal = ID;
    let codigoFinal = codigo;
    let metodo = "";
    let linkValue = "";

    if (tipoLink === "1") {
      // Sem redirecionamento
      codigoFinal = "";
      idCATFinal = "0";
      metodo = "";
    } else if (tipoLink === "2") {
      // Link
      idCATFinal = "0";
      metodo = "Link";
      linkValue = link || "";

      if (!link) {
        alert("É necessário informar um link de redirecionamento.");
        setStatusArquivo("Erro ao gerar script: falta link");
        setStatusArquivoCor("red");
        return;
      }
    } else if (tipoLink === "3") {
      // Push deep link
      codigoFinal = "";
      metodo = "PshDpLink";

      if (!idCATFinal) {
        alert("É necessário informar um ID de redirecionamento.");
        setStatusArquivo("Erro ao gerar script: falta ID");
        setStatusArquivoCor("red");
        return;
      }
    }

    if (idCATFinal === "manual") {
      idCATFinal = IDManual;
    }

    if (codigoFinal === "manual") {
      codigoFinal = codigoManual;
    }

    // Definir tamanhos para o modelo JSON
    let setTamanhoTitulo = "1";
    if (tamanhoTitulo === "50") setTamanhoTitulo = "2";
    else if (tamanhoTitulo === "65") setTamanhoTitulo = "3";

    let setTamanhoSubtitulo = "1";
    if (tamanhoSubtitulo === "28") setTamanhoSubtitulo = "2";
    else if (tamanhoSubtitulo === "32") setTamanhoSubtitulo = "3";

    setStatusArquivo("Gerando script...");
    setStatusArquivoCor("blue");

    const reader = new FileReader();
    reader.onload = function (e) {
      const imageBase64 = e.target.result.split(",")[1]; // Remover o prefixo data:image/xyz;base64,

      // Buscar o modelo JSON
      fetch("/modelopopup.json")
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Erro ao carregar modelopopup.json: ${response.status}`,
            );
          }
          return response.json();
        })
        .then((modeloJson) => {
          // Substituir os valores no template
          let script = modeloJson.script
            .replace("${ImagemEmBase64}", imageBase64)
            .replace(/\${numeroAcao}/g, numeroAcao)
            .replace(/\${titulo}/g, titulo)
            .replace(/\${corInicio}/g, corInicio)
            .replace(/\${corFim}/g, corFim)
            .replace(/\${corTitulo}/g, corTitulo)
            .replace(/\${subtitulo}/g, subtitulo)
            .replace(/\${corSubtitulo}/g, corSubtitulo)
            .replace(/\${textoCTA}/g, textoCTA)
            .replace(/\${link}/g, linkValue)
            .replace(/\${codigo}/g, codigoFinal)
            .replace(/\${corTextoCTA}/g, corTextoCTA)
            .replace(/\${corFundoCTA}/g, corFundoCTA)
            .replace(/\${corBordaCTA}/g, corBordaCTA)
            .replace(/\${tipoLayout}/g, tipoLayout)
            .replace("${idCAT}", idCATFinal)
            .replace("${metodo}", metodo)
            .replace("${tamanhotitulo}", setTamanhoTitulo)
            .replace("${tamanhosubtitulo}", setTamanhoSubtitulo)
            .replace("${textoBotaoFechar}", textoBtnFechar)
            .replace("${corBotaoFechar}", corBtnFechar);

          // Criar e baixar o arquivo
          const blob = new Blob([script], { type: "text/plain" });
          const downloadLink = document.createElement("a");
          downloadLink.href = window.URL.createObjectURL(blob);
          downloadLink.download = `script_popup_${numeroAcao}.txt`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);

          setStatusArquivo(`Script gerado com sucesso! Download iniciado.`);
          setStatusArquivoCor("green");
        })
        .catch((error) => {
          console.error("Erro:", error);
          setStatusArquivo(`Erro ao gerar script: ${error.message}`);
          setStatusArquivoCor("red");
        });
    };

    reader.readAsDataURL(imagem);
  };

  return (
    <div className={styles.contentContainer}>
      {/* Formulário */}
      <div className={styles.formSection}>
        <form className={styles.formCard}>
          {/* Seção 1: Informações Básicas */}
          <div className={styles.accordionItem}>
            <button
              type="button"
              className={`${styles.accordionHeader} ${secaoAberta.informacoesBasicas ? styles.active : ""}`}
              onClick={() => toggleSecao("informacoesBasicas")}
            >
              <h3 className={styles.accordionTitle}>Informações Básicas</h3>
              <ChevronDown
                className={`${styles.accordionIcon} ${secaoAberta.informacoesBasicas ? styles.rotated : ""}`}
              />
            </button>

            {secaoAberta.informacoesBasicas && (
              <div className={styles.accordionContent}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="numeroAcao" className={styles.formLabel}>
                      Número de Ação
                    </label>
                    <input
                      type="number"
                      id="numeroAcao"
                      className={styles.formInput}
                      placeholder="0000"
                      value={numeroAcao}
                      onChange={(e) => setNumeroAcao(e.target.value)}
                      required
                    />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="imagem" className={styles.formLabel}>
                      Imagem
                    </label>
                    <div className={styles.fileUploadContainer}>
                      <label
                        htmlFor="imagem"
                        className={styles.fileUploadButton}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className={styles.uploadIcon}
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          fill="none"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        Selecionar imagem
                      </label>
                      <input
                        type="file"
                        id="imagem"
                        name="imagem"
                        accept=".png, .jpeg, .jpg"
                        className={styles.fileInput}
                        onChange={handleImagemChange}
                      />
                    </div>
                    <span
                      className={styles.statusArquivo}
                      style={{ color: statusArquivoCor }}
                    >
                      {statusArquivo}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Seção 2: Tipo de Layout */}
          <div className={styles.accordionItem}>
            <button
              type="button"
              className={`${styles.accordionHeader} ${secaoAberta.tipoLayout ? styles.active : ""}`}
              onClick={() => toggleSecao("tipoLayout")}
            >
              <h3 className={styles.accordionTitle}>Tipo de Layout</h3>
              <ChevronDown
                className={`${styles.accordionIcon} ${secaoAberta.tipoLayout ? styles.rotated : ""}`}
              />
            </button>

            {secaoAberta.tipoLayout && (
              <div className={styles.accordionContent}>
                <select
                  id="tipoLayout"
                  className={styles.formSelect}
                  value={tipoLayout}
                  onChange={(e) => setTipoLayout(e.target.value)}
                >
                  <option value="333">
                    POPUP COM IMAGEM SUPERIOR - TÍTULO, SUBTÍTULO, TEXTO CTA
                    (BOTÃO)
                  </option>
                  <option value="334">
                    POPUP COM IMAGEM INFERIOR - TÍTULO, SUBTÍTULO, TEXTO CTA
                    (BOTÃO)
                  </option>
                  <option value="335">
                    POPUP COM IMAGEM LIVRE (TEXTOS JÁ FIXOS NA IMAGEM)
                  </option>
                </select>
              </div>
            )}
          </div>

          {/* Seção 3: Conteúdo e Estilo */}
          <div
            className={styles.accordionItem}
            style={{ display: tipoLayout === "335" ? "none" : "block" }}
          >
            <button
              type="button"
              className={`${styles.accordionHeader} ${secaoAberta.conteudoEstilo ? styles.active : ""}`}
              onClick={() => toggleSecao("conteudoEstilo")}
            >
              <h3 className={styles.accordionTitle}>Conteúdo e Estilo</h3>
              <ChevronDown
                className={`${styles.accordionIcon} ${secaoAberta.conteudoEstilo ? styles.rotated : ""}`}
              />
            </button>

            {secaoAberta.conteudoEstilo && (
              <div className={styles.accordionContent}>
                {/* Título */}
                <div className={styles.contentSection}>
                  <h4 className={styles.contentSectionTitle}>Título</h4>
                  <div className={styles.formGrid3}>
                    <div className={styles.col2}>
                      <label htmlFor="titulo" className={styles.formLabel}>
                        Texto do Título
                      </label>
                      <input
                        type="text"
                        id="titulo"
                        className={styles.formInput}
                        placeholder="Escreva um título"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="tamanhoT" className={styles.formLabel}>
                        Tamanho
                      </label>
                      <select
                        id="tamanhoT"
                        className={styles.formSelect}
                        value={tamanhoTitulo}
                        onChange={(e) => setTamanhoTitulo(e.target.value)}
                      >
                        <option value="65">Grande</option>
                        <option value="50">Médio</option>
                        <option value="40">Pequeno</option>
                      </select>
                    </div>
                  </div>
                  <div className={styles.colorPickerContainer}>
                    <label htmlFor="corTitulo" className={styles.formLabel}>
                      Cor do Título
                    </label>
                    <div className={styles.colorInputWrapper}>
                      <input
                        type="color"
                        id="corTituloColor"
                        value={corTitulo}
                        onChange={(e) => setCorTitulo(e.target.value)}
                        className={styles.colorPicker}
                        ref={corTituloRef}
                      />
                      <input
                        type="text"
                        id="corTitulo"
                        className={styles.colorInput}
                        placeholder="#ffffff"
                        value={corTitulo}
                        onChange={(e) => setCorTitulo(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Subtítulo */}
                <div className={styles.contentSection}>
                  <h4 className={styles.contentSectionTitle}>Subtítulo</h4>
                  <div className={styles.formGrid3}>
                    <div className={styles.col2}>
                      <label htmlFor="subtitulo" className={styles.formLabel}>
                        Texto do Subtítulo
                      </label>
                      <input
                        type="text"
                        id="subtitulo"
                        className={styles.formInput}
                        placeholder="Escreva um subtítulo"
                        value={subtitulo}
                        onChange={(e) => setSubtitulo(e.target.value)}
                      />
                    </div>
                    <div>
                      <label htmlFor="tamanhoS" className={styles.formLabel}>
                        Tamanho
                      </label>
                      <select
                        id="tamanhoS"
                        className={styles.formSelect}
                        value={tamanhoSubtitulo}
                        onChange={(e) => setTamanhoSubtitulo(e.target.value)}
                      >
                        <option value="22">Pequeno</option>
                        <option value="28">Médio</option>
                        <option value="32">Grande</option>
                      </select>
                    </div>
                  </div>
                  <div className={styles.colorPickerContainer}>
                    <label htmlFor="corSubtitulo" className={styles.formLabel}>
                      Cor do Subtítulo
                    </label>
                    <div className={styles.colorInputWrapper}>
                      <input
                        type="color"
                        id="corSubtituloColor"
                        value={corSubtitulo}
                        onChange={(e) => setCorSubtitulo(e.target.value)}
                        className={styles.colorPicker}
                        ref={corSubtituloRef}
                      />
                      <input
                        type="text"
                        id="corSubtitulo"
                        className={styles.colorInput}
                        placeholder="#ffffff"
                        value={corSubtitulo}
                        onChange={(e) => setCorSubtitulo(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Botão CTA */}
                <div className={styles.contentSection}>
                  <h4 className={styles.contentSectionTitle}>
                    Botão de Ação (CTA)
                  </h4>
                  <div className={styles.formGroup}>
                    <label htmlFor="textoCTA" className={styles.formLabel}>
                      Texto do Botão
                    </label>
                    <input
                      type="text"
                      id="textoCTA"
                      className={styles.formInput}
                      placeholder="Escreva a CTA"
                      value={textoCTA}
                      onChange={(e) => setTextoCTA(e.target.value)}
                    />
                  </div>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="corTextoCTA" className={styles.formLabel}>
                        Cor do Texto
                      </label>
                      <div className={styles.colorInputWrapper}>
                        <input
                          type="color"
                          id="corTextoCTAColor"
                          value={corTextoCTA}
                          onChange={(e) => setCorTextoCTA(e.target.value)}
                          className={styles.colorPicker}
                          ref={corTextoCTARef}
                        />
                        <input
                          type="text"
                          id="corTextoCTA"
                          className={styles.colorInput}
                          placeholder="#000000"
                          value={corTextoCTA}
                          onChange={(e) => setCorTextoCTA(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="corFundoCTA" className={styles.formLabel}>
                        Cor de Fundo
                      </label>
                      <div className={styles.colorInputWrapper}>
                        <input
                          type="color"
                          id="corFundoCTAColor"
                          value={corFundoCTA}
                          onChange={(e) => setCorFundoCTA(e.target.value)}
                          className={styles.colorPicker}
                          ref={corFundoCTARef}
                        />
                        <input
                          type="text"
                          id="corFundoCTA"
                          className={styles.colorInput}
                          placeholder="#ffffff"
                          value={corFundoCTA}
                          onChange={(e) => setCorFundoCTA(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="corBordaCTA" className={styles.formLabel}>
                      Cor da Borda
                    </label>
                    <div className={styles.colorInputWrapper}>
                      <input
                        type="color"
                        id="corBordaCTAColor"
                        value={corBordaCTA}
                        onChange={(e) => setCorBordaCTA(e.target.value)}
                        className={styles.colorPicker}
                        ref={corBordaCTARef}
                      />
                      <input
                        type="text"
                        id="corBordaCTA"
                        className={styles.colorInput}
                        placeholder="#FFFFFF"
                        value={corBordaCTA}
                        onChange={(e) => setCorBordaCTA(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Cores de Fundo */}
                <div className={styles.contentSection}>
                  <h4 className={styles.contentSectionTitle}>Cores de Fundo</h4>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="corInicio" className={styles.formLabel}>
                        Cor de Início (Gradiente)
                      </label>
                      <div className={styles.colorInputWrapper}>
                        <input
                          type="color"
                          id="corInicioColor"
                          value={corInicio}
                          onChange={(e) => setCorInicio(e.target.value)}
                          className={styles.colorPicker}
                          ref={corInicioRef}
                        />
                        <input
                          type="text"
                          id="corInicio"
                          className={styles.colorInput}
                          placeholder="#9EEBFF"
                          value={corInicio}
                          onChange={(e) => setCorInicio(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="corFim" className={styles.formLabel}>
                        Cor de Fim (Gradiente)
                      </label>
                      <div className={styles.colorInputWrapper}>
                        <input
                          type="color"
                          id="corFimColor"
                          value={corFim}
                          onChange={(e) => setCorFim(e.target.value)}
                          className={styles.colorPicker}
                          ref={corFimRef}
                        />
                        <input
                          type="text"
                          id="corFim"
                          className={styles.colorInput}
                          placeholder="#000596"
                          value={corFim}
                          onChange={(e) => setCorFim(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Botão Fechar */}
                <div className={styles.contentSection}>
                  <h4 className={styles.contentSectionTitle}>Botão Fechar</h4>
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label
                        htmlFor="textoBtnFechar"
                        className={styles.formLabel}
                      >
                        Texto do Botão
                      </label>
                      <input
                        type="text"
                        id="textoBtnFechar"
                        className={styles.formInput}
                        placeholder="Fechar"
                        value={textoBtnFechar}
                        onChange={(e) => setTextoBtnFechar(e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label
                        htmlFor="corBtnFechar"
                        className={styles.formLabel}
                      >
                        Cor do Texto
                      </label>
                      <div className={styles.colorInputWrapper}>
                        <input
                          type="color"
                          id="corBtnFecharColor"
                          value={corBtnFechar}
                          onChange={(e) => setCorBtnFechar(e.target.value)}
                          className={styles.colorPicker}
                          ref={corBtnFecharRef}
                        />
                        <input
                          type="text"
                          id="corBtnFechar"
                          className={styles.colorInput}
                          placeholder="#ffffff"
                          value={corBtnFechar}
                          onChange={(e) => setCorBtnFechar(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Seção 4: Configurações de Link */}
          <div className={styles.accordionItem}>
            <button
              type="button"
              className={`${styles.accordionHeader} ${secaoAberta.configuracoesLink ? styles.active : ""}`}
              onClick={() => toggleSecao("configuracoesLink")}
            >
              <h3 className={styles.accordionTitle}>
                Configurações de Redirecionamento
              </h3>
              <ChevronDown
                className={`${styles.accordionIcon} ${secaoAberta.configuracoesLink ? styles.rotated : ""}`}
              />
            </button>

            {secaoAberta.configuracoesLink && (
              <div className={styles.accordionContent}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="tipoLink" className={styles.formLabel}>
                      Tipo de Link
                    </label>
                    <select
                      id="tipoLink"
                      className={styles.formSelect}
                      value={tipoLink}
                      onChange={(e) => setTipoLink(e.target.value)}
                    >
                      <option value="3">Push Deep Link</option>
                      <option value="1">Sem redirecionamento</option>
                      <option value="2">Link</option>
                    </select>
                  </div>
                  <div className={styles.formGroup}>
                    {tipoLink === "2" && (
                      <div className={styles.linkContainer}>
                        <label htmlFor="link" className={styles.formLabel}>
                          URL
                        </label>
                        <input
                          type="text"
                          id="link"
                          className={styles.formInput}
                          placeholder="https://www.exemplo.com.br"
                          value={link}
                          onChange={(e) => setLink(e.target.value)}
                        />

                        <label htmlFor="codigo" className={styles.formLabel}>
                          Código
                        </label>
                        <select
                          id="codigo"
                          className={styles.formSelect}
                          value={codigo}
                          onChange={(e) => setCodigo(e.target.value)}
                        >
                          <option value="">Selecione um código</option>
                          <option value="manual">
                            Inserir código manualmente
                          </option>
                          <option value="001">001 - Código exemplo 1</option>
                          <option value="002">002 - Código exemplo 2</option>
                        </select>
                        {codigo === "manual" && (
                          <div className={styles.manualInputContainer}>
                            <input
                              type="text"
                              id="manualCodigoInput"
                              placeholder="Digite o código manualmente"
                              className={styles.formInput}
                              value={codigoManual}
                              onChange={(e) => setCodigoManual(e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    )}

                    {tipoLink === "3" && (
                      <div className={styles.linkContainer}>
                        <label htmlFor="ID" className={styles.formLabel}>
                          Redirecionamento
                        </label>
                        <select
                          id="ID"
                          className={styles.formSelect}
                          value={ID}
                          onChange={(e) => setID(e.target.value)}
                        >
                          <option value="">Selecione</option>
                          <option value="manual">Inserir ID manualmente</option>
                          <option value="14">
                            14 - Pagamento PIX Copia e Cola
                          </option>
                          <option value="15">
                            15 - Histórico de Transações
                          </option>
                          <option value="16">16 - Transferências</option>
                        </select>
                        {ID === "manual" && (
                          <div className={styles.manualInputContainer}>
                            <input
                              type="text"
                              id="manualIDInput"
                              placeholder="Digite o ID manualmente"
                              className={styles.formInput}
                              value={IDManual}
                              onChange={(e) => setIDManual(e.target.value)}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Botão de Ação */}
          <div className={styles.actionButtonContainer}>
            <button
              type="reset"
              className={styles.btnReset}
              onClick={handleReset}
            >
              Limpar
            </button>
            <button
              type="button"
              id="btnGerarScript"
              className={styles.btnGerarScript}
              onClick={gerarScript}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles.downloadIcon}
                viewBox="0 0 24 24"
                stroke="currentColor"
                fill="none"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                />
              </svg>
              Baixar Script
            </button>
          </div>
        </form>
      </div>

      {/* Preview */}
      <div className={styles.previewSection}>
        <p className={styles.previewStatus} style={{ color: statusArquivoCor }}>
          {statusArquivo}
        </p>

        {/* Mockup do telefone */}
        <div className={styles.phoneMockup}>
          <div className={styles.phoneNotch}></div>
          <div className={styles.phoneScreen}>
            {/* Container do Popup (tela cheia) */}
            <div className={styles.popupContainer}>{getPopupPreview()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PopupCreator;
