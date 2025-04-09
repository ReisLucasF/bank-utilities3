import React, { useState, useEffect, useRef } from "react";
import styles from "/styles/CardCreator.module.css";
import { ChevronDown } from "lucide-react";

const CardCreator = () => {
  // Estados para gerenciar os valores do formulário
  const [numeroAcao, setNumeroAcao] = useState("");
  const [imagem, setImagem] = useState(null);
  const [imagemPreview, setImagemPreview] = useState("");
  const [tipoLayout, setTipoLayout] = useState("319");
  const [titulo, setTitulo] = useState("Escreva um título");
  const [corTitulo, setCorTitulo] = useState("#000000");
  const [subtitulo, setSubtitulo] = useState("Escreva um subtítulo");
  const [corSubtitulo, setCorSubtitulo] = useState("#000000");
  const [textoCTA, setTextoCTA] = useState("Escreva a CTA");
  const [corTextoCTA, setCorTextoCTA] = useState("#FFFFFF");
  const [corFundoCTA, setCorFundoCTA] = useState("#000000");
  const [corBordaCTA, setCorBordaCTA] = useState("#FFFFFF");
  const [corInicio, setCorInicio] = useState("#9EEBFF");
  const [corFim, setCorFim] = useState("#000596");
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
    conteudoCores: false,
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

  // Efeito para atualizar os inputs de cor quando os valores mudam
  useEffect(() => {
    if (corTituloRef.current) corTituloRef.current.value = corTitulo;
    if (corSubtituloRef.current) corSubtituloRef.current.value = corSubtitulo;
    if (corTextoCTARef.current) corTextoCTARef.current.value = corTextoCTA;
    if (corFundoCTARef.current) corFundoCTARef.current.value = corFundoCTA;
    if (corBordaCTARef.current) corBordaCTARef.current.value = corBordaCTA;
    if (corInicioRef.current) corInicioRef.current.value = corInicio;
    if (corFimRef.current) corFimRef.current.value = corFim;
  }, [
    corTitulo,
    corSubtitulo,
    corTextoCTA,
    corFundoCTA,
    corBordaCTA,
    corInicio,
    corFim,
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

  // Função para validar formato hexadecimal de cores
  const validarFormatoHex = (cor) => {
    if (!cor || cor === "") return true; // Permitir vazio
    if (!cor.startsWith("#") || cor.length !== 7) return false;
    const hexRegex = /^#[0-9A-Fa-f]{6}$/;
    return hexRegex.test(cor);
  };

  // Função para verificar o comprimento da cor e seu formato
  const verificarComprimentoCor = (cor, nomeCampo) => {
    if (cor.length === 0) return true;
    if (!validarFormatoHex(cor)) {
      alert(
        `A cor do campo ${nomeCampo} deve ser um valor hexadecimal válido (ex: #FF0000). Por favor, corrija!`,
      );
      return false;
    }
    return true;
  };

  // Função para verificar contraste entre cores
  const verificarContrasteCores = (corFundo, corTexto, tipoTexto) => {
    if (!corFundo || !corTexto) return true;
    if (corFundo.toLowerCase() === corTexto.toLowerCase()) {
      alert(
        `A cor de fundo e a cor do ${tipoTexto} não podem ser iguais, pois o texto ficará invisível.`,
      );
      return false;
    }
    return true;
  };

  // Função para obter nome amigável dos campos
  const obterNomeAmigavel = (idCampo) => {
    const mapeamento = {
      corTitulo: "cor do título",
      corSubtitulo: "cor do subtítulo",
      corTextoCTA: "cor do texto da CTA",
      corInicio: "cor de início",
      corFim: "cor de fim",
      corFundoCTA: "cor de fundo da CTA",
      corBordaCTA: "cor da borda da CTA",
    };
    return mapeamento[idCampo] || idCampo;
  };

  // Função para remover caracteres indesejados do texto
  const removerCaracteresIndesejados = (texto) => {
    if (!texto) return "";
    texto = texto.replace(/R\$(?=[\[\]'"`]\S)/g, "");
    return texto.replace(/[\[\]'"`]/g, "");
  };

  // Gerar o script
  const gerarScript = (e) => {
    e.preventDefault();

    // Validações básicas
    if (!imagem) {
      alert("É necessário selecionar uma imagem.");
      return;
    }

    if (!numeroAcao) {
      alert("É necessário informar o número de ação.");
      return;
    }

    // Limita a quantidade de caracteres
    if (titulo.length > 25) {
      alert(`O título não pode ultrapassar 25 caracteres!`);
      return;
    } else if (subtitulo.length > 90) {
      alert(`O subtítulo não pode ultrapassar 90 caracteres!`);
      return;
    }

    // Validações de formato hexadecimal para cores
    const cores = [
      { valor: corTitulo, nome: "corTitulo" },
      { valor: corSubtitulo, nome: "corSubtitulo" },
      { valor: corTextoCTA, nome: "corTextoCTA" },
      { valor: corInicio, nome: "corInicio" },
      { valor: corFim, nome: "corFim" },
      { valor: corFundoCTA, nome: "corFundoCTA" },
      { valor: corBordaCTA, nome: "corBordaCTA" },
    ];

    for (const cor of cores) {
      if (!verificarComprimentoCor(cor.valor, obterNomeAmigavel(cor.nome))) {
        return;
      }
    }

    // Validar contraste entre cores
    if (!verificarContrasteCores(corInicio, corTitulo, "título")) return;
    if (!verificarContrasteCores(corFim, corTitulo, "título")) return;
    if (!verificarContrasteCores(corInicio, corSubtitulo, "subtítulo")) return;
    if (!verificarContrasteCores(corFim, corSubtitulo, "subtítulo")) return;
    if (!verificarContrasteCores(corFundoCTA, corTextoCTA, "texto CTA")) return;

    // Verificar campos que não podem conter espaço
    const camposComEspaco = {
      corBordaCTA: "Cor da borda da CTA",
      corFundoCTA: "Cor de fundo da CTA",
      corFim: "Cor de fim do fundo",
      corInicio: "Cor de início do fundo",
      corTextoCTA: "Cor do texto da CTA",
      corSubtitulo: "Cor do subtítulo",
      corTitulo: "Cor do título",
    };

    for (const campoId in camposComEspaco) {
      const valorCampo = eval(campoId).trim();
      if (valorCampo && valorCampo.includes(" ")) {
        alert(
          `O campo ${camposComEspaco[campoId]} não pode conter espaços em branco.`,
        );
        return;
      }
    }

    let tituloFinal = titulo;
    let subtituloFinal = subtitulo;
    let textoCTAFinal = textoCTA;
    let corTituloFinal = corTitulo;
    let corSubtituloFinal = corSubtitulo;
    let corTextoCTAFinal = corTextoCTA;
    let corFundoCTAFinal = corFundoCTA;
    let corBordaCTAFinal = corBordaCTA;

    switch (tipoLayout) {
      case "320":
      case "323":
        subtituloFinal = "";
        corSubtituloFinal = "";
        break;
      case "321":
      case "324":
        tituloFinal = "";
        corTituloFinal = "";
        break;
      case "271":
      case "275":
        textoCTAFinal = "";
        corTextoCTAFinal = "";
        corFundoCTAFinal = "";
        corBordaCTAFinal = "";
        break;
    }

    setStatusArquivo("Gerando script...");
    setStatusArquivoCor("blue");

    const reader = new FileReader();
    reader.onload = function (e) {
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

      const tituloLimpo = removerCaracteresIndesejados(tituloFinal);
      const subtituloLimpo = removerCaracteresIndesejados(subtituloFinal);

      fetch("/modelo.json")
        .then((response) => response.json())
        .then((modeloJson) => {
          const imageBase64 = reader.result.split(",")[1]; 

          let script = modeloJson.script
            .replace("${ImagemEmBase64}", imageBase64)
            .replace("${numeroAcao}", numeroAcao)
            .replace(/\${tipoLayout}/g, tipoLayout)
            .replace("${titulo}", tituloLimpo)
            .replace("${subtitulo}", subtituloLimpo)
            .replace("${textoCTA}", textoCTAFinal)
            .replace("${corTitulo}", corTituloFinal)
            .replace("${corSubtitulo}", corSubtituloFinal)
            .replace("${corTextoCTA}", corTextoCTAFinal)
            .replace("${corFundoCTA}", corFundoCTAFinal)
            .replace("${corBordaCTA}", corBordaCTAFinal)
            .replace("${corInicio}", corInicio)
            .replace("${corFim}", corFim)
            .replace("${metodo}", metodo)
            .replace("${link}", linkValue)
            .replace("${codigo}", codigoFinal)
            .replace("${idCAT}", idCATFinal);

          const blob = new Blob([script], { type: "text/plain" });
          const downloadLink = document.createElement("a");
          downloadLink.href = window.URL.createObjectURL(blob);
          downloadLink.download = `script_card_${numeroAcao}.txt`;
          document.body.appendChild(downloadLink);
          downloadLink.click();
          document.body.removeChild(downloadLink);

          setStatusArquivo(`Script gerado com sucesso! Download iniciado.`);
          setStatusArquivoCor("green");
        })
        .catch((error) => {
          console.error("Erro ao carregar o modelo:", error);
          setStatusArquivo(`Erro ao gerar script: ${error.message}`);
          setStatusArquivoCor("red");
        });
    };

    // Ler a imagem como base64
    reader.readAsDataURL(imagem);
  };

  // Determinar qual preview mostrar com base no layout
  const isLayoutDireita = ["322", "323", "324", "275"].includes(tipoLayout);

  // Determinar a visibilidade dos elementos com base no layout
  const mostrarTitulo = !["321", "324"].includes(tipoLayout);
  const mostrarSubtitulo = !["320", "323"].includes(tipoLayout);
  const mostrarCTA = !["271", "275"].includes(tipoLayout);

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
                <label htmlFor="tipoLayout" className={styles.formLabel}>
                  Tipo de Layout
                </label>
                <select
                  id="tipoLayout"
                  className={styles.formSelect}
                  value={tipoLayout}
                  onChange={(e) => setTipoLayout(e.target.value)}
                >
                  <option value="319">
                    Cartão com imagem à esquerda - título, subtítulo e CTA à
                    direita
                  </option>
                  <option value="320">
                    Cartão com imagem à esquerda - título e CTA à direita (sem
                    subtítulo)
                  </option>
                  <option value="321">
                    Cartão com imagem à esquerda - subtítulo e CTA à direita
                    (sem título)
                  </option>
                  <option value="271">
                    Cartão com imagem à esquerda - título e subtítulo à direita
                    (sem CTA)
                  </option>
                  <option value="322">
                    Cartão com imagem à direita - título, subtítulo e CTA à
                    esquerda
                  </option>
                  <option value="323">
                    Cartão com imagem à direita - título e CTA à esquerda (sem
                    subtítulo)
                  </option>
                  <option value="324">
                    Cartão com imagem à direita - subtítulo e CTA à esquerda
                    (sem título)
                  </option>
                  <option value="275">
                    Cartão com imagem à direita - título e subtítulo à esquerda
                    (sem CTA)
                  </option>
                </select>
              </div>
            )}
          </div>

          {/* Seção 3: Conteúdo e Cores */}
          <div className={styles.accordionItem}>
            <button
              type="button"
              className={`${styles.accordionHeader} ${secaoAberta.conteudoCores ? styles.active : ""}`}
              onClick={() => toggleSecao("conteudoCores")}
            >
              <h3 className={styles.accordionTitle}>Conteúdo e Cores</h3>
              <ChevronDown
                className={`${styles.accordionIcon} ${secaoAberta.conteudoCores ? styles.rotated : ""}`}
              />
            </button>

            {secaoAberta.conteudoCores && (
              <div className={styles.accordionContent}>
                {/* Título e Cor do Título */}
                {mostrarTitulo && (
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="titulo" className={styles.formLabel}>
                        Título
                      </label>
                      <input
                        type="text"
                        id="titulo"
                        className={styles.formInput}
                        placeholder="Escreva um título"
                        maxLength="25"
                        value={titulo}
                        onChange={(e) => setTitulo(e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="corTitulo" className={styles.formLabel}>
                        Cor do Título
                      </label>
                      <div className={styles.colorInputContainer}>
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
                          className={styles.formInput}
                          placeholder="#000000"
                          pattern="^\S+$"
                          value={corTitulo}
                          onChange={(e) => setCorTitulo(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Subtítulo e Cor do Subtítulo */}
                {mostrarSubtitulo && (
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="subtitulo" className={styles.formLabel}>
                        Subtítulo
                      </label>
                      <input
                        type="text"
                        id="subtitulo"
                        className={styles.formInput}
                        placeholder="Escreva um subtítulo"
                        maxLength="90"
                        value={subtitulo}
                        onChange={(e) => setSubtitulo(e.target.value)}
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label
                        htmlFor="corSubtitulo"
                        className={styles.formLabel}
                      >
                        Cor do Subtítulo
                      </label>
                      <div className={styles.colorInputContainer}>
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
                          className={styles.formInput}
                          placeholder="#000000"
                          pattern="^\S+$"
                          value={corSubtitulo}
                          onChange={(e) => setCorSubtitulo(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Texto CTA e Cor do Texto CTA */}
                {mostrarCTA && (
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="textoCTA" className={styles.formLabel}>
                        Texto CTA
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
                    <div className={styles.formGroup}>
                      <label htmlFor="corTextoCTA" className={styles.formLabel}>
                        Cor do Texto CTA
                      </label>
                      <div className={styles.colorInputContainer}>
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
                          className={styles.formInput}
                          placeholder="#FFFFFF"
                          pattern="^\S+$"
                          value={corTextoCTA}
                          onChange={(e) => setCorTextoCTA(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Cores de Fundo */}
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="corInicio" className={styles.formLabel}>
                      Cor de Início do Fundo
                    </label>
                    <div className={styles.colorInputContainer}>
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
                        className={styles.formInput}
                        placeholder="#9EEBFF"
                        pattern="^\S+$"
                        value={corInicio}
                        onChange={(e) => setCorInicio(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className={styles.formGroup}>
                    <label htmlFor="corFim" className={styles.formLabel}>
                      Cor de Fim do Fundo
                    </label>
                    <div className={styles.colorInputContainer}>
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
                        className={styles.formInput}
                        placeholder="#000596"
                        pattern="^\S+$"
                        value={corFim}
                        onChange={(e) => setCorFim(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Cores de CTA */}
                {mostrarCTA && (
                  <div className={styles.formGrid}>
                    <div className={styles.formGroup}>
                      <label htmlFor="corFundoCTA" className={styles.formLabel}>
                        Cor de Fundo CTA
                      </label>
                      <div className={styles.colorInputContainer}>
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
                          className={styles.formInput}
                          placeholder="#000000"
                          pattern="^\S+$"
                          value={corFundoCTA}
                          onChange={(e) => setCorFundoCTA(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="corBordaCTA" className={styles.formLabel}>
                        Cor da Borda CTA
                      </label>
                      <div className={styles.colorInputContainer}>
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
                          className={styles.formInput}
                          placeholder="#FFFFFF"
                          pattern="^\S+$"
                          value={corBordaCTA}
                          onChange={(e) => setCorBordaCTA(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}
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
              <h3 className={styles.accordionTitle}>Configurações de Link</h3>
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
                          Link
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
                          <option value="codigo1">
                            001 - Código de exemplo 1
                          </option>
                          <option value="codigo2">
                            002 - Código de exemplo 2
                          </option>
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
                          <option value="ID1">2451 - ID de exemplo 1</option>
                          <option value="ID2">3562 - ID de exemplo 2</option>
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
              type="button"
              id="btnGerarScript"
              className={styles.btnGerarScript}
              onClick={gerarScript}
            >
              Baixar Script
            </button>
          </div>
        </form>
      </div>

      {/* Preview */}
      <div className={styles.previewSection}>
        {/* Mockup do telefone */}
        <div className={styles.phoneMockup}>
          <div className={styles.phoneNotch}></div>
          <div className={styles.phoneScreen}>
            {/* App Header */}
            <div className={styles.appHeader}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={styles.backIcon}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </div>

            {/* App Content */}
            <div className={styles.appContent}>
              <h3 className={styles.appHeading}>Destaques para você</h3>

              {/* Card Preview Layout */}
              <div
                className={`${styles.cardPreview} ${isLayoutDireita ? styles.layoutDireita : styles.layoutEsquerda}`}
                style={{
                  backgroundImage: `linear-gradient(45deg, ${corInicio}, ${corFim})`,
                }}
              >
                <div
                  className={styles.cardPreviewIMG}
                  style={{
                    backgroundImage: imagemPreview
                      ? `url(${imagemPreview})`
                      : "none",
                    order: isLayoutDireita ? 2 : 1,
                  }}
                ></div>
                <div
                  className={styles.cardPreviewContent}
                  style={{ order: isLayoutDireita ? 1 : 2 }}
                >
                  {mostrarTitulo && (
                    <div
                      className={styles.tituloPreview}
                      style={{ color: corTitulo }}
                    >
                      {titulo}
                    </div>
                  )}

                  {mostrarSubtitulo && (
                    <div
                      className={styles.subtituloPreview}
                      style={{ color: corSubtitulo }}
                    >
                      {subtitulo}
                    </div>
                  )}

                  {mostrarCTA && (
                    <div
                      className={styles.textoCTAPreview}
                      style={{
                        color: corTextoCTA,
                        backgroundColor: corFundoCTA,
                        border: `2px solid ${corBordaCTA}`,
                      }}
                    >
                      {textoCTA}
                    </div>
                  )}
                </div>
              </div>

              {/* Mais conteúdo do App (para realismo) */}
              <div className={styles.appCardWhite}>
                <div className={styles.appCardHeader}>
                  <div>
                    <h4 className={styles.appCardTitle}>Saldo disponível</h4>
                    <p className={styles.appCardValue}>R$ 2.459,00</p>
                  </div>
                  <button className={styles.appCardButton}>Ver extrato</button>
                </div>
              </div>

              <div className={styles.appCardWhite}>
                <h4 className={styles.appCardTitle}>Acesso rápido</h4>
                <div className={styles.quickAccessGrid}>
                  <div className={styles.quickAccessItem}>
                    <div className={styles.quickAccessIcon}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={styles.icon}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                    <span className={styles.quickAccessText}>Pix</span>
                  </div>
                  <div className={styles.quickAccessItem}>
                    <div className={styles.quickAccessIcon}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={styles.icon}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                    <span className={styles.quickAccessText}>Cartão</span>
                  </div>
                  <div className={styles.quickAccessItem}>
                    <div className={styles.quickAccessIcon}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={styles.icon}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"
                        />
                      </svg>
                    </div>
                    <span className={styles.quickAccessText}>Transferir</span>
                  </div>
                  <div className={styles.quickAccessItem}>
                    <div className={styles.quickAccessIcon}>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={styles.icon}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                    <span className={styles.quickAccessText}>Pagar</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardCreator;
