# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com), and this
project adheres to [Semantic Versioning](https://semver.org).

# Ultimos cambios 📃

## Backend 📦
### Que hacer
Instalar las dependencias respectivas
1. Ubicarse en el directorio de `/backend`
2. Activar el entorno virtual de python `venv\Scripts\Activate.ps1`
3. instalar las depencias de requirements.txt `pip install -r requirements.txt`
4. Crear un archivo .env con las siguientes variables:
    - **DATABASE_URL** (Url local de la base de datos)
    - **S_KEY** (Clave de encryptado)
    - **ALGORITHM** (Colocar: `HS256`, por motivos de seguridad y buenas practicas no se incluye explicitamente)
5. Con la base de datos lista ejecutar: `uvicorn app.main:app --reload`

# 🧾 Documentación de la API — Sistema de Control de Visitas

Esta documentación describe los **endpoints disponibles** en la carpeta `app/routes`, junto con sus métodos HTTP, payloads y respuestas esperadas.

---

## 🔐 Autenticación

### **POST** `/auth/token`

**Descripción:**
Obtiene un **token JWT** utilizando el flujo OAuth2 Password (envío con `form-data`).

#### 🧩 Request (form-data)

| Campo      | Tipo | Descripción       |
| ---------- | ---- | ----------------- |
| `username` | str  | Email del usuario |
| `password` | str  | Contraseña        |

#### ✅ Response 200

```json
{
  "access_token": "eyJhbGciOiJI...",
  "token_type": "bearer"
}
```

#### ⚠️ Errores

* **401** — Credenciales inválidas.

**Ejemplo:**

```bash
curl -X POST "http://localhost:8000/auth/token" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "username=juan.perez@example.com&password=MiClaveSecreta"
```

---

### **GET** `/auth/`

**Descripción:**
Devuelve el usuario actual, decodificado desde el token JWT.
*Requiere cabecera*: `Authorization: Bearer <token>`

#### ✅ Response 200

```json
{
  "User": {
    "usermail": "juan.perez@example.com",
    "id": 1
  }
}
```

---

## 👥 Usuarios

**Base path:** `/usuarios`

### 🧱 Modelos

* **`UsuarioCreate`**: `nombre`, `apellido`, `dni`, `email`, `departamento`, `telefono`, `rol`, `password`
* **`UsuarioOut`**: `id`, `created_at`, `estado` + campos base

---

### **POST** `/`

**Descripción:** Crear un nuevo usuario.

#### 🧩 Request (JSON)

```json
{
  "nombre": "Juan",
  "apellido": "Pérez",
  "dni": "12345678",
  "email": "juan.perez@example.com",
  "departamento": "D01",
  "telefono": "+541112345678",
  "rol": "portero",
  "password": "MiClaveSecreta"
}
```

#### ✅ Response 201

```json
{
  "id": 1,
  "nombre": "Juan",
  "apellido": "Pérez",
  "dni": "12345678",
  "email": "juan.perez@example.com",
  "departamento": "D01",
  "telefono": "+541112345678",
  "rol": "portero",
  "estado": true,
  "created_at": "2025-10-18T12:34:56"
}
```

#### ⚠️ Errores

* **400** — El email ya existe.

---

### **GET** `/{usuario_id}`

Obtiene un usuario por su ID.
✅ **Response 200:** `UsuarioOut`
⚠️ **404:** No encontrado

---

### **GET** `/`

Lista todos los usuarios.
✅ **Response 200:** `List[UsuarioOut]`

---

### **PUT** `/{usuario_id}`

Actualiza completamente un usuario.
✅ **Response 200:** `UsuarioOut`
⚠️ **404:** No encontrado

---

### **PATCH** `/{usuario_id}`

Actualiza parcialmente un usuario.
✅ **Response 200:** `UsuarioOut`
⚠️ **208:** Ya estaba eliminado

---

## 🧾 Visitantes

**Base path:** `/visitantes`

### **POST** `/`

Crea un nuevo visitante.

#### 🧩 Request

```json
{
  "nombre": "María",
  "apellido": "Gómez",
  "dni": "87654321"
}
```

#### ✅ Response 201

```json
{
  "id": 1,
  "nombre": "María",
  "apellido": "Gómez",
  "dni": "87654321",
  "estado": true,
  "created_at": "2025-10-18T12:00:00"
}
```

---

### **GET** `/{visitante_id}`

Obtiene un visitante por ID.
✅ **Response 200:** `VisitanteOut`

---

### **PATCH** `/{visitante_id}`

Actualiza parcialmente un visitante.

#### 🧩 Ejemplo Request

```json
{
  "visitado_id": 2,
  "visitante_id": 3,
  "motivo": "Incidente previo"
}
```

#### ✅ Response 201

```json
{
  "id": 1,
  "visitado_id": 2,
  "visitante_id": 3,
  "motivo": "Incidente previo",
  "created_at": "2025-10-18T14:00:00"
}
```

---

## 🪪 Autorizaciones

**Base path:** `/autorizaciones`

### 🧱 Modelos

* **`AutorizacionCreate`**: `visitado_id`, `visitante_id`, `tipo`, `fecha_inicio?`, `fecha_fin?`
* **`AutorizacionOut`**: `id`, `created_at` + campos base

---

### **POST** `/`

Crea una nueva autorización.

#### ✅ Response 201

```json
{
  "id": 1,
  "visitado_id": 2,
  "visitante_id": 1,
  "tipo": "unico",
  "fecha_inicio": "2025-10-20T09:00:00",
  "fecha_fin": "2025-10-20T18:00:00",
  "created_at": "2025-10-18T13:00:00"
}
```

---

### **GET** `/{autorizacion_id}`

Obtiene una autorización por ID.
✅ **Response 200:** `AutorizacionOut`

---

### **GET** `/`

Lista todas las autorizaciones.
✅ **Response 200:** `List[AutorizacionOut]`

---

## 🚫 Vetados

**Base path:** `/vetados`

### 🧱 Modelos

* **`VetadoCreate`**: `visitado_id`, `visitante_id`, `motivo`
* **`VetadoOut`**: `id`, `created_at` + campos base

---

### **POST** `/`

Crea un nuevo registro de visitante vetado.
✅ **Response 201:** `VetadoOut`

---

### **GET** `/{vetado_id}`

Obtiene un vetado por ID.
✅ **Response 200:** `VetadoOut`

---

### **GET** `/`

Lista todos los vetados.
✅ **Response 200:** `List[VetadoOut]`

---

### **DELETE** `/{vetado_id}`

Elimina un registro de vetado (**borrado físico**).
✅ **Response 204:** No Content

---

## 🕓 Visitas

**Base path:** `/visitas`

### 🧱 Modelos

* **`VisitaCreate`**: `visitante_id`, `autorizado_id?`, `portero_id`, `estado`, `observacion?`
* **`VisitaOut`**: `id`, `fecha_ingreso`, `fecha_salida?` + campos base

---

### **POST** `/`

Crea una nueva visita.

#### 🧩 Request

```json
{
  "visitante_id": 1,
  "autorizado_id": 1,
  "portero_id": 5,
  "estado": "pendiente",
  "observacion": "Llegó con retraso"
}
```

#### ✅ Response 201

```json
{
  "id": 1,
  "visitante_id": 1,
  "autorizado_id": 1,
  "portero_id": 5,
  "estado": "pendiente",
  "observacion": "Llegó con retraso",
  "fecha_ingreso": "2025-10-18T15:30:00",
  "fecha_salida": null
}
```

---

### **GET** `/{visita_id}`

Obtiene una visita por ID.
✅ **Response 200:** `VisitaOut`

---

### **GET** `/`

Lista todas las visitas.
✅ **Response 200:** `List[VisitaOut]`

---

## 📘 Notas y Recomendaciones

* Todos los endpoints usan Pydantic con `orm_mode=True` para serializar modelos SQLAlchemy.
* La autenticación se maneja mediante **JWT**, obtenido desde `/auth/token`.
* Considerá agregar validación de roles (por ejemplo, `portero` para registrar visitas).

---

## ⚙️ Ejemplos Rápidos (cURL)

### Obtener token

```bash
curl -X POST "http://localhost:8000/auth/token" \
-H "Content-Type: application/x-www-form-urlencoded" \
-d "username=correo@example.com&password=miPass"
```

### Llamada protegida

```bash
curl -H "Authorization: Bearer <TOKEN>" \
http://localhost:8000/auth/
```

---

¿Querés que te lo prepare como un **archivo `.md` bien formateado** (por ejemplo `api_documentacion.md`) listo para usar en GitHub o dentro de un repo? Puedo generártelo enseguida.
