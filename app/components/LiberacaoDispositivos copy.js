import React, { useState, useEffect, useRef } from "react";
import { useTheme } from "/context/ThemeContext";
import { PlusCircle, X, Check, Copy, Download, Eye } from "lucide-react";
import styles from "/styles/LiberacaoDispositivos.module.css";

const LiberacaoDispositivos = () => {
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
        const response = await fetch("/modeloLib.json");
        if (!response.ok) throw new Error("Falha ao carregar modelo");
        const data = await response.json();
        setModeloScript(data.script);
        setModeloDesativacao(data.desativacao);
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
      cpfCliente: "",
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

  // Visualizar os scripts
  const visualizarScripts = () => {
    if (!modeloScript) {
      alert("Modelo de script não foi carregado. Tente recarregar a página.");
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
        camposObrigatorios = ["numeroDemanda", "cpfCliente", "nomeSolicitante"];
      } else {
        // Para outros tipos, campos completos
        camposObrigatorios = [
          "numeroDemanda",
          "idMachine",
          "agencia",
          "conta",
          "nomeSolicitante",
        ];

        // Se for EXCLUSAO_LIBERACAO_PRIMEIRO_ACESSO, CPF também é obrigatório
        if (script.tipoAcesso === "EXCLUSAO_LIBERACAO_PRIMEIRO_ACESSO") {
          camposObrigatorios.push("cpfCliente");
        }
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
        // Lógica adicional para gerar scripts diferentes com base no tipo de acesso
        if (script.tipoAcesso === "AMBOS") {
          // Processa o ID Machine para tipos que precisam
          const idMachinePrimeiros8 = script.idMachine.slice(0, 8);
          const idMachineResto = script.idMachine.slice(8);

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
        } else if (script.tipoAcesso === "EXCLUSAO_LIBERACAO_PRIMEIRO_ACESSO") {
          if (!modeloDesativacao) {
            alert(
              "Modelo de desativação não foi carregado. Tente recarregar a página.",
            );
            return;
          }

          // Processa o ID Machine
          const idMachinePrimeiros8 = script.idMachine.slice(0, 8);
          const idMachineResto = script.idMachine.slice(8);

          // Primeiro: Script de desativação usando o template do modeloLib.json
          const scriptDesativacao = modeloDesativacao
            .replace(/\${numero_da_demanda}/g, script.numeroDemanda)
            .replace(/\${numero_do_id_machine}/g, script.idMachine)
            .replace(/\${cpf_cliente}/g, script.cpfCliente)
            .replace(/\${id_solicitante}/g, script.nomeSolicitante);

          // Segundo: Script de liberação + primeiro acesso
          const scriptLiberacaoPrimeiroAcesso = `--Demanda: ${script.numeroDemanda}

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

          // Adiciona primeiro o script de desativação, depois o de liberação
          scriptGerar.push(scriptDesativacao);
          scriptGerar.push(scriptLiberacaoPrimeiroAcesso);
        } else if (script.tipoAcesso === "EXCLUSAO") {
          // Script de exclusão apenas - template simplificado
          const scriptExclusao = `--Demanda: ${script.numeroDemanda}

--Desativação de Dispositivo

DELETE FROM CTRL_EXC_FACEMATCH 
WHERE NUM_CPF_CNPJ = '${script.cpfCliente}'

--Registro da desativação solicitada por ${script.nomeSolicitante}

----------------------------------------------------------------------------`;

          scriptGerar.push(scriptExclusao);
        } else {
          // Processa o ID Machine para tipos que precisam
          const idMachinePrimeiros8 = script.idMachine.slice(0, 8);
          const idMachineResto = script.idMachine.slice(8);

          // Determinar o tipo de liberação
          let tipoLiberacao = "";
          if (script.tipoAcesso === "589") {
            tipoLiberacao = "Liberação de Dispositivo";
          } else if (script.tipoAcesso === "561") {
            tipoLiberacao = "Primeiro Acesso";
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
    link.download = `scripts_liberacao_${new Date().toISOString().slice(0, 10)}.txt`;
    link.click();
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
            onClick={visualizarScripts}
            className={styles.successButton}
          >
            <Eye className={styles.buttonIcon} size={20} />
            Visualizar Script
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
                  {script.tipoAcesso === "EXCLUSAO" ? (
                    // Layout simplificado para Exclusão Apenas
                    <>
                      {/* Primeira linha: Demanda e Tipo */}
                      <div className={styles.formRowTwo}>
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
                            <option value="EXCLUSAO_LIBERACAO_PRIMEIRO_ACESSO">
                              Exclusão + Liberação + Primeiro Acesso
                            </option>
                            <option value="EXCLUSAO">Exclusão Apenas</option>
                            <option value="561">Primeiro Acesso</option>
                            <option value="589">
                              Liberação de Dispositivo
                            </option>
                          </select>
                        </div>
                      </div>

                      {/* Segunda linha: CPF e Usuário Solicitante */}
                      <div className={styles.formRowTwo}>
                        <div className={styles.formGroup}>
                          <label
                            className={`${styles.inputLabel} ${
                              isDarkMode
                                ? styles.inputLabelDark
                                : styles.inputLabelLight
                            }`}
                          >
                            CPF do Cliente
                          </label>
                          <input
                            type="text"
                            value={script.cpfCliente}
                            onChange={(e) =>
                              atualizarScript(
                                script.id,
                                "cpfCliente",
                                e.target.value,
                              )
                            }
                            className={`
                            ${styles.textInput} 
                            ${isDarkMode ? styles.textInputDark : styles.textInputLight}
                            ${
                              script.error.cpfCliente
                                ? `${styles.inputError} ${
                                    isDarkMode
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
                    </>
                  ) : (
                    // Layout completo para outros tipos
                    <>
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
                            <option value="EXCLUSAO_LIBERACAO_PRIMEIRO_ACESSO">
                              Exclusão + Liberação + Primeiro Acesso
                            </option>
                            <option value="EXCLUSAO">Exclusão Apenas</option>
                            <option value="561">Primeiro Acesso</option>
                            <option value="589">
                              Liberação de Dispositivo
                            </option>
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
                              atualizarScript(
                                script.id,
                                "agencia",
                                e.target.value,
                              )
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
                              atualizarScript(
                                script.id,
                                "conta",
                                e.target.value,
                              )
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
                            Tipo de Titular
                          </label>
                          <select
                            value={script.titular}
                            onChange={(e) =>
                              atualizarScript(
                                script.id,
                                "titular",
                                e.target.value,
                              )
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

                      {/* Campo CPF - aparece para EXCLUSAO_LIBERACAO_PRIMEIRO_ACESSO */}
                      {script.tipoAcesso ===
                        "EXCLUSAO_LIBERACAO_PRIMEIRO_ACESSO" && (
                        <div className={styles.formRowTwo}>
                          <div className={styles.formGroup}>
                            <label
                              className={`${styles.inputLabel} ${
                                isDarkMode
                                  ? styles.inputLabelDark
                                  : styles.inputLabelLight
                              }`}
                            >
                              CPF do Cliente
                            </label>
                            <input
                              type="text"
                              value={script.cpfCliente}
                              onChange={(e) =>
                                atualizarScript(
                                  script.id,
                                  "cpfCliente",
                                  e.target.value,
                                )
                              }
                              className={`
                              ${styles.textInput} 
                              ${isDarkMode ? styles.textInputDark : styles.textInputLight}
                              ${
                                script.error.cpfCliente
                                  ? `${styles.inputError} ${
                                      isDarkMode
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
                      )}
                    </>
                  )}
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
                className={`${styles.removeButton} ${
                  isDarkMode
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

export default LiberacaoDispositivos;
