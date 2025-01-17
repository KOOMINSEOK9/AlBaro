import React, { useEffect, useState } from 'react';
import BoardItem from '../components/BoardItem';
import { Link } from 'react-router-dom';

const Home = () => {
    const [boards, setBoards] = useState([]);

    useEffect(() => {
        fetch('http://localhost:8081/board', {
            method:'GET',
        })
        .then((res) => res.json())
        .then((res) => {
            setBoards(res);
        })
    }, [])

    return (
<div>
            <h1>게시글 목록</h1>
            <table border={1}>
                <thead>
                    <tr>
                        <td>제목</td>
                        <td>작성자</td>
                        <td>상세보기</td>
                    </tr>
                </thead>
                <tbody>
                    {boards.map((board) => (
                        <BoardItem key={board.id} board={board} />
                    ))}
                </tbody>
            </table>
            <Link to={'/saveForm'}>게시글 등록</Link>
        </div>
    )
}

export default Home;