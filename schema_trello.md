boards
id text pk
createdAt timestamp
title text
description text
color text default 'bg-blue-500'
userId text fk ref(user.id)