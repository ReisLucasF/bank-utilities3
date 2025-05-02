import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "/context/ThemeContext";
import { PlusCircle, FileText, X, Check } from "lucide-react";
import styles from "/styles/LiberacaoDispositivos.module.css";

const LiberacaoDispositivos = () => {
  const { isDarkMode } = useTheme();
  const [scripts, setScripts] = useState([]);
  const [modeloScript, setModeloScript] = useState("");
  const [gerando, setGerando] = useState(false);
  const scriptCounter = useRef(0);

  // Carregar o modelo de script
  useEffect(() => {
    const carregarModelo = async () => {
      try {
        const response = await fetch("/modeloLib.json");
        if (!response.ok) throw new Error("Falha ao carregar modelo");
        const data = await response.json();
        setModeloScript(data.script);
      } catch (error) {
        console.error("Erro ao carregar modelo:", error);
        alert(
          "Não foi possível carregar o modelo de script. Verifique se o arquivo modeloLib.json está disponível.",
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
      tipoAcesso: "AMBOS", // Valor padrão
      idMachine: "",
      agencia: "",
      conta: "",
      titular: "TITULAR1", // Valor padrão
      nomeSolicitante: "",
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

    let scriptGerar = [];
    let isValid = true;
    let scriptsAtualizados = [...scripts];

    scripts.forEach((script, index) => {
      // Verificar campos obrigatórios
      const camposObrigatorios = [
        "numeroDemanda",
        "idMachine",
        "agencia",
        "conta",
        "nomeSolicitante",
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
        // Processa o ID Machine
        const idMachinePrimeiros8 = script.idMachine.slice(0, 8);
        const idMachineResto = script.idMachine.slice(8);

        // Lógica adicional para gerar scripts diferentes com base no tipo de acesso
        if (script.tipoAcesso === "AMBOS") {
          // Script para Primeiro Acesso - usa um template personalizado
          const scriptPrimeiroAcesso = `--Demanda: ${script.numeroDemanda}

--Primeiro Acesso

INSERT INTO
CTRL_EXC_FACEMATCH
(IDT_MQN,IDT_ECO_NET,NUM_DND,NUM_CTA,NOM_USU_IBK,DTA_HOR_CAD,DTA_HOR_VCT,COD_OPC,COD_SUB_OPC,NUM_DMD,DES_CTL_ECC_FCM)
VALUES
('${idMachinePrimeiros8}','${idMachineResto}','${script.agencia}','${script.conta}','${script.titular}',GETDATE(),DATEADD(HOUR,+72,GETDATE()),561,0,${script.numeroDemanda},'Solicitado por ${script.nomeSolicitante}')

--Liberação de Dispositivo

INSERT INTO
CTRL_EXC_FACEMATCH
(IDT_MQN,IDT_ECO_NET,NUM_DND,NUM_CTA,NOM_USU_IBK,DTA_HOR_CAD,DTA_HOR_VCT,COD_OPC,COD_SUB_OPC,NUM_DMD,DES_CTL_ECC_FCM)
VALUES
('${idMachinePrimeiros8}','${idMachineResto}','${script.agencia}',${script.conta},'${script.titular}',GETDATE(),DATEADD(HOUR,+72,GETDATE()),589,0,'${script.numeroDemanda}','Solicitado por ${script.nomeSolicitante}')

----------------------------------------------------------------------------`;

          scriptGerar.push(scriptPrimeiroAcesso);
        } else {
          // Determinar o tipo de liberação
          let tipoLiberacao = "";
          if (script.tipoAcesso === "589") {
            tipoLiberacao = "Primeiro Acesso";
          } else if (script.tipoAcesso === "561") {
            tipoLiberacao = "Liberação de Dispositivo";
          }

          // Script personalizado para liberação única
          const scriptUnico = `--Demanda: ${script.numeroDemanda}
--${tipoLiberacao}
INSERT INTO
CTRL_EXC_FACEMATCH
(IDT_MQN,IDT_ECO_NET,NUM_DND,NUM_CTA,NOM_USU_IBK,DTA_HOR_CAD,DTA_HOR_VCT,COD_OPC,COD_SUB_OPC,NUM_DMD,DES_CTL_ECC_FCM)
VALUES
('${idMachinePrimeiros8}','${idMachineResto}','${script.agencia}','${script.conta}','${script.titular}',GETDATE(),DATEADD(HOUR,+72,GETDATE()),${script.tipoAcesso},0,${script.numeroDemanda},'Solicitado por ${script.nomeSolicitante}')

----------------------------------------------------------------------------`;

          scriptGerar.push(scriptUnico);
        }
      }
    });

    setScripts(scriptsAtualizados);

    if (!isValid) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (scriptGerar.length === 0) {
      alert("Adicione pelo menos um script para gerar.");
      return;
    }

    // Cria e baixa o arquivo de script
    const blob = new Blob([scriptGerar.join("\n\n")], {
      type: "text/plain;charset=utf-8",
    });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `scripts_liberacao_${new Date().toISOString().slice(0, 10)}.txt`;
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
          <h1 className={styles.pageTitle}>Liberação de Dispositivos</h1>
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
                  {/* Primeira linha: 3 colunas */}
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
                        <option value="AMBOS">
                          Ambos (Liberação + Primeiro Acesso)
                        </option>
                        <option value="561">Liberação</option>
                        <option value="589">Primeiro Acesso</option>
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
                        ID Machine
                      </label>
                      <input
                        type="text"
                        value={script.idMachine}
                        onChange={(e) =>
                          atualizarScript(
                            script.id,
                            "idMachine",
                            e.target.value,
                          )
                        }
                        className={`
                        ${styles.textInput} 
                        ${isDarkMode ? styles.textInputDark : styles.textInputLight}
                        ${
                          script.error.idMachine
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

                  {/* Segunda linha: 2 colunas */}
                  <div className={styles.formRowTwo}>
                    <div className={styles.formGroup}>
                      <label
                        className={`${styles.inputLabel} ${
                          isDarkMode
                            ? styles.inputLabelDark
                            : styles.inputLabelLight
                        }`}
                      >
                        Agência
                      </label>
                      <input
                        type="number"
                        value={script.agencia}
                        onChange={(e) =>
                          atualizarScript(script.id, "agencia", e.target.value)
                        }
                        className={`
                        ${styles.textInput} 
                        ${isDarkMode ? styles.textInputDark : styles.textInputLight}
                        ${
                          script.error.agencia
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
                        Conta
                      </label>
                      <input
                        type="number"
                        value={script.conta}
                        onChange={(e) =>
                          atualizarScript(script.id, "conta", e.target.value)
                        }
                        className={`
                        ${styles.textInput} 
                        ${isDarkMode ? styles.textInputDark : styles.textInputLight}
                        ${
                          script.error.conta
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

                  {/* Terceira linha: 2 colunas */}
                  <div className={styles.formRowTwo}>
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
                        value={script.titular}
                        onChange={(e) =>
                          atualizarScript(script.id, "titular", e.target.value)
                        }
                        className={`
                        ${styles.selectInput} 
                        ${isDarkMode ? styles.selectInputDark : styles.selectInputLight}
                        ${
                          script.error.titular
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
                        <option value="TITULAR1">Primeiro Titular</option>
                        <option value="TITULAR2">Segundo Titular</option>
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

export default LiberacaoDispositivos;
