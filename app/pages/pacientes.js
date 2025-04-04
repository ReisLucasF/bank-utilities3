// pages/pacientes.js
import { useState, useEffect } from "react";
import Head from "next/head";
import {
  UserPlus,
  Search,
  ArrowUp,
  ArrowDown,
  Edit,
  Bell,
  Trash2,
} from "lucide-react";
import ChamarPacienteModal from "/components/ChamarPacienteModal";
import styles from "/styles/Pacientes.module.css";

export default function Pacientes() {
  const [pacientes, setPacientes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortedField, setSortedField] = useState("nome");
  const [sortOrder, setSortOrder] = useState("asc");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPaciente, setSelectedPaciente] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar dados dos pacientes
  useEffect(() => {
    // Simulação de carregamento de dados da API
    const timeout = setTimeout(() => {
      const dadosPacientes = [
        {
          id: 1,
          nome: "João Silva",
          email: "joao@email.com",
          telefone: "(11) 98765-4321",
        },
        {
          id: 2,
          nome: "Maria Oliveira",
          email: "maria@email.com",
          telefone: "(11) 91234-5678",
        },
        {
          id: 3,
          nome: "Pedro Santos",
          email: "pedro@email.com",
          telefone: "(11) 99876-5432",
        },
        {
          id: 4,
          nome: "Ana Costa",
          email: "ana@email.com",
          telefone: "(11) 92345-6789",
        },
        {
          id: 5,
          nome: "Carlos Souza",
          email: "carlos@email.com",
          telefone: "(11) 97654-3210",
        },
        {
          id: 6,
          nome: "Juliana Lima",
          email: "juliana@email.com",
          telefone: "(11) 93456-7890",
        },
        {
          id: 7,
          nome: "Roberto Alves",
          email: "roberto@email.com",
          telefone: "(11) 96543-2109",
        },
        {
          id: 8,
          nome: "Fernanda Dias",
          email: "fernanda@email.com",
          telefone: "(11) 95432-1098",
        },
        {
          id: 9,
          nome: "Ricardo Gomes",
          email: "ricardo@email.com",
          telefone: "(11) 94321-0987",
        },
        {
          id: 10,
          nome: "Beatriz Martins",
          email: "beatriz@email.com",
          telefone: "(11) 99087-6543",
        },
      ];

      setPacientes(dadosPacientes);
      setIsLoading(false);
    }, 800); // Simular carregamento

    return () => clearTimeout(timeout);
  }, []);

  // Filtrar pacientes com base no termo de busca
  const filteredPacientes = pacientes.filter(
    (paciente) =>
      paciente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paciente.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      paciente.telefone.includes(searchTerm),
  );

  // Ordenar pacientes
  const sortedPacientes = [...filteredPacientes].sort((a, b) => {
    if (a[sortedField] < b[sortedField]) {
      return sortOrder === "asc" ? -1 : 1;
    }
    if (a[sortedField] > b[sortedField]) {
      return sortOrder === "asc" ? 1 : -1;
    }
    return 0;
  });

  // Função para ordenar
  const handleSort = (field) => {
    const order = field === sortedField && sortOrder === "asc" ? "desc" : "asc";
    setSortedField(field);
    setSortOrder(order);
  };

  // Abrir modal de chamada
  const handleOpenModal = (paciente) => {
    setSelectedPaciente(paciente);
    setIsModalOpen(true);
  };

  // Fechar modal de chamada
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPaciente(null);
  };

  // Editar paciente
  const handleEditarPaciente = (id) => {
    console.log(`Editar paciente com ID: ${id}`);
    // Implementar redirecionamento ou lógica de edição
  };

  // Excluir paciente
  const handleExcluirPaciente = (id) => {
    console.log(`Excluir paciente com ID: ${id}`);

    if (window.confirm("Tem certeza que deseja excluir este paciente?")) {
      // Simulação de exclusão
      setPacientes(pacientes.filter((paciente) => paciente.id !== id));
    }
  };

  return (
    <div className={styles.pacientesContainer}>
      <Head>
        <title>Lista de Pacientes</title>
        <meta name="description" content="Lista de pacientes cadastrados" />
      </Head>

      {/* Cabeçalho */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Pacientes</h1>

        <button
          className={styles.addButton}
          onClick={() => console.log("Adicionar paciente")}
        >
          <UserPlus size={18} />
          <span>Cadastrar Paciente</span>
        </button>
      </div>

      {/* Campo de busca */}
      <div className={styles.searchContainer}>
        <div className={styles.searchWrapper}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Pesquisar pacientes..."
            className={styles.searchInput}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Tabela de Pacientes */}
      <div className={styles.tableContainer}>
        {isLoading ? (
          <div className={styles.loadingState}>
            <div className={styles.loader}></div>
            <p>Carregando pacientes...</p>
          </div>
        ) : sortedPacientes.length > 0 ? (
          <table className={styles.pacientesTable}>
            <thead className={styles.tableHead}>
              <tr>
                <th
                  className={styles.tableHeader}
                  onClick={() => handleSort("nome")}
                >
                  <div className={styles.headerContent}>
                    <span>Nome</span>
                    {sortedField === "nome" &&
                      (sortOrder === "asc" ? (
                        <ArrowUp size={14} className={styles.sortIcon} />
                      ) : (
                        <ArrowDown size={14} className={styles.sortIcon} />
                      ))}
                  </div>
                </th>
                <th
                  className={styles.tableHeader}
                  onClick={() => handleSort("email")}
                >
                  <div className={styles.headerContent}>
                    <span>Email</span>
                    {sortedField === "email" &&
                      (sortOrder === "asc" ? (
                        <ArrowUp size={14} className={styles.sortIcon} />
                      ) : (
                        <ArrowDown size={14} className={styles.sortIcon} />
                      ))}
                  </div>
                </th>
                <th
                  className={styles.tableHeader}
                  onClick={() => handleSort("telefone")}
                >
                  <div className={styles.headerContent}>
                    <span>Telefone</span>
                    {sortedField === "telefone" &&
                      (sortOrder === "asc" ? (
                        <ArrowUp size={14} className={styles.sortIcon} />
                      ) : (
                        <ArrowDown size={14} className={styles.sortIcon} />
                      ))}
                  </div>
                </th>
                <th className={styles.tableHeader}>
                  <div className={styles.headerContent}>
                    <span>Ações</span>
                  </div>
                </th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {sortedPacientes.map((paciente) => (
                <tr key={paciente.id} className={styles.tableRow}>
                  <td className={styles.tableCell}>
                    <span className={styles.patientName}>{paciente.nome}</span>
                  </td>
                  <td className={styles.tableCell}>{paciente.email}</td>
                  <td className={styles.tableCell}>{paciente.telefone}</td>
                  <td className={styles.tableCell}>
                    <div className={styles.actionButtons}>
                      <button
                        className={`${styles.actionButton} ${styles.editButton}`}
                        onClick={() => handleEditarPaciente(paciente.id)}
                        title="Editar"
                      >
                        <Edit size={16} />
                        <span>Editar</span>
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.callButton}`}
                        onClick={() => handleOpenModal(paciente)}
                        title="Chamar"
                      >
                        <Bell size={16} />
                        <span>Chamar</span>
                      </button>
                      <button
                        className={`${styles.actionButton} ${styles.deleteButton}`}
                        onClick={() => handleExcluirPaciente(paciente.id)}
                        title="Excluir"
                      >
                        <Trash2 size={16} />
                        <span>Excluir</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className={styles.emptyState}>
            {searchTerm ? (
              <>
                <p className={styles.emptyStateTitle}>
                  Nenhum resultado encontrado
                </p>
                <p className={styles.emptyStateMessage}>
                  Não encontramos pacientes correspondentes à sua busca "
                  {searchTerm}".
                </p>
                <button
                  className={styles.clearSearchButton}
                  onClick={() => setSearchTerm("")}
                >
                  Limpar pesquisa
                </button>
              </>
            ) : (
              <>
                <p className={styles.emptyStateTitle}>
                  Nenhum paciente cadastrado
                </p>
                <p className={styles.emptyStateMessage}>
                  Clique em "Cadastrar Paciente" para adicionar seu primeiro
                  paciente.
                </p>
              </>
            )}
          </div>
        )}
      </div>

      {/* Modal de chamada de paciente */}
      <ChamarPacienteModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        paciente={selectedPaciente}
      />
    </div>
  );
}
