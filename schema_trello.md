boards
id text pk uuid
createdAt timestamp
title text
description text
color text default 'bg-blue-500'
userId text fk ref(user.id)

columns
id text pk uuid
createdAt timestamp
boardId text fk ref(boards.id) onDelete: "cascade"
title text
sortOrder int default 0

tasks
id text pk uuid
createdAt timestamp
title text
description text optional
assignee text optional
due_date date 
priority text optional default 'medium'
sortOrder int default 0
columnId text fk ref(columns.id) onDelete: "cascade"
updatedAt timestamp
