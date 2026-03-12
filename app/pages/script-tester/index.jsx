import React from "react";
import ScriptTester from "/components/ScriptTester";
import styles from "/styles/Page.module.css";

export default function ScriptTesterPage() {
    return (
        <div className={styles.pageContainer}>
            <ScriptTester />
        </div>
    );
}
