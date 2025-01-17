drop schema if exists `crud`;
create schema if not exists `crud`;
use crud;

create table if not exists `user`(
	`id` varchar(20) primary key not null,
    `password` varchar(20) not null,
    `name` varchar(10) not null
);

create table if not exists `board`(
	`id` int primary key auto_increment not null,
    `title` varchar(50) not null,
    `content` varchar(500) not null,
    `writer` varchar(20) not null,
    `written_date` datetime default now(),
    foreign key(`writer`) references user(`id`)
);

insert into user values("ssafy", "1234", "김싸피");
insert into board(id, title, content, writer) values(1, "test", "test content1", "ssafy");

insert into user values("user1", "1234", "유저1");
insert into board(id, title, content, writer) values(2, "test2", "test content2", "user1");


select * from board;
select * from user;