import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    return (
        <navbar>
            <container>
                <nav>
                <Link to="/" >
                홈
                </Link>
                <Link to="/joinForm">
                회원가입
                </Link>
                <Link to="/loginForm">
                로그인
                </Link>
                <Link to="/saveForm">
                글쓰기
                </Link>
                </nav>
                <form>
                    <search type="search" placeholder="Search"></search>
                    <button>검색</button>
                </form>
            </container>
        </navbar>
    )
}

export default Header;