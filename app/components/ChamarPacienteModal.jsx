// components/ChamarPacienteModal.jsx
import { useState, useEffect } from "react";
import styles from "/styles/ChamarPacienteModal.module.css";
import socketService from "/services/socketService";
import { X } from "lucide-react";

export default function ChamarPacienteModal({ isOpen, onClose, paciente }) {
  const [profissionais, setProfissionais] = useState([]);
  const [locais, setLocais] = useState([]);
  const [medicoSelecionado, setMedicoSelecionado] = useState("");
  const [localSelecionado, setLocalSelecionado] = useState("");

  // Carregar profissionais e locais
  useEffect(() => {
    // Simulação de dados - Em um ambiente real, seriam carregados da API
    const dadosProfissionais = [
      { id: 1, nome: "Dra. Maria Silva", especialidade: "Clínica Geral" },
      { id: 2, nome: "Dr. João Costa", especialidade: "Cardiologia" },
      { id: 3, nome: "Dra. Ana Santos", especialidade: "Pediatria" },
      { id: 4, nome: "Dr. Carlos Oliveira", especialidade: "Dermatologia" },
    ];

    const dadosLocais = [
      { id: 1, nome: "Consultório 1", andar: "Térreo" },
      { id: 2, nome: "Consultório 2", andar: "Térreo" },
      { id: 3, nome: "Consultório 3", andar: "1º Andar" },
      { id: 4, nome: "Sala de Exames 1", andar: "2º Andar" },
      { id: 5, nome: "Sala de Exames 2", andar: "2º Andar" },
    ];

    setProfissionais(dadosProfissionais);
    setLocais(dadosLocais);

    // Definir valores padrão
    if (dadosProfissionais.length > 0 && !medicoSelecionado) {
      setMedicoSelecionado(dadosProfissionais[0].nome);
    }

    if (dadosLocais.length > 0 && !localSelecionado) {
      setLocalSelecionado(dadosLocais[0].nome);
    }
  }, []);

  // Resetar formulário quando o modal for fechado
  useEffect(() => {
    if (!isOpen) {
      if (profissionais.length > 0) {
        setMedicoSelecionado(profissionais[0].nome);
      }

      if (locais.length > 0) {
        setLocalSelecionado(locais[0].nome);
      }
    }
  }, [isOpen]);

  // Chamar paciente
  const handleChamarPaciente = () => {
    if (!paciente || !medicoSelecionado || !localSelecionado) return;

    const dadosChamada = {
      nome: paciente.nome, // Importante: use 'nome' em vez de 'paciente'
      profissional: medicoSelecionado,
      local: localSelecionado,
      horario: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    socketService.chamarPaciente(dadosChamada);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Chamar Paciente</h2>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Fechar"
          >
            <X size={20} />
          </button>
        </div>

        <div className={styles.modalBody}>
          <div className={styles.pacienteInfo}>
            <strong>Paciente:</strong> {paciente?.nome}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="medico" className={styles.formLabel}>
              Profissional:
            </label>
            <select
              id="medico"
              className={styles.formSelect}
              value={medicoSelecionado}
              onChange={(e) => setMedicoSelecionado(e.target.value)}
            >
              {profissionais.map((profissional) => (
                <option key={profissional.id} value={profissional.nome}>
                  {profissional.nome} - {profissional.especialidade}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="local" className={styles.formLabel}>
              Local:
            </label>
            <select
              id="local"
              className={styles.formSelect}
              value={localSelecionado}
              onChange={(e) => setLocalSelecionado(e.target.value)}
            >
              {locais.map((local) => (
                <option key={local.id} value={local.nome}>
                  {local.nome} - {local.andar}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.modalFooter}>
          <button className={styles.cancelButton} onClick={onClose}>
            Cancelar
          </button>
          <button
            className={styles.chamarButton}
            onClick={handleChamarPaciente}
          >
            Chamar Paciente
          </button>
        </div>
      </div>
    </div>
  );
}
