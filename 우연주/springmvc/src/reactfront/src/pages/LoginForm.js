import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginForm = (props) => {

    const history = useNavigate();

    const [user, setUser] = useState({
        id:'',
        password:'',
    })

    const changeValue = (e) => {
        setUser({
            ...user,
            [e.target.name]:e.target.value,
        })
    }

    const login = (e) => {
        e.preventDefault();
        fetch('http://localhost:8081/user', {
            method:'POST',
            headers:{
                'Content-Type':'application/json; charset=utf-8',
            },
            body:JSON.stringify(user),
        })
        .then((res) => {
            if(res.status === 201){
                return res.json()
            } else {
                alert('로그인에 실패하였습니다.');
            }
        })
        .then((data) => {
            alert('로그인 성공!')
            history('/'); // 로그인 성공 시 이동
        })
    }

    return (
        <div>
            <h1>로그인</h1>
            <form onSubmit={login}>
                <input 
                    type="text" 
                    placeholder="아이디를 입력하세요" 
                    name="id" 
                    value={user.id} 
                    onChange={changeValue}
                />
                <input 
                    type="password" 
                    placeholder="비밀번호를 입력하세요" 
                    name="password" 
                    value={user.password} 
                    onChange={changeValue}
                />
                <br />
                <button>로그인</button>
            </form>
        </div>
    )
}

export default LoginForm;