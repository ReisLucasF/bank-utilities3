import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "/context/ThemeContext";
import { PlusCircle, X, Check, Copy, Download, Eye } from "lucide-react";
import styles from "/styles/LiberacaoDispositivos.module.css";

const LiberacaoATM = () => {
  const { isDarkMode } = useTheme();
  const [scripts, setScripts] = useState([]);
  const [modeloScript, setModeloScript] = useState("");
  const [modeloDesativacao, setModeloDesativacao] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [scriptGerado, setScriptGerado] = useState("");
  const [copied, setCopied] = useState(false);
  const scriptCounter = useRef(0);

  // Carregar o modelo de script
  useEffect(() => {
    const carregarModelo = async () => {
      try {
        const response = await fetch("/modeloATM.json");
        if (!response.ok) throw new Error("Falha ao carregar modelo");
        const data = await response.json();
        setModeloScript(data.script);
        // se houver um template de desativação no modelo, salva também
        if (data.desativacao) setModeloDesativacao(data.desativacao);
      } catch (error) {
        console.error("Erro ao carregar modelo:", error);
        alert(
          "Não foi possível carregar o modelo de script. Verifique se o arquivo modeloATM.json está disponível.",
        );
      }
    };

    carregarModelo();
  }, []);

  // Estado do formulário de novo script
  const [novoScript, setNovoScript] = useState({
    numeroDemanda: "",
    tipoAcesso: "LIBERACAO DE DISPOSITIVO",
    nomeSolicitante: "",
    cpf: "",
    error: {},
  });

  // Copiar último script para o formulário (exceto CPF)
  const copiarUltimoScript = () => {
    if (scripts.length === 0) return;
    const ultimo = scripts[0];
    setNovoScript({
      numeroDemanda: ultimo.numeroDemanda,
      tipoAcesso: ultimo.tipoAcesso,
      nomeSolicitante: ultimo.nomeSolicitante,
      cpf: "",
      error: {},
    });
  };

  // Adicionar script preenchido à lista
  const adicionarScript = () => {
    // Validação dos campos obrigatórios
    const camposObrigatorios = [
      "numeroDemanda",
      "tipoAcesso",
      "nomeSolicitante",
      "cpf",
    ];
    let errorFields = {};
    let isValid = true;
    camposObrigatorios.forEach((campo) => {
      if (!novoScript[campo]) {
        errorFields[campo] = true;
        isValid = false;
      }
    });
    if (!isValid) {
      setNovoScript((prev) => ({ ...prev, error: errorFields }));
      return;
    }
    scriptCounter.current++;
    setScripts((prevScripts) => [
      {
        id: scriptCounter.current,
        numeroDemanda: novoScript.numeroDemanda,
        tipoAcesso: novoScript.tipoAcesso,
        nomeSolicitante: novoScript.nomeSolicitante,
        cpf: novoScript.cpf,
        error: {},
      },
      ...prevScripts,
    ]);
    setNovoScript({
      numeroDemanda: "",
      tipoAcesso: "LIBERACAO DE DISPOSITIVO",
      nomeSolicitante: "",
      cpf: "",
      error: {},
    });
  };

  // Remover um script
  const removerScript = (id) => {
    setScripts((prevScripts) =>
      prevScripts.filter((script) => script.id !== id),
    );
  };

  // Atualizar um campo do formulário de novo script
  const atualizarNovoScript = (campo, valor) => {
    setNovoScript((prev) => ({
      ...prev,
      [campo]: valor,
      error: { ...prev.error, [campo]: false },
    }));
  };

  // Atualizar um campo de um script já adicionado (caso queira editar depois)
  const atualizarScript = (id, campo, valor) => {
    setScripts((prevScripts) =>
      prevScripts.map((script) =>
        script.id === id
          ? {
            ...script,
            [campo]: valor,
            error: { ...script.error, [campo]: false },
          }
          : script,
      ),
    );
  };

  // Tratar CPF com zeros à esquerda no formulário de novo script
  const tratarNovoCPF = (valor) => {
    const apenasNumeros = valor.replace(/\D/g, "");
    if (apenasNumeros.length > 0 && apenasNumeros.length < 11) {
      const cpfComZeros = apenasNumeros.padStart(11, "0");
      atualizarNovoScript("cpf", cpfComZeros);
    }
  };

  // Tratar CPF para scripts já adicionados (preenche zeros à esquerda e atualiza o script)
  const tratarCPF = (id, valor) => {
    const apenasNumeros = (valor || "").replace(/\D/g, "");
    if (apenasNumeros.length > 0 && apenasNumeros.length < 11) {
      const cpfComZeros = apenasNumeros.padStart(11, "0");
      atualizarScript(id, "cpf", cpfComZeros);
    }
  };

  // Visualizar os scripts
  const visualizarScripts = () => {
    if (!modeloScript) {
      alert("Modelo de script não foi carregado. Tente recarregar a página.");
      return;
    }

    if (scripts.length === 0) {
      alert("Adicione pelo menos um script para gerar.");
      return;
    }

    let scriptGerar = [];
    let isValid = true;
    let scriptsAtualizados = [...scripts];

    scripts.forEach((script, index) => {
      // Verificar campos obrigatórios baseado no tipo de acesso
      let camposObrigatorios = [];

      if (script.tipoAcesso === "EXCLUSAO") {
        // Para exclusão apenas, só precisa de demanda, CPF e usuário solicitante
        camposObrigatorios = ["numeroDemanda", "cpf", "nomeSolicitante"];
      } else {
        // Para outros tipos, mantém os campos principais
        camposObrigatorios = [
          "numeroDemanda",
          "tipoAcesso",
          "nomeSolicitante",
          "cpf",
        ];
      }

      let errorFields = {};
      camposObrigatorios.forEach((campo) => {
        if (!script[campo]) {
          errorFields[campo] = true;
          isValid = false;
        }
      });

      // Atualizar o estado com os erros
      if (Object.keys(errorFields).length > 0) {
        scriptsAtualizados[index] = { ...script, error: errorFields };
      }

      if (Object.keys(errorFields).length === 0) {
        // Formatar CPF (remover caracteres não numéricos)
        const cpfFormatado = (script.cpf || "").replace(/\D/g, "");

        // Lógica específica para exclusão
        if (script.tipoAcesso === "EXCLUSAO") {
          if (modeloDesativacao) {
            const scriptExclusao = modeloDesativacao
              .replace(/\${numero_da_demanda}/g, script.numeroDemanda)
              .replace(/\${cpf}/g, cpfFormatado)
              .replace(/\${solicitante}/g, script.nomeSolicitante);

            scriptGerar.push(scriptExclusao);
          } else {
            // fallback inline caso o modelo não exista
            const scriptExclusao = `--Demanda: ${script.numeroDemanda}\n\n-- Remoção da lista presencial\nUPDATE CTL_LST_PRS set IDT_STT = 0, DTA_DTV = GETDATE(), NUM_DMD_DTV = '${script.numeroDemanda}', IDT_USU_SLT_DTV = '${script.nomeSolicitante}' where NUM_DOC_CLI = '${cpfFormatado}'\n\n----------------------------------------------------------------------------`;
            scriptGerar.push(scriptExclusao);
          }
        } else {
          // Gerar o script substituindo as variáveis com o template padrão
          let scriptTexto = modeloScript
            .replace(/\${solicitante}/g, script.nomeSolicitante)
            .replaceAll(/\${numero_da_demanda}/g, script.numeroDemanda)
            .replace(/\${cpf}/g, cpfFormatado)
            .replace(/\${tipo_acesso}/g, script.tipoAcesso);

          scriptGerar.push(scriptTexto);
        }
      }
    });

    setScripts(scriptsAtualizados);

    if (!isValid) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Define o script gerado e mostra a modal
    setScriptGerado(scriptGerar.join("\n\n"));
    setShowModal(true);
  };

  // Copiar script para clipboard
  const copiarScript = async () => {
    try {
      await navigator.clipboard.writeText(scriptGerado);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Erro ao copiar:", err);
    }
  };

  // Baixar script como arquivo
  const baixarScript = () => {
    const blob = new Blob([scriptGerado], {
      type: "text/plain;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `scripts_atm_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
  };

  return (
    <div className={styles.container}>
      <div className={`${isDarkMode ? styles.mainDark : styles.mainLight}`}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>Liberação de Dispositivos (ATM)</h1>
          <p className={styles.pageSubtitle}>
            Preencha os formulários abaixo para gerar os scripts de liberação.
          </p>
        </div>

        {/* Botão copiar último script */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 8 }}>
          <button
            type="button"
            onClick={copiarUltimoScript}
            className={styles.primaryButton}
            disabled={scripts.length === 0}
            style={{ opacity: scripts.length === 0 ? 0.5 : 1 }}
          >
            Copiar último script
          </button>
        </div>

        {/* Formulário fixo para novo script */}
        <div className={styles.formContainer} style={{ marginBottom: 32, border: '1px solid #e5e7eb', borderRadius: 8 }}>
          <div className={styles.formRowThree}>
            <div className={styles.formGroup}>
              <label className={`${styles.inputLabel} ${isDarkMode ? styles.inputLabelDark : styles.inputLabelLight}`}>Número da Demanda</label>
              <input
                type="number"
                value={novoScript.numeroDemanda}
                onChange={(e) => atualizarNovoScript("numeroDemanda", e.target.value)}
                className={`
                  ${styles.textInput}
                  ${isDarkMode ? styles.textInputDark : styles.textInputLight}
                  ${novoScript.error.numeroDemanda ? `${styles.inputError} ${isDarkMode ? styles.inputErrorDark : styles.inputErrorLight}` : ""}
                `}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={`${styles.inputLabel} ${isDarkMode ? styles.inputLabelDark : styles.inputLabelLight}`}>Tipo</label>
              <select
                value={novoScript.tipoAcesso}
                onChange={(e) => atualizarNovoScript("tipoAcesso", e.target.value)}
                className={`
                  ${styles.selectInput}
                  ${isDarkMode ? styles.selectInputDark : styles.selectInputLight}
                  ${novoScript.error.tipoAcesso ? `${styles.inputError} ${isDarkMode ? styles.inputErrorDark : styles.inputErrorLight}` : ""}
                `}
                required
              >
                <option value="LIBERACAO DE DISPOSITIVO">Liberação</option>
                <option value="PRIMEIRO ACESSO">Primeiro Acesso</option>
                <option value="EXCLUSAO">Exclusão</option>
              </select>
            </div>
            <div className={styles.formGroup}>
              <label className={`${styles.inputLabel} ${isDarkMode ? styles.inputLabelDark : styles.inputLabelLight}`}>Usuário Solicitante</label>
              <input
                type="text"
                value={novoScript.nomeSolicitante}
                onChange={(e) => atualizarNovoScript("nomeSolicitante", e.target.value)}
                className={`
                  ${styles.textInput}
                  ${isDarkMode ? styles.textInputDark : styles.textInputLight}
                  ${novoScript.error.nomeSolicitante ? `${styles.inputError} ${isDarkMode ? styles.inputErrorDark : styles.inputErrorLight}` : ""}
                `}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label className={`${styles.inputLabel} ${isDarkMode ? styles.inputLabelDark : styles.inputLabelLight}`}>CPF do titular</label>
              <input
                type="text"
                value={novoScript.cpf}
                onChange={(e) => atualizarNovoScript("cpf", e.target.value)}
                onBlur={() => tratarNovoCPF(novoScript.cpf)}
                className={`
                  ${styles.textInput}
                  ${isDarkMode ? styles.textInputDark : styles.textInputLight}
                  ${novoScript.error.cpf ? `${styles.inputError} ${isDarkMode ? styles.inputErrorDark : styles.inputErrorLight}` : ""}
                `}
                placeholder="000.000.000-00"
                required
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 16, marginTop: 16 }}>
            <button
              type="button"
              onClick={adicionarScript}
              className={styles.primaryButton}
            >
              <PlusCircle className={styles.buttonIcon} size={20} />
              Adicionar Script
            </button>
            <button
              type="button"
              onClick={visualizarScripts}
              className={styles.successButton}
            >
              <Eye className={styles.buttonIcon} size={20} />
              Visualizar Script
            </button>
          </div>
        </div>

        {/* Listagem de scripts adicionados */}
        {scripts.length === 0 ? (
          <div className={styles.emptyState}>
            <p>
              Nenhum script adicionado. Preencha o formulário acima e clique em "Adicionar Script".
            </p>
          </div>
        ) : (
          <div className={styles.scriptsContainer}>
            {scripts.map((script) => (
              <div
                key={script.id}
                className={`${styles.scriptBlock} ${isDarkMode ? styles.scriptBlockDark : styles.scriptBlockLight
                  }`}
              >
                <button
                  type="button"
                  onClick={() => removerScript(script.id)}
                  className={`${styles.removeButton} ${isDarkMode
                    ? styles.removeButtonDark
                    : styles.removeButtonLight
                    }`}
                  aria-label="Remover script"
                >
                  <X size={20} />
                </button>

                <div className={styles.formContainer}>
                  {/* Uma única linha com 4 colunas para todos os campos */}
                  <div className={styles.formRowThree}>
                    <div className={styles.formGroup}>
                      <label
                        className={`${styles.inputLabel} ${isDarkMode
                          ? styles.inputLabelDark
                          : styles.inputLabelLight
                          }`}
                      >
                        Número da Demanda
                      </label>
                      <input
                        type="number"
                        value={script.numeroDemanda}
                        onChange={(e) =>
                          atualizarScript(
                            script.id,
                            "numeroDemanda",
                            e.target.value,
                          )
                        }
                        className={`
                          ${styles.textInput} 
                          ${isDarkMode ? styles.textInputDark : styles.textInputLight}
                          ${script.error.numeroDemanda
                            ? `${styles.inputError} ${isDarkMode
                              ? styles.inputErrorDark
                              : styles.inputErrorLight
                            }`
                            : ""
                          }
                        `}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label
                        className={`${styles.inputLabel} ${isDarkMode
                          ? styles.inputLabelDark
                          : styles.inputLabelLight
                          }`}
                      >
                        Tipo
                      </label>
                      <select
                        value={script.tipoAcesso}
                        onChange={(e) =>
                          atualizarScript(
                            script.id,
                            "tipoAcesso",
                            e.target.value,
                          )
                        }
                        className={`
                          ${styles.selectInput} 
                          ${isDarkMode ? styles.selectInputDark : styles.selectInputLight}
                          ${script.error.tipoAcesso
                            ? `${styles.inputError} ${isDarkMode
                              ? styles.inputErrorDark
                              : styles.inputErrorLight
                            }`
                            : ""
                          }
                        `}
                        required
                      >
                        <option value="LIBERACAO DE DISPOSITIVO">
                          Liberação
                        </option>
                        <option value="PRIMEIRO ACESSO">Primeiro Acesso</option>
                        <option value="EXCLUSAO">Exclusão</option>
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label
                        className={`${styles.inputLabel} ${isDarkMode
                          ? styles.inputLabelDark
                          : styles.inputLabelLight
                          }`}
                      >
                        Usuário Solicitante
                      </label>
                      <input
                        type="text"
                        value={script.nomeSolicitante}
                        onChange={(e) =>
                          atualizarScript(
                            script.id,
                            "nomeSolicitante",
                            e.target.value,
                          )
                        }
                        className={`
                          ${styles.textInput} 
                          ${isDarkMode ? styles.textInputDark : styles.textInputLight}
                          ${script.error.nomeSolicitante
                            ? `${styles.inputError} ${isDarkMode
                              ? styles.inputErrorDark
                              : styles.inputErrorLight
                            }`
                            : ""
                          }
                        `}
                        required
                      />
                    </div>

                    <div className={styles.formGroup}>
                      <label
                        className={`${styles.inputLabel} ${isDarkMode
                          ? styles.inputLabelDark
                          : styles.inputLabelLight
                          }`}
                      >
                        CPF do titular
                      </label>
                      <input
                        type="text"
                        value={script.cpf}
                        onChange={(e) =>
                          atualizarScript(script.id, "cpf", e.target.value)
                        }
                        onBlur={() => tratarCPF(script.id, script.cpf)}
                        className={`
                          ${styles.textInput} 
                          ${isDarkMode ? styles.textInputDark : styles.textInputLight}
                          ${script.error.cpf
                            ? `${styles.inputError} ${isDarkMode
                              ? styles.inputErrorDark
                              : styles.inputErrorLight
                            }`
                            : ""
                          }
                        `}
                        placeholder="000.000.000-00"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal para visualizar/editar o script */}
      {showModal && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "2rem",
          }}
          onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
        >
          <div
            style={{
              backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
              borderRadius: "12px",
              width: "90%",
              maxWidth: "800px",
              maxHeight: "90vh",
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              border: isDarkMode ? "1px solid #334155" : "1px solid #e5e7eb",
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: "1.5rem",
                borderBottom: isDarkMode
                  ? "1px solid #334155"
                  : "1px solid #e5e7eb",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: isDarkMode ? "#ffffff" : "#1f2937",
                  margin: 0,
                }}
              >
                Script Gerado
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className={`${styles.removeButton} ${isDarkMode
                  ? styles.removeButtonDark
                  : styles.removeButtonLight
                  }`}
              >
                <X size={24} />
              </button>
            </div>

            {/* Body */}
            <div
              style={{
                padding: "1.5rem",
                flex: 1,
                overflow: "hidden",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <textarea
                value={scriptGerado}
                onChange={(e) => setScriptGerado(e.target.value)}
                style={{
                  width: "100%",
                  minHeight: "400px",
                  padding: "1rem",
                  border: isDarkMode
                    ? "1px solid #4b5563"
                    : "1px solid #d1d5db",
                  borderRadius: "6px",
                  backgroundColor: isDarkMode ? "#111827" : "#ffffff",
                  color: isDarkMode ? "#f9fafb" : "#1f2937",
                  fontSize: "0.875rem",
                  fontFamily: 'Monaco, Consolas, "Ubuntu Mono", monospace',
                  resize: "vertical",
                  outline: "none",
                }}
                spellCheck={false}
              />
            </div>

            {/* Footer */}
            <div
              style={{
                padding: "1.5rem",
                borderTop: isDarkMode
                  ? "1px solid #334155"
                  : "1px solid #e5e7eb",
                display: "flex",
                gap: "1rem",
                justifyContent: "flex-end",
              }}
            >
              <button
                onClick={copiarScript}
                className={styles.primaryButton}
                style={{
                  backgroundColor: copied ? "#10b981" : undefined,
                }}
              >
                {copied ? (
                  <Check className={styles.buttonIcon} size={20} />
                ) : (
                  <Copy className={styles.buttonIcon} size={20} />
                )}
                {copied ? "Copiado!" : "Copiar"}
              </button>
              <button onClick={baixarScript} className={styles.successButton}>
                <Download className={styles.buttonIcon} size={20} />
                Baixar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiberacaoATM;
