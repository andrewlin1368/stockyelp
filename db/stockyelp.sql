create table stocks(
    stock_id serial primary key, 
    fullname varchar(50) not null,
    symbol varchar(10) not null,
    description varchar(255) not null,
    price numeric not null,
    upvotes integer default 0 not null,
    downvotes integer default 0 not null,
    week_low numeric not null,
    week_high numeric not null,
    current_data timestamp default now() not null
);

create table users(
    user_id serial primary key,
    username varchar(18) unique not null,
    firstname varchar(25) not null,
    lastname varchar(25) not null,
    password varchar(500) not null,
    isAdmin boolean default false not null
);

create table profiles(
    profile_id serial primary key,
    user_id integer references users(user_id) not null,
    stock_id integer references stocks(stock_id) not null
);

create table comments(
    comment_id serial primary key,
    user_id integer references users(user_id) not null,
    stock_id integer references stocks(stock_id) not null,
    message varchar(500) not null,
    created_at timestamp default now() not null,
    isdeleted boolean default false not null,
    username varchar(50) not null
); 

create table upvote(
    vote_id serial primary key,
    user_id integer references users(user_id) not null,
    stock_id integer references stocks(stock_id) not null
);

create table downvote(
    vote_id serial primary key,
    user_id integer references users(user_id) not null,
    stock_id integer references stocks(stock_id) not null
);

create table message(
    message_id serial primary key,
    message_email varchar(500) not null,
    message_message varchar(500) not null,
    message_isdeleted boolean default false not null,
    message_date timestamp default now() not null
);
