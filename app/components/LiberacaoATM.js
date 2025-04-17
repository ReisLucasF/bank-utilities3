import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "/context/ThemeContext";
import { PlusCircle, FileText, X, Check } from "lucide-react";
import styles from "/styles/LiberacaoDispositivos.module.css";

const LiberacaoATM = () => {
  const { isDarkMode } = useTheme();
  const [scripts, setScripts] = useState([]);
  const [modeloScript, setModeloScript] = useState("");
  const [gerando, setGerando] = useState(false);
  const scriptCounter = useRef(0);

  // Carregar o modelo de script
  useEffect(() => {
    const carregarModelo = async () => {
      try {
        const response = await fetch("/modeloATM.json");
        if (!response.ok) throw new Error("Falha ao carregar modelo");
        const data = await response.json();
        setModeloScript(data.script);
      } catch (error) {
        console.error("Erro ao carregar modelo:", error);
        alert(
          "Não foi possível carregar o modelo de script. Verifique se o arquivo modeloATM.json está disponível.",
        );
      }
    };

    carregarModelo();
  }, []);

  // Adicionar um novo script
  const adicionarScript = () => {
    scriptCounter.current++;
    const novoScript = {
      id: scriptCounter.current,
      numeroDemanda: "",
      tipoAcesso: "LIBERACAO DE DISPOSITIVO", // Valor padrão
      nomeSolicitante: "",
      cpf: "",
      error: {},
    };

    setScripts((prevScripts) => [...prevScripts, novoScript]);
  };

  // Remover um script
  const removerScript = (id) => {
    setScripts((prevScripts) =>
      prevScripts.filter((script) => script.id !== id),
    );
  };

  // Atualizar um campo de um script
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

  // Gerar os scripts
  const gerarScripts = () => {
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
      // Verificar campos obrigatórios
      const camposObrigatorios = [
        "numeroDemanda",
        "tipoAcesso",
        "nomeSolicitante",
        "cpf",
      ];

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
        const cpfFormatado = script.cpf.replace(/\D/g, "");

        // Gerar o script substituindo as variáveis
        let scriptTexto = modeloScript
          .replace(/\${solicitante}/g, script.nomeSolicitante)
          .replaceAll(/\${numero_da_demanda}/g, script.numeroDemanda)
          .replace(/\${cpf}/g, cpfFormatado)
          .replace(/\${tipo_acesso}/g, script.tipoAcesso);

        scriptGerar.push(scriptTexto);
      }
    });

    setScripts(scriptsAtualizados);

    if (!isValid) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    // Cria e baixa o arquivo de script
    const blob = new Blob([scriptGerar.join("\n\n")], {
      type: "text/plain;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `scripts_atm_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();

    // Feedback visual de sucesso
    setGerando(true);
    setTimeout(() => {
      setGerando(false);
    }, 2000);
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

        <div className={styles.buttonContainer}>
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
            onClick={gerarScripts}
            className={`${styles.successButton} ${gerando ? styles.buttonSuccess : ""}`}
          >
            {gerando ? (
              <>
                <Check className={styles.buttonIcon} size={20} />
                Script Gerado!
              </>
            ) : (
              <>
                <FileText className={styles.buttonIcon} size={20} />
                Gerar Script
              </>
            )}
          </button>
        </div>

        {scripts.length === 0 ? (
          <div className={styles.emptyState}>
            <p>
              Nenhum script adicionado. Clique em "Adicionar Script" para
              começar.
            </p>
          </div>
        ) : (
          <div className={styles.scriptsContainer}>
            {scripts.map((script) => (
              <div
                key={script.id}
                className={`${styles.scriptBlock} ${
                  isDarkMode ? styles.scriptBlockDark : styles.scriptBlockLight
                }`}
              >
                <button
                  type="button"
                  onClick={() => removerScript(script.id)}
                  className={`${styles.removeButton} ${
                    isDarkMode
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
                        className={`${styles.inputLabel} ${
                          isDarkMode
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
                          ${
                            script.error.numeroDemanda
                              ? `${styles.inputError} ${
                                  isDarkMode
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
                        className={`${styles.inputLabel} ${
                          isDarkMode
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
                          ${
                            script.error.tipoAcesso
                              ? `${styles.inputError} ${
                                  isDarkMode
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
                      </select>
                    </div>

                    <div className={styles.formGroup}>
                      <label
                        className={`${styles.inputLabel} ${
                          isDarkMode
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
                          ${
                            script.error.nomeSolicitante
                              ? `${styles.inputError} ${
                                  isDarkMode
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
                        className={`${styles.inputLabel} ${
                          isDarkMode
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
                        className={`
                          ${styles.textInput} 
                          ${isDarkMode ? styles.textInputDark : styles.textInputLight}
                          ${
                            script.error.cpf
                              ? `${styles.inputError} ${
                                  isDarkMode
                                    ? styles.inputErrorDark
                                    : styles.inputErrorLight
                                }`
                              : ""
                          }
                        `}
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
    </div>
  );
};

export default LiberacaoATM;
