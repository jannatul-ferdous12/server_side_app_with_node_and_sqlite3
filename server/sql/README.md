# Backend

## get all users

```bash

curl --silent --include http://localhost:8000/api/user
```

## get a user

```bash

curl --silent --include http://localhost:8000/api/user/3
```

## create a user

```bash

curl --request POST --url http://localhost:8000/api/user --header 'Content-Type: application/json' --data '{"first_name": "John", "last_name": "Doe", "city": "New York", "dept_no": 101}'
```

## update an user

```bash

curl --request PUT --url http://localhost:8000/api/user/3 --header 'Content-Type: application/json' --data '{"first_name": "UpdatedJohn", "last_name": "UpdatedDoe", "city": "UpdatedCity", "dept_no": 102}'
```

## delete a user

```bash

curl --request DELETE --url http://localhost:8000/api/user/3
```

## search by query string

```bash

curl --silent --include http://localhost:8000/api/user/?last_name=Doe&city=helsinki
```
