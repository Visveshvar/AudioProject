import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const Dashboard = () => {
  const [machineData, setMachineData] = useState([]);

  useEffect(() => {
    // Initialize the socket connection once on component mount
    const newSocket = io('http://127.0.0.1:5007', {
      transports: ["websocket", "polling"],
      cors: {
        origin: "http://localhost:3000",
      },
    });


    // Listen for incoming data once connected,
    newSocket.on('connect', () => {
      console.log("Socket connected");
      newSocket.emit('dashboard', { message: 'Hello from ar!' });
    });

    newSocket.on('sent_data', (data) => {
      console.log("Data received:", data); // Log to see exact structure
      setMachineData(data.machine)
    });
    

    newSocket.on('sent_datum', (data) => {
      console.log("Alert data received:", data);
      // You can update a state for alerts here if needed
    });
    // Clean up the socket connection on unmount
    return () => {
      console.log("Socket disconnected");
      newSocket.disconnect();
    };
  }, []); // Empty dependency array ensures this runs only once

  return (
    <div className="container mt-5">
      <h2 className="text-center">Machine Dashboard</h2>
      <table className="table table-striped mt-3">
        <thead>
          <tr>
            <th>Machine Name</th>
            <th>Status</th>
            <th>Health</th>
            <th>Zone</th>
          </tr>
        </thead>
        <tbody>
          {machineData.length > 0 ? (
            machineData.map((machine, index) => (
              <tr key={index}>
                <td>{machine.machine_name}</td>
                <td>{machine.status}</td>
                <td>{machine.health}</td>
                <td>{machine.zone}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4" className="text-center">No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Dashboard;