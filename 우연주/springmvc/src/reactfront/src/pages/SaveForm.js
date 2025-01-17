import React, {useState} from "react";
import { useNavigate } from "react-router-dom";

const SaveForm = (props) => {
    const history = useNavigate();

    const [board, setBoard] = useState({
        title:'',
        writer:'',
        content:'',
    })

    const changeValue = (e) => {
        setBoard({
            ...board,
            [e.target.name]:e.target.value,
        })
    }

    const submitBoard = (e) => {
        e.preventDefault();
        fetch('http://localhost:8081/board', {
            method:'POST',
            headers:{
                'Content-Type':'application/json; charset=utf-8',
            },
            body:JSON.stringify(board),
        })
        .then((res) => {
            console.log(1, res);
            if(res.status === 201){
                return res.json();
            } else {
                return null;
            }
        })
        .then((res) => {
            if(res !== null){
                history('/');
            } else {
                alert('등록에 실패하였습니다.');
            }
        })
    }

    return(
        <form onSubmit={submitBoard}>
            <label>Title</label>
            <input type='text' placeholder="Enter Title" onChange={changeValue} name="title"></input>
            <br/>
            <label>Writer</label>
            <input type='text' placeholder="writer" onChange={changeValue} name="writer"></input>
            <br/>
            <label>Content</label>
            <textarea onChange={changeValue} name="content"></textarea>
            <button type='submit'>등록</button>
        </form>
    )

}

export default SaveForm;