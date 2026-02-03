import React, { useState } from "react";
import KnowledgeBase from "/components/KnowledgeBase";
import styles from "/styles/KnowledgeBase.module.css";

export default function CardCreatorPage() {
  const [kbase, setKbase] = useState({
    ativo: true,
  });

  return (
    <div className={styles.pageContainer}>
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Base de Conhecimento</h1>
      </div>

      {kbase.ativo ? (
        <KnowledgeBase />
      ) : (
        <div className={styles.unavailableMessage}>
          <h2>Página Temporariamente Indisponível</h2>
          <p>
            Estamos trabalhando para implementar a Base de Conhecimento
            diretamente dentro do GIB (Gestão Internet Banking).
          </p>
        </div>
      )}
    </div>
  );
}

// import React from "react";
// import styles from "/styles/KnowledgeBase.module.css";

// export default function CardCreatorPage() {
//   return (
//     <div className={styles.pageContainer}>
//       <div className={styles.pageHeader}>
//         <h1 className={styles.pageTitle}>Base de Conhecimento</h1>
//       </div>
//       <div className={styles.unavailableMessage}>
//         <h2>Página Temporariamente Indisponível</h2>
//         <p>
//           Estamos trabalhando para implementar a Base de Conhecimento
//           diretamente dentro do GIB (Gestão Internet Banking).
//         </p>
//       </div>
//     </div>
//   );
// }
