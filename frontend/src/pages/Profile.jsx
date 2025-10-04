import { useState, useEffect } from "react";
import API from "../api/api";
import { toast } from "react-toastify";
import "../styles/pro.css"

export default function Profile(){
  const [form,setForm] = useState({ name:"", email:"", timezone:"", password:"" });
  useEffect(()=> {
    API.get("/users/me").then(res => setForm({...form, name: res.data.name, email: res.data.email, timezone: res.data.timezone}));
  },[]);

  const save = async ()=> {
    try {
      const res = await API.post("/users/me", form);
      localStorage.setItem("userName", res.data.name);
      toast.success("Profile updated");
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="form-card card container">
      <h2 className="form-title">Your profile</h2>
      <input className="form-input" placeholder="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/>
      <input className="form-input" placeholder="Email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/>
      <input className="form-input" placeholder="Timezone" value={form.timezone} onChange={e=>setForm({...form,timezone:e.target.value})}/>
      <input className="form-input" type="password" placeholder="New password (leave blank to keep)" value={form.password} onChange={e=>setForm({...form,password:e.target.value})}/>
      <button className="btn btn-primary btn-block" onClick={save}>Save</button>
    </div>
  );
}
