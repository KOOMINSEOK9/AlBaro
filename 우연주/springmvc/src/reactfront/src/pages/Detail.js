import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const Detail = (props) => {
    const history = useNavigate();
    const propsParam = useParams();
    const id = propsParam.id;

    const [board, setBoard] = useState({
        id:'',
        title:'',
        content:'',
        writer:'',
    })

    useEffect(() => {
        fetch('http://localhost:8081/board/' + id)
        .then((res) => res.json())
        .then((res) => {
            setBoard(res);
        })
    }, [id]);

    const deleteBoard = () => {
        fetch('http://localhost:8081/board/' + id, {
            method:'DELETE',
        })
        .then((res) => res.text())
        .then((res) => {
            console.log('res', res);
            if(res === 'delete OK'){
                console.log('삭제 성공');
                history('/');
            } else {
                alert('삭제 실패');
            }
        })
    }

    const updateBoard = () => {
        history('/updateForm/' + id);
    }

    const goHome = () =>{
        history('/');
    }

    return (
        <div>
            <h1>게시판 상세보기</h1>
            <button onClick={updateBoard}>수정</button>
            {' '}
            <button onClick={deleteBoard}>삭제</button>
            <hr />
            <h1>{board.title}</h1>
            <h3>{board.writer}</h3>
            <p>{board.content}</p>
            <button onClick={goHome}>목록</button>
        </div>
    )
}

export default Detail