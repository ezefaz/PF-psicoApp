import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector, useDispatch } from 'react-redux';
import { getPsychologyID, postDateTime, getCalendarioPsicologoRuta, getDiasPsicologos, minMaxTime, añadirDia, eliminarDia } from '../../slice/psico/thunks.js';
import Loading from '../Loading/Loading.jsx';
import './calendar.css'

export const Calendar = ({idPsycho}) => {
    const psychologistDays = useSelector(state => state.psicology.psychoCalendar);
    const idPsico = useSelector(state => state.auth.authBack.id)
    const [startDate, setStartDate] = useState(psychologistDays.formatoDias ? psychologistDays.formatoDias[0] : new Date());
    const [startTime, setStartTime] = useState(new Date().setHours(8,0));
    const [excludes, setExcludes] = useState([]);
    const dispatch = useDispatch();

    console.log(psychologistDays)
    useEffect( () => {
        if (psychologistDays.dia) {
            console.log("hola")
            setExcludes(getTimeExcludes(startDate));
        }else{
            dispatch(getCalendarioPsicologoRuta(idPsico))
        }
        // dispatch(getPsychologyID(idPsycho));
        dispatch(postDateTime(postDates()))
    },[startDate, startTime]);

        const getMonth = (month) => {
            switch(month){
            case "Jan":
                return 1
            case "Feb":
                return 2
            case "Mar":
                return 3
            case "Apr":
                return 4
            case "May":
                return 5
            case "Jun":
                return 6
            case "Jul":
                return 7
            case "Aug":
                return 8
            case "Sep":
                return 9
            case "Oct":
                return 10
            case "Nov":
                return 11
            default:
                return 12                       
            }
        }
    
        const getTimeExcludes = (startDate) => {
            const dayPsico = psychologistDays?.dia.filter(d => {
                let dia = d.fecha.split("-");
                return new Date(dia[0],dia[1]-1,dia[2]).toString().slice(0,10) === new Date(startDate).toString().slice(0,10)
            });


            const horarios = dayPsico[0]?.horarios.map(h => {
                let d = new Date();
                let [hora, minutes] = h.hora.split(":");
                d.setHours(parseInt(hora),parseInt(minutes));
                return d;
            });

            return horarios;
        }
    
        // const enviarDatosAlBack = () => {
        //     let dateTime = postDates();
        //     dispatch(postDateTime());
        // }
        
        const send = (e) => {
            switch(e.target.value){
                case "añadirDia":
                    dispatch(añadirDia(idPsico, postDates().date))
                    setStartDate(psychologistDays.formatoDias[0])
                    //dispatch(getCalendarioPsicologoRuta(idPsico))
                    break
                case "borrarDia":
                    dispatch(eliminarDia(idPsico, postDates().date))
                    setStartDate(psychologistDays.formatoDias[0])
                    //dispatch(getCalendarioPsicologoRuta(idPsico))
                    break
                case "añadirHorario":
                    console.log(e.target.value)
                    break
                default:
                    console.log(e.target.value)
            }
        }

        const postDates = () => {
            let date = startDate.toString().split(" ");
            let mes = getMonth(date[1]) <= 10 ? ("0" + getMonth(date[1])) : getMonth([date[1]]);
            date = date[3] + "-" + mes + "-" + date[2];

            let time = startTime.toString().split(" ");
            time = time[4];

            return {date, time};
        }
        console.log(postDates().date)
        let handleColor = (excludes) => {
            return "text-error";
          };
        return (
            <> 
                <h1 className='font-bold text-white mt-2.5'>CALENDARIO</h1>
                {
                    psychologistDays.formatoDias
                    ? <div className='flex flex-col'>
                    <div className='mt-2.5 mb-5'>
                        <label className='text-white'>Selecciona una fecha</label>
                        <p>Los días marcados en verde son los disponibles para los pacientes.</p>
                        <DatePicker
                        selected={startDate}
                        onChange={(date) => {
                            setStartDate(date);
                            dispatch(postDateTime(postDates()));
                        }}
                        //includeDates={psychologistDays.formatoDias}
                        showWeekNumbers
                        minDate={new Date()}
                        monthsShown={1}
                        dateFormat="yyyy/MM/dd"
                        highlightDates={psychologistDays.formatoDias}
                        />
                    </div>
                    <div className='mb-5'>
                        <label className='text-white'>Selecciona una Hora</label>
                        <DatePicker
                        selected={startTime}
                        excludeTimes={excludes}
                        onChange={(date) => setStartTime(date)}
                        showTimeSelect
                        showTimeSelectOnly
                        timeIntervals={psychologistDays.intervaloSesion}
                        timeCaption="Time"
                        dateFormat="hh:mm aa"
                        minTime={psychologistDays.formatoHorarios.min}
                        maxTime={psychologistDays.formatoHorarios.max}
                        timeClassName={handleColor}
                        />

                    </div>
                    <button value="borrarDia" onClick={(e) => send(e)}>Eliminar Día disponible</button>
                    <button value="añadirDia" onClick={(e) => send(e)}>Agregar Día disponible</button>
                    <button value="borrarHorario" onClick={(e) => send(e)}>Eliminar Horario disponible</button>
                    <button value="añadirHorario" onClick={(e) => send(e)}>Agregar Horario disponible</button>
                </div> : <div>
                    <Loading/>
                </div>
                    }
                
            </>
        );
}
