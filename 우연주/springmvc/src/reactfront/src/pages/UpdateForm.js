import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const UpdateForm = (props) => {
    const history = useNavigate();
    const propsParam = useParams();
    const id = propsParam.id;

    const [board, setBoard] = useState({
        title:'',
        writer:'',
        content:'',
    })

    useEffect(()=>{
        fetch('http://localhost:8081/board/' + id)
        .then((res) => res.json())
        .then((res) => {
            setBoard(res);
        })
    }, [])

    const changeValue = (e) => {
        setBoard({
            ...board,
            [e.target.name]:e.target.value,
        })
    }

    const submitBoard = (e) => {
        e.preventDefault();
        
        fetch('http://localhost:8081/board/' + id, {
            method:'PUT',
            headers:{
                'Content-Type':'application/json; charset=utf-8',
            },
            body:JSON.stringify(board),
        })
        .then((res) => {
            if(res.status === 200){
                return res.json();
            } else {
                return null;
            }
        })
        .then((res) => {
            if(res !== null){
                history('/board/' + id);
            } else {
                alert('수정에 실패했습니다.');
            }
        })
    }
    
            return (
            <form onSubmit={submitBoard}>
                <label>Title</label>
                <input type='text' placeholder="Enter Title" onChange={changeValue} name="title" value={board.title}></input>
                <br/>
                <label>Writer</label>
                <input type='text' placeholder="writer" onChange={changeValue} name="writer" value={board.writer} disabled></input>
                <br/>
                <label>Content</label>
                <textarea onChange={changeValue} name="content" value={board.content}></textarea>
                <button type='submit'>수정</button>
            </form>
            )
}

export default UpdateForm;