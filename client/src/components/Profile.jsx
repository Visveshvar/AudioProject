import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";

const Profile=()=>{
    const [userDetails,setUserDetails]=useState(null)
    const [loading,setLoading]=useState(true)
    const [error,setError]=useState("")
    const {username}=useAuth()
    useEffect(()=>{
        const fetchUserDetails=async ()=>{
            try{
                const response=await axios.get("http://localhost:5007/users",{
                    params:{username},
                    withCredentials:true
                });
                setUserDetails(response.data.user)
            } catch (err) {
                setError("Failed to fetch user details");
                console.error(err);
              } finally {
                setLoading(false);
              }
        };
        fetchUserDetails();
    },[username])
    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;
    return(
        <div>
        <h2>Profile</h2>
        {userDetails ? (
          <div>
            <p><strong>Username:</strong> {userDetails.username}</p>
            <p><strong>Full Name:</strong> {userDetails.fullname}</p>
            <p><strong>Email:</strong> {userDetails.email}</p>
          </div>
        ) : (
          <div>No user details available</div>
        )}
      </div>
    )
}
export default Profile