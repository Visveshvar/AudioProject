import React,{useEffect,useState} from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
const Notification=()=>{
    const {username}=useAuth()
    const [faults,setfaults]=useState([])

    useEffect(()=>{
        const fetchFaults=async()=>{
            console.log(username)
            if(username==="Visvesh"){
                try{
                    const response=await axios.get('http://localhost:5007/faults',{
                        params:{username},
                    });

                    setfaults(response.data.faults)
                }
                catch(error)
                {
                    console.error("Error fetching results:",error)
                }
            }
        };
        fetchFaults();

    },[username]);
    
    if(username!=="Visvesh")
    {
        return(
            <div>
                <h2>Notifications</h2>
                <p>Access restricted. Only "Visvesh" can view notifications.</p>
            </div>
        )
    }

    return(
        <div>
            <h2>Notifications</h2>
            <div className="fault-cards">
                {faults.length > 0 ? (
                    faults.map((fault, index) => (
                        <div key={index} className="fault-card">
                            <h3>Machine: {fault.machine_name}</h3>
                            <p>Fault Time: {fault.fault_time}</p>
                        </div>
                    ))
                ) : (
                    <p>No faults reported.</p>
                )}
            </div>
        </div>
    )
}
export default Notification