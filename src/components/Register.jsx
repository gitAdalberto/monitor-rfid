import styles from "@/styles/Register.module.css"
import { useState } from "react"
export default function Register({ unregistered, setUnregistered,addUser }) {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!name || !email) {
          return;
        }
    
        const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!correoValido) {
          return;
        }
    
        await addUser(unregistered.uid, name, email);
    
        setName("");
        setEmail("");
        setUnregistered([]);
      };
    
    

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Registro de nuevo usuario</h1>
            <form className={styles.form} onSubmit={handleSubmit}>
            <p className={styles.input}>UID:{unregistered?unregistered.uid:"Cargando..."}</p>
            <input
                placeholder="Nombre"
                type="text"
                value={name}
                onChange={(e)=>setName(e.target.value)}
                className={styles.input}
            />
            <input
                placeholder="Correo electronico"
                type="email"
                value={email}
                onChange={(e)=>setEmail(e.target.value)}
                className={styles.input}
            />
            <button className={styles.button} type="submit" >Registrarse</button>
        </form>
        </div>
    )
}