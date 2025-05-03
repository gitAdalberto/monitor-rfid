import { useState } from "react";
import DatePicker from "react-datepicker";
import styles from '@/styles/Calendar.module.css'

export default function Calendar({ onDateChange, fetchRegistros }) {
    const [selectedDate, setSelectedDate] = useState(null);

    const handleChange = (date) => {
        setSelectedDate(date);
        onDateChange?.(date);
    }

    return (
        <div className={styles.container}>
          <h2 className={styles.label}>Selecciona una fecha:</h2>
            <div className={styles.content}>
            <DatePicker
              selected={selectedDate}
              onChange={handleChange}
              dateFormat="dd/MM/yyyy"
              className={styles.calendar}
              placeholderText="Sin fecha seleccionada"
            />
            <button className={styles.button} onClick={()=>{fetchRegistros();setSelectedDate(null)}}>Limpiar</button>
            </div>
        </div>
      );
}