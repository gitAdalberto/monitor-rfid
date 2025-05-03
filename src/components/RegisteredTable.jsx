import styles from "@/styles/RegisteredTable.module.css"
export default function RegisteredTable({ registros }) {
    return(
        <div className={styles.container}>
            {registros && registros.length>0 ?
            (
                <table className={styles.table}>
                <thead>
                <tr>
                    {/*<th>ID</th>*/}
                    <th>UID</th>
                    <th>Nombre</th>
                    <th>Tipo</th>
                    <th>Fecha</th>
                    
                </tr>
                </thead>
                <tbody>
                {registros.map((registro) => (
                    <tr key={registro.id}>
                    {/*<td>{registro.id}</td>*/}
                    <td>{registro.uid}</td>
                    <td>{registro.usuarios.nombre}</td>
                    <td>{registro.tipo}</td>
                    <td>{new Date(registro.fecha).toLocaleString()}</td>                    
                    </tr>
                ))}
                </tbody>
            </table>
            ) : (
                <h1 className={styles.advice}>Nada por aqui :(</h1>
            )
            }
        </div>
    )
}