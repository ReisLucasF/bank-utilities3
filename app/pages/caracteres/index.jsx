import { useState } from "react";
import styles from "/styles/Page.module.css";

export default function Caracteres() {
    const [xmlText, setXmlText] = useState("");
    const [result, setResult] = useState("");
    const [highlightedText, setHighlightedText] = useState("");

    const checkSpecialCharacters = () => {
        if (!xmlText.trim()) {
            setResult("Por favor, cole um XML para analisar.");
            setHighlightedText("");
            return;
        }

        // Regex para encontrar tags com caracteres especiais
        const tagRegex = /<(\w+)[^>]*>([^<]*[^\x20-\x7E][^<]*|[^<]*&#\d+;[^<]*)<\/\1>/g;
        const specialCharRegex = /[^\x20-\x7E]|&#\d+;/g;
        
        const findings = [];
        let match;

        while ((match = tagRegex.exec(xmlText)) !== null) {
            const tagName = match[1];
            const content = match[2];
            const specialChars = content.match(specialCharRegex);
            
            if (specialChars) {
                const uniqueChars = [...new Set(specialChars)];
                findings.push(`Tag: ${tagName} - Caracteres: ${uniqueChars.join(", ")}`);
            }
        }

        // Criar texto com destaque
        let highlighted = xmlText;
        highlighted = highlighted.replace(specialCharRegex, (match) => 
            `<span style="background-color: red; color: white;">${match}</span>`
        );
        
        setHighlightedText(highlighted);

        if (findings.length > 0) {
            setResult(findings.join("\n"));
        } else {
            setResult("Nenhum caracter especial encontrado em tags.");
        }
    };

    return (
        <div className={styles.pageContainer}>
            <div className={styles.pageHeader}>
                <h1 className={styles.pageTitle}>Verificar Caracteres</h1>
            </div>
            
            <div className={styles.pageContent}>
                {highlightedText ? (
                    <div
                        dangerouslySetInnerHTML={{ __html: highlightedText }}
                        style={{
                            width: "100%",
                            minHeight: "200px",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            fontFamily: "monospace",
                            backgroundColor: "white",
                            whiteSpace: "pre-wrap",
                            wordBreak: "break-all"
                        }}
                    />
                ) : (
                    <textarea
                        value={xmlText}
                        onChange={(e) => setXmlText(e.target.value)}
                        placeholder="Cole o XML aqui..."
                        rows={10}
                        cols={80}
                        style={{
                            width: "100%",
                            padding: "10px",
                            border: "1px solid #ccc",
                            borderRadius: "4px",
                            fontFamily: "monospace"
                        }}
                    />
                )}
                
                <button
                    onClick={checkSpecialCharacters}
                    style={{
                        marginTop: "10px",
                        padding: "10px 20px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        cursor: "pointer"
                    }}
                >
                    Verificar Caracteres
                </button>

                {highlightedText && (
                    <button
                        onClick={() => {
                            setHighlightedText("");
                            setResult("");
                        }}
                        style={{
                            marginTop: "10px",
                            marginLeft: "10px",
                            padding: "10px 20px",
                            backgroundColor: "#6c757d",
                            color: "white",
                            border: "none",
                            borderRadius: "4px",
                            cursor: "pointer"
                        }}
                    >
                        Limpar Destaque
                    </button>
                )}

                {result && (
                    <div style={{
                        marginTop: "20px",
                        padding: "10px",
                        backgroundColor: "#f8f9fa",
                        border: "1px solid #dee2e6",
                        borderRadius: "4px",
                        whiteSpace: "pre-line"
                    }}>
                        {result}
                    </div>
                )}
            </div>
        </div>
    );
}
