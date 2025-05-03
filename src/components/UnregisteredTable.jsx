export default function UnregisteredTable({unregistered}) {
    return(
        <>
            <h1>Lista de Unregistered</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>UID</th>
            <th>Fecha</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {unregistered.map((registro) => (
            <tr key={registro.id}>
              <td>{registro.id}</td>
              <td>{registro.uid}</td>
              <td>{new Date(registro.date).toLocaleString()}</td>
              <td>{registro.state}</td>
            </tr>
          ))}
        </tbody>
      </table>
        </>
    )
}