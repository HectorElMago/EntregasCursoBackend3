
# Mocks - ENTREGA 1 DEL PROYECTO FINAL BACKEND 3

Esta parte del proyecto implementa un router dedicado a la generación de datos falsos (mocks), el cual se monta en la ruta base **/api/mocks**. En este router se incluyen los siguientes endpoints:

---

## 1. GET `/api/mocks/mockingpets`

**Ejemplo de respuesta:**

```json
{
  "status": "success",
  "payload": [
    {
      "name": "Misty",
      "species": "cat",
      "age": 5
    },
    {
      "name": "Buddy",
      "species": "dog",
      "age": 3
    }
  ]
}

## 2. GET `/api/mocks/mockingusers`


**Ejemplo de respuesta:**

```json
{
  "status": "success",
  "payload": [
    {
      "first_name": "Alice",
      "last_name": "Smith",
      "email": "alice.smith@example.com",
      "age": 28,
      "password": "$2b$10$xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
      "role": "admin",
      "pets": []
    }
  ]
}

## 3. POST `/api/mocks/generateData`


**Ejemplo de Body:**

```json
{
  "users": 20,
  "pets": 10
}




## **Cómo utilizar las API's con ejemplos**

### **1. Crear un administrador y un usuario**

#### **Crear un administrador**

**POST** `/api/users`

**Body:**

```json
{
  "first_name": "Admin",
  "last_name": "User",
  "email": "admin@example.com",
  "age": 30,
  "password": "adminpassword",
  "role": "admin"
}
```

#### **Crear un usuario estándar**

**POST** `/api/users`

**Body:**

```json
{
  "first_name": "Normal",
  "last_name": "User",
  "email": "user@example.com",
  "age": 25,
  "password": "userpassword"
}
```

---

### **2. Leer Usuarios**

**GET** `/api/users`

Devuelve una lista de todos los usuarios registrados.

---

### **3. Autenticación de Usuario (Login)**

**POST** `/api/sessions/login`

**Body:**

```json
{
  "email": "admin@example.com",
  "password": "adminpassword"
}
```

Guarda el token para usarlo en las siguientes solicitudes.

---

### **4. Sesión del Usuario**

**GET** `/api/sessions/current`

**Headers:**

```
Authorization: Bearer <TOKEN>
```

Devuelve los datos del usuario actual autenticado.

---

## **Productos**

### **Ver productos (acceso para usuarios y administradores)**

**GET** `/api/products`

**Headers:**

```
Authorization: Bearer <TOKEN>
```

Devuelve una lista de productos con paginación y opciones de filtrado.

#### **Query Params disponibles:**

- `limit`: Cantidad de productos por página. (Por defecto: 10)
- `page`: Número de página. (Por defecto: 1)
- `sort`: Ordenar por precio (`asc` o `desc`).
- `query`: Filtrar por categoría o estado (`true` para activos, `false` para inactivos).

**Ejemplo:** `/api/products?limit=5&page=2&sort=asc&query=Electrónica`

---

### **Crear un producto (solo para administradores)**

**POST** `/api/products`

**Headers:**

```
Authorization: Bearer <TOKEN>
```

**Body:**

```json
{
  "title": "Producto de prueba",
  "description": "Un excelente producto",
  "code": "TEST001",
  "price": 100,
  "stock": 50,
  "category": "general",
  "thumbnails": ["https://example.com/image.jpg"]
}
```

---

### **Eliminar un producto (solo para administradores)**

**DELETE** `/api/products/:id`

**Headers:**

```
Authorization: Bearer <TOKEN>
```

**Ejemplo:**
`DELETE http://localhost:8080/api/products/<PRODUCT_ID>`

---

## **Carritos**

### **Crear un carrito**

**POST** `/api/carts`

**Headers:**

```
Authorization: Bearer <TOKEN>
```

---

### **Agregar producto al carrito**

**POST** `/api/carts/:cid/product/:pid`

**Headers:**

```
Authorization: Bearer <TOKEN>
```

**Ejemplo:**
`POST http://localhost:8080/api/carts/<CART_ID>/product/<PRODUCT_ID>`

---

### **Eliminar un producto del carrito**

**DELETE** `/api/carts/:cid/products/:pid`

**Headers:**

```
Authorization: Bearer <TOKEN>
```

**Ejemplo:**
`DELETE http://localhost:8080/api/carts/<CART_ID>/products/<PRODUCT_ID>`

---

### **Actualizar la cantidad de un producto en el carrito**

**PUT** `/api/carts/:cid/products/:pid`

**Headers:**

```
Authorization: Bearer <TOKEN>
```

**Body:**

```json
{
  "quantity": 3
}
```

---

### **Vaciar el carrito**

**DELETE** `/api/carts/:cid`

**Headers:**

```
Authorization: Bearer <TOKEN>
```

**Ejemplo:**
`DELETE http://localhost:8080/api/carts/<CART_ID>`

---

### **Ver productos del carrito**

**GET** `/api/carts/:cid`

**Headers:**

```
Authorization: Bearer <TOKEN>
```

**Ejemplo:**
`GET http://localhost:8080/api/carts/<CART_ID>`
