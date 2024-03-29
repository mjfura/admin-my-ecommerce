import { useState,useEffect } from "react";
import axios from "axios";
import {API} from "../config";
import {methodCreate, methodDelete, methodGet, showMessage} from "./Tools";
import "./Categorias.css";
import "./Productos.css";
import "./Usuarios.css";
import Loader from "./Loader";
import DeleteIcon from '@material-ui/icons/Delete';

export default function Usuarios(){
    const [users,setUsers]=useState([]);
    const [loading,setLoading]=useState({
        bool:true,
        add:false
    });
    const[form,setForm]=useState({
        name:"",
        username:"",
        phone:"",
        password:"",
        facebook:"",
        role:""
    });
    const [error,setError]=useState({
        new:false,
        err:""
    });
    const [isSubmit,setIsSubmit]=useState({
       bool:false,
       message:"",
       add:false,
       added:"",
        deleted:""
    });
    const getUsers= ()=>{
        const url=`${API}/user/users`;
        methodGet(url,axios,(err)=>{
            setError({new:true,err});
            setIsSubmit({bool:true,message:"message-delete"});
            setLoading(false);
        },(json)=>{setUsers(json);
        setLoading({bool:false})});
    }
    useEffect(()=>{
        getUsers();
    },[]);
    useEffect(()=>{
        getUsers();
        if(isSubmit.bool || isSubmit.add){
            showMessage(isSubmit.message);
            setError({...error,new:false});
            setIsSubmit({...isSubmit,bool:false});
        }
    },[isSubmit.add || isSubmit.bool]);
    const addUser= ()=>{
        const url=`${API}/user/createUser`;
        const formPost={
            name:form.name,
            username:form.username,
            password:form.password,
            phone:form.phone,
            facebook:form.facebook,
            role:form.role
        }
        methodCreate(url,formPost,axios,(err)=>{
            setError({new:true, err});
            setIsSubmit({add:true,message:"message-add"});
            setLoading({add:false});
        },()=>{setIsSubmit({add:true, message:"message-add"});
    setLoading({add:false})});
    setForm({
        username:"",
        password:"",
        name:"",
        phone:"",
        facebook:"",
        role:""
    })
    }
    const handleChange=(e)=>{
        setForm({
            ...form,
            [e.target.name]:e.target.value
        })
    }
    const eliminar= (id)=>{
        const url=`${API}/user/${id}`;
        methodDelete(url,axios,(err)=>{
            setError({new:true, err});
            setIsSubmit({bool:true, message:"message-delete"});
        },(message)=>setIsSubmit({bool:true, deleted:message, message:"message-delete"}));
        
    }
    return(
        <div className="categorias-block">
            <h1>Usuarios</h1>
            <ul className="categorias-container">
                <li className="category-element product-size user-size">
                    <p>Nombre</p><p>Usuario</p><p>Rango</p><p>Acción</p>
                </li>
            {users.map((el)=>(
                <li key={el._id} className="user-size category-element product-size">
                    <p>{el.name}</p>
                    <p>{el.username}</p>
                    <p>{el.role}</p>
                    <div className="container-button" >

                    <button onClick={()=>eliminar(el._id)} className="button-logout">
                        <DeleteIcon/>
                        <p>Eliminar</p></button>
                    </div>
                </li>
            ))}
            </ul>
            {loading.bool && <Loader/> }
            {(error.new)?<h2 className="note error" id="message-delete"> {error.err}</h2>
            :<h2 className="note" id="message-delete"> {isSubmit.deleted} </h2>}
            <div className="form-block user-field">
                <h2>Agregar nuevo usuario</h2>
                <input value={form.name} onChange={handleChange} className="input-element" name="name" placeholder="Nombre" type="text"/>
                <input value={form.phone} onChange={handleChange} placeholder="Celular" className="input-element" name="phone" type="text"/>
                <input value={form.facebook} onChange={handleChange} placeholder="Facebook" className="input-element" name="facebook" type="text"/>
                <input value={form.username} onChange={handleChange} className="input-element" name="username" placeholder="Usuario" type="email"/>
                <input value={form.password} onChange={handleChange} className="input-element" name="password" placeholder="Contraseña" type="password"/>
                <input value={form.role} onChange={handleChange} className="input-element" name="role" placeholder="Rango" type="number"/>
                {!loading.add?
                <button  onClick={()=>{
                    setLoading({add:true});
                    addUser();
                }} className="button-element">Agregar</button>
            :<Loader/>    
            }
            </div>
             { (error.new)?<h2 className="note error" id="message-add"> {error.err}</h2>
            :<h2 className="note" id="message-add">Se ha agregado {isSubmit.added} exitosamente </h2>}
        </div>
    );
}