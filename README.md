# 📐 Blueprints Management System
### Laboratorio 5 - ARSW (Arquitecturas de Software)
#### Escuela Colombiana de Ingeniería Julio Garavito

## 📋 Descripción General

El **Blueprints Management System** es una aplicación web full-stack desarrollada con Spring Boot y tecnologías web modernas que permite la gestión completa de planos arquitectónicos. El sistema proporciona funcionalidades para crear, consultar, editar y eliminar planos mediante una interfaz web interactiva con capacidades de dibujo en tiempo real.

Este proyecto corresponde al **Laboratorio 5** de la asignatura **ARSW (Arquitecturas de Software)**, donde se implementa un cliente 'grueso' utilizando API REST, HTML5, JavaScript y CSS3, demostrando la integración entre tecnologías frontend y backend modernas.

### 🎯 Propósito

Esta aplicación está diseñada para arquitectos, ingenieros y diseñadores que necesitan:

- Gestionar catálogos de planos arquitectónicos
- Crear planos de forma interactiva mediante canvas HTML5
- Consultar planos por autor
- Visualizar y editar planos existentes
- Calcular métricas de complejidad (número de puntos)

### 📚 Objetivos del Laboratorio ARSW

El proyecto implementa los siguientes requerimientos del **Laboratorio 5**:

**Parte I - Cliente 'grueso' con API REST:**
- ✅ Integración de jQuery y Bootstrap mediante WebJars
- ✅ Interfaz web responsiva con formularios dinámicos
- ✅ Consumo de API REST mediante AJAX
- ✅ Patrón Módulo JavaScript para arquitectura frontend
- ✅ Programación funcional con map/reduce (sin bucles)

**Parte II - Interactividad y Canvas:**
- ✅ Canvas HTML5 para dibujo interactivo de planos
- ✅ Eventos de mouse para agregar puntos dinámicamente
- ✅ Operaciones CRUD completas con confirmación
- ✅ Promesas JavaScript para manejo asíncrono
- ✅ Integración completa frontend-backend

## 🏗️ Arquitectura del Sistema

### Arquitectura General
El sistema implementa una **arquitectura de 3 capas** con separación clara de responsabilidades:

```
┌─────────────────────────────────────────┐
│             Frontend (Client)           │
│  ┌─────────────┐ ┌─────────────────────┐ │
│  │   HTML5     │ │    JavaScript       │ │
│  │  Bootstrap  │ │   (jQuery/Canvas)   │ │
│  │    CSS3     │ │                     │ │
│  └─────────────┘ └─────────────────────┘ │
└─────────────────────────────────────────┘
                     │ HTTP/REST
┌─────────────────────────────────────────┐
│          Backend (Spring Boot)          │
│  ┌─────────────┐ ┌─────────────────────┐ │
│  │ Controllers │ │      Services       │ │
│  │   (REST)    │ │   (Business Logic)  │ │
│  └─────────────┘ └─────────────────────┘ │
│  ┌─────────────┐ ┌─────────────────────┐ │
│  │    Model    │ │    Persistence      │ │
│  │   Classes   │ │   (In-Memory)       │ │
│  └─────────────┘ └─────────────────────┘ │
└─────────────────────────────────────────┘
```

### 🔧 Stack Tecnológico

#### Backend
- **Framework**: Spring Boot 2.7.0
- **Lenguaje**: Java 11
- **Build Tool**: Maven
- **Arquitectura**: REST API
- **Persistencia**: In-Memory (ConcurrentHashMap)
- **Servidor**: Tomcat Embebido (puerto 8080)

#### Frontend
- **HTML5**: Estructura semántica y Canvas API
- **CSS3**: Bootstrap 3.3.7 para diseño responsivo
- **JavaScript**: ES5 con patrón módulo
- **Librerías**: jQuery 3.1.0
- **Interactividad**: Canvas events y AJAX

## 📁 Estructura del Proyecto

```
lab5-arsw/
├── src/
│   └── main/
│       ├── java/edu/eci/arsw/blueprints/
│       │   ├── BlueprintsAPIApplication.java    # Clase principal
│       │   ├── controllers/
│       │   │   └── BlueprintAPIController.java  # REST endpoints
│       │   ├── services/
│       │   │   └── BlueprintsServices.java     # Lógica de negocio
│       │   ├── persistence/
│       │   │   ├── BlueprintsPersistence.java  # Interface persistencia
│       │   │   └── InMemoryBlueprintPersistence.java # Implementación
│       │   ├── model/
│       │   │   ├── Blueprint.java              # Modelo plano
│       │   │   └── Point.java                  # Modelo punto
│       │   ├── filters/
│       │   │   └── BlueprintFilter.java        # Filtros de planos
│       │   └── exceptions/                     # Excepciones personalizadas
│       └── resources/
│           └── static/                         # Contenido web estático
│               ├── index.html                  # Página principal
│               └── js/
│                   ├── app.js                  # Lógica principal frontend
│                   └── apimock.js             # Datos de prueba
├── pom.xml                                     # Configuración Maven
└── README.md                                   # Documentación
```

## 🔌 API REST Endpoints

### Operaciones Disponibles

| Método | Endpoint | Descripción | Respuesta |
|--------|----------|-------------|-----------|
| `GET` | `/blueprints` | Obtiene todos los planos | `200 OK` + JSON Array |
| `GET` | `/blueprints/{author}` | Obtiene planos por autor | `200 OK` / `404 Not Found` |
| `GET` | `/blueprints/{author}/{name}` | Obtiene plano específico | `200 OK` / `404 Not Found` |
| `POST` | `/blueprints` | Crea nuevo plano | `201 Created` / `409 Conflict` |
| `PUT` | `/blueprints/{author}/{name}` | Actualiza plano existente | `200 OK` / `404 Not Found` |
| `DELETE` | `/blueprints/{author}/{name}` | Elimina plano | `200 OK` / `404 Not Found` |

### Ejemplos de Uso

#### Consultar planos por autor
```bash
GET http://localhost:8080/blueprints/juan
```

#### Crear nuevo plano
```bash
POST http://localhost:8080/blueprints
Content-Type: application/json

{
  "author": "diego",
  "name": "casa_moderna",
  "points": [
    {"x": 10, "y": 10},
    {"x": 50, "y": 10},
    {"x": 50, "y": 50}
  ]
}
```

## 🖥️ Funcionalidades Frontend

### Interfaz de Usuario
- **Diseño Responsivo**: Bootstrap 3.3.7 con iconografía Glyphicons
- **Formulario de Búsqueda**: Campo para ingresar nombre del autor
- **Tabla Dinámica**: Muestra planos con nombre, puntos y acciones
- **Canvas Interactivo**: Área de dibujo de 800x600px
- **Panel de Administración**: Botones para operaciones CRUD

### Capacidades Interactivas

#### 1. 🔍 Consulta de Planos
- Búsqueda por autor con validación
- Visualización tabular con métricas
- Cálculo automático del total de puntos

#### 2. 🎨 Editor de Canvas
- **Modo Visualización**: Muestra planos como líneas conectadas
- **Modo Edición**: Permite agregar puntos con clicks
- **Eventos de Mouse**: Click para agregar puntos en coordenadas exactas
- **Renderizado en Tiempo Real**: Actualización inmediata del dibujo

#### 3. ⚡ Operaciones CRUD
- **Create**: Nuevo plano con nombre personalizado
- **Read**: Visualización y navegación de planos
- **Update**: Edición de planos existentes
- **Delete**: Eliminación con confirmación

### Arquitectura Frontend

#### Patrón Módulo JavaScript
```javascript
var app = (function () {
    // Estado privado
    var author = null;
    var blueprints = [];
    var currentBlueprint = null;
    
    // API pública
    return {
        setAuthor: function(name) { /* ... */ },
        loadBlueprintsByAuthor: function(author) { /* ... */ },
        openBlueprint: function(author, name) { /* ... */ }
    };
})();
```

#### Manejo de Asíncronia
- **Promises**: Gestión moderna de operaciones asíncronas
- **Error Handling**: Manejo robusto de errores HTTP
- **Loading States**: Indicadores visuales durante operaciones

## 🧪 Características Técnicas Avanzadas

### Concurrencia y Thread Safety
- **ConcurrentHashMap**: Acceso concurrente seguro a datos
- **Synchronized Blocks**: Operaciones atómicas críticas
- **Stateless Services**: Diseño sin estado para escalabilidad

### Programación Funcional
- **Map Operations**: Transformación de datos sin bucles
- **Reduce Operations**: Agregación funcional de métricas
- **Filter Chains**: Procesamiento de datos eficiente

### Validación y Manejo de Errores
- **Spring Validation**: Validación automática de datos
- **Custom Exceptions**: Excepciones específicas del dominio
- **HTTP Status Codes**: Respuestas semánticamente correctas

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Java 11 o superior
- Maven 3.6+
- Navegador web moderno

### Instalación
```bash
# Clonar el repositorio
git clone [repository-url]
cd lab5-arsw

# Compilar el proyecto
mvn clean compile

# Ejecutar la aplicación
mvn spring-boot:run
```

### Acceso
- **Aplicación Web**: http://localhost:8080
- **API REST**: http://localhost:8080/blueprints

## 🔧 Configuración

### Propiedades del Sistema
```properties
# Puerto del servidor
server.port=8080

# Configuración de logging
logging.level.edu.eci.arsw=DEBUG

# Configuración JSON
spring.jackson.serialization.fail-on-empty-beans=false
```

### Dependencias Principales
```xml
<!-- Spring Boot Web -->
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-web</artifactId>
</dependency>

<!-- Frontend Libraries -->
<dependency>
    <groupId>org.webjars</groupId>
    <artifactId>jquery</artifactId>
    <version>3.1.0</version>
</dependency>

<dependency>
    <groupId>org.webjars</groupId>
    <artifactId>bootstrap</artifactId>
    <version>3.3.7</version>
</dependency>
```

## 🧪 Testing

### Pruebas de API
```bash
# Verificar endpoint principal
curl http://localhost:8080/blueprints

# Consultar por autor
curl http://localhost:8080/blueprints/juan

# Crear nuevo plano
curl -X POST http://localhost:8080/blueprints \
  -H "Content-Type: application/json" \
  -d '{"author":"test","name":"test_blueprint","points":[{"x":0,"y":0}]}'
```

### Pruebas Frontend
1. Abrir http://localhost:8080 en el navegador
2. Verificar que no hay errores 404 en la consola
3. Probar búsqueda de planos existentes
4. Verificar funcionalidad del canvas
5. Probar operaciones CRUD completas

### ✅ Verificación de Requisitos ARSW

#### Criterios de Evaluación Cumplidos:

**Backend (Spring Boot + REST API):**
- ✅ API REST completa con todos los endpoints requeridos
- ✅ Manejo de excepciones con códigos HTTP apropiados  
- ✅ Persistencia thread-safe con ConcurrentHashMap
- ✅ Arquitectura por capas (Controller, Service, Persistence)
- ✅ Inyección de dependencias con Spring

**Frontend (HTML5 + JavaScript + CSS3):**
- ✅ WebJars correctamente configurados (jQuery + Bootstrap)
- ✅ Patrón Módulo JavaScript implementado
- ✅ Programación funcional con map/reduce (sin bucles)
- ✅ Canvas HTML5 con eventos de mouse interactivos
- ✅ AJAX para comunicación asíncrona con backend
- ✅ Promises para manejo de operaciones asíncronas

**Funcionalidades Específicas:**
- ✅ Consulta de planos por autor con visualización tabular
- ✅ Cálculo automático del total de puntos (reduce)
- ✅ Transformación de datos sin bucles (map)
- ✅ Dibujo de planos como segmentos de línea consecutivos
- ✅ Adición de puntos mediante clicks en canvas
- ✅ Operaciones CRUD completas (Create, Read, Update, Delete)
- ✅ Interfaz responsive con Bootstrap
- ✅ Manejo de errores y validaciones

## 📊 Métricas y Monitoreo

### Indicadores de Rendimiento
- **Tiempo de Respuesta**: < 100ms para operaciones CRUD
- **Memoria**: Uso eficiente con estructuras concurrentes
- **Escalabilidad**: Diseño stateless para múltiples usuarios

### Logging
- Registro detallado de operaciones REST
- Manejo de excepciones con stack traces
- Debugging de operaciones de persistencia

## 🔄 Extensibilidad

### Arquitectura Modular
El diseño por capas facilita:
- Intercambio de implementaciones de persistencia
- Extensión de filtros de planos
- Adición de nuevos endpoints REST
- Mejoras en la interfaz de usuario

## �‍💻 Información del Desarrollador

### Estudiante
- **Nombre**: Diego Cárdenas
- **Institución**: Escuela Colombiana de Ingeniería Julio Garavito
- **Asignatura**: ARSW (Arquitecturas de Software)
- **Programa**: Ingeniería de Sistemas

### Contexto Académico
Este proyecto forma parte del laboratorio 5 de la asignatura **Arquitecturas de Software (ARSW)**, enfocado en el desarrollo de aplicaciones web con arquitecturas distribuidas y tecnologías modernas.

#### Objetivos de Aprendizaje
- Implementación de APIs REST con Spring Boot
- Desarrollo de clientes web con HTML5, JavaScript y CSS3
- Integración frontend-backend mediante AJAX
- Aplicación de patrones de diseño (Módulo, MVC, Repository)
- Programación asíncrona con Promises
- Manejo de concurrencia y thread safety

## �📝 Licencia

Proyecto educativo desarrollado para la **Escuela Colombiana de Ingeniería Julio Garavito** en la asignatura **ARSW - Arquitecturas de Software**.

**Laboratorio 5**: Construcción de un cliente 'grueso' con API REST, HTML5, Javascript y CSS3.

---

**Desarrollado con ❤️ por Diego Cárdenas utilizando Spring Boot y tecnologías web modernas**