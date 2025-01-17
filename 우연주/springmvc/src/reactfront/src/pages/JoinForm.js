import React, { useState } from "react";
import { useNavigate  } from "react-router-dom";

const JoinForm = (props) => {

    const nav = useNavigate();

    const [user, setUser] = useState({
        id:'',
        password:'',
        name:'',
    })

    const changeValue = (e) => {
        setUser({
            ...user,
            [e.target.name]:e.target.value,
        })
    }

    const joinUser = (e) => {
        e.preventDefault();
        fetch('http://localhost:8081/joinForm', {
            method:'POST',
            headers:{
                'Content-Type':'application/json; charset=utf-8',
            },
            body:JSON.stringify(user),
            mode: 'cors',
        })
        .then((res) => {
            if(res !== null){
                nav('/');
            } else {
                alert("회원가입에 실패했습니다.");
            }
        })
    }

    return(
        <div>
            <h1>회원가입</h1>
            <form onSubmit={joinUser}>
                <label>ID</label>
                <input type="text" placeholder="Enter ID" onChange={changeValue} name="ID"></input>
                <br />
                <label>PW</label>
                <input type="password" placeholder="Enter PW" onChange={changeValue} name="password"></input>
                <br />
                <label>name</label>
                <input type="text" placeholder="Enter name" onChange={changeValue} name="name"></input>
                <br />
                <button type='submit'>등록</button>
            </form>
        </div>
    )
}

export default JoinForm;