import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import styles from "@/styles/Home.module.css";
import RegisteredTable from "@/components/RegisteredTable";
import Register from "@/components/Register";
import Calendar from "@/components/Calendar";
import 'react-datepicker/dist/react-datepicker.css';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export default function Registros() {
  const [registros, setRegistros] = useState([]);
  const [unregistered, setUnregistered] = useState([]);

  const addUser = async (uid, nombre, correo) => {
    const { data, error } = await supabase.from('usuarios').insert([
      {
        uid:uid,
        nombre:nombre,
        correo:correo
      }
    ]);

    if (error) {
      console.error("Error al insertar:", error);
    } else {
      //console.log("Usuario insertado exitosamente:", data);
      await deleteUnregisteredByUid(uid);
    }
  }

  const deleteUnregisteredByUid = async (uid) => {
    const { data, error } = await supabase
    .from("unregistered")
    .delete()
    .eq("uid",uid);

    if (error) {
      console.error("error al borrar unregistered:",error);
    } else {
      //console.log("delete exitoso",data);
    }
  }

  

  const fetchRegistros = async (date) => {
    const { data, error } = await supabase
      .from("registros")
      .select('id,uid,tipo,fecha,usuarios(nombre)')
      .order("fecha", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Error al obtener registros:", error);
    } else {
      //console.log(data);
      setRegistros(data);
    }
  };

  const fetchRegistrosBydate = async (date) => {
    const initialDate = `${date} 00:00:00`;
    const endDate = `${date} 23:59:59`;
    const { data, error } = await supabase
      .from("registros")
      .select('id,uid,tipo,fecha,usuarios(nombre)')
      .gte("fecha", initialDate)
      .lte("fecha", endDate)
      .order("fecha", { ascending: false });

    if (error) {
      console.error("Error al obtener registros por fecha", error);
    } else {
      setRegistros(data); 
  }
};

  const fetchUnregistered = async () => {
    const { data, error } = await supabase
      .from("unregistered")
      .select("*")
      .order("date", { ascending: false })
      .limit(100);

    if (error) {
      console.error("Error al obtener unregistered:", error);
    } else {
      setUnregistered(data);
    }
  };

  useEffect(() => {
    fetchRegistros();
    fetchUnregistered();
    
    const channelRegistros = supabase
      .channel('realtime:registros')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'registros',
        },
        async (payload) => {
          //console.log('Nuevo registro:', payload.new);
          await fetchRegistros();
        }
      )
      .subscribe();

    const channelUnregistered = supabase
      .channel('realtime:unregistered')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'unregistered',
        },
        (payload) => {
          //console.log('Nuevo registro en unregistered:', payload.new);
          setUnregistered((prev) => [payload.new, ...prev]); 
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channelRegistros);
      supabase.removeChannel(channelUnregistered);
    };
  }, []);

  return (
    <div className={styles.container}>
      
        {unregistered && unregistered.length>0 && (
          <div className={styles.content}>
            <Register unregistered={unregistered[0]} addUser={addUser} setUnregistered={setUnregistered}></Register>
          </div>
        )}
      
      <div className={styles.content}>
      <Calendar
        onDateChange={(date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          const formatted = `${year}-${month}-${day}`; 
          fetchRegistrosBydate(formatted);
        }}
        fetchRegistros={fetchRegistros}
      />

      <RegisteredTable registros={registros}></RegisteredTable>
      </div>
    </div>
  );
}
