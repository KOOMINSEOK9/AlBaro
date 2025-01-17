import React from "react";
import { Link } from 'react-router-dom';

const BoardItem = (props) => {
    const {id, title, content, writer} = props.board;
    
    return (
        <tr>
        <td>{title}</td>
        <td>{writer}</td>
        <td><Link to={'/board/' + id}>상세보기</Link></td>
    </tr>
    )
}

export default BoardItem;