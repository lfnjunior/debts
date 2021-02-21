## Servidor: api-server

#### Quick Start:

Instalar as dependências:
```bash
yarn
```

Iniciar a api:
```bash
yarn start
```

---

#### Rotas:


**Dívidas**:

Criar dívida:
```bash
curl 
--request POST \
--url <URL_BASE>/debt \
--header 'Content-Type: application/json' \
--header 'token: <TOKEN>' \
--data '{
  "clientId": 2,
  "reason": "motivo",
  "date": "2021-01-01T01:01:01.000Z",
  "value": 15.12
}'
```

 Alterar dívida:
```bash
curl 
--request PUT \
--url <URL_BASE>/debt/<ID_DA_DIVIDA> \
--header 'Content-Type: application/json' \
--header 'token: <TOKEN>' \
--data '{
  "clientId": 2,
  "reason": "motivo 2",
  "date": "2021-01-01T01:01:01.000Z",
  "value": 20.12
}'
```

 Remover dívida:
```bash
curl 
--request DELETE \
--url <URL_BASE>/debt/<ID_DA_DIVIDA> \
--header 'Content-Type: application/json' \
--header 'token: <TOKEN>'
```

 Consultar dívida pelo Id:
```bash
curl 
--request GET \
--url <URL_BASE>/debt/<ID_DA_DIVIDA> \
--header 'Content-Type: application/json' \
--header 'token: <TOKEN>'
```

 Consultar dívidas do devedor:
```bash
curl 
--request GET \
--url <URL_BASE>/debtor/<ID_DO_DEVEDOR> \
--header 'Content-Type: application/json' \
--header 'token: <TOKEN>'
```

 Consultar todos os devedores:
```bash
curl 
--request GET \
--url <URL_BASE>/debtors \
--header 'Content-Type: application/json' \
--header 'token: <TOKEN>'
```

---
**Usuário**:

 Criar Usuário:
```bash
curl 
--request POST \
--url <URL_BASE>/user \
--header 'Content-Type: application/json' \
--data '{
  "username": "teste",
  "password": "123456",
  "email": "teste@gmail.com",
  "birthdate": "2000-11-15T00:00:00.000-02:00",
  "sex": "F"
}'
```

 Login:
```bash
curl 
--request POST \
--url <URL_BASE>/user/login \
--header 'Content-Type: application/json' \
--data '{
  "email": "teste@gmail.com",
  "password": "123456"
}'
```

 Consultar usuário pelo Id:
```bash
curl 
--request POST \
--url <URL_BASE>/user/<ID_DO_USUARIO> \
--header 'Content-Type: application/json' \
--header 'token: <TOKEN>'
```

 Alterar usuário:
```bash
  curl 
  --request PUT \
  --url <URL_BASE>/user/<ID_DO_USUARIO> \
  --header 'Content-Type: application/json' \
  --header 'token: <TOKEN>'  \
  --data '{
    "username": "teste 2",
    "password": "123456",
    "email": "teste@gmail.com",
    "birthdate": "1993-03-07T00:00:00.000-03:00",
    "sex": "M"
  }'
```


---