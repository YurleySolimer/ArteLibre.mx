--alter user 'root'@'localhost' identified with mysql_native_password by 'CaramitiE.23'


drop database database_artelibre;
CREATE DATABASE database_artelibre;
use database_artelibre;

CREATE TABLE users (
	id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	email VARCHAR(50) NOT NULL,
	password VARCHAR(200) NOT NULL,
	tipo ENUM ('Admin', 'Cliente', 'Artista') DEFAULT 'Cliente',
	nombre VARCHAR(100) NOT NULL,
	telefono VARCHAR(50),
    apellido VARCHAR(100) NOT NULL,
	foto_nombre VARCHAR(100),
	foto_ubicacion VARCHAR (200)

);

CREATE TABLE clientes (
	id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	pais VARCHAR(40),
	region VARCHAR (50),
	provincia VARCHAR (50), 
	fecha_nacimiento datetime,
	direccion VARCHAR (120), 
	user_id INT (11),
	CONSTRAINT fk_usuario1 FOREIGN KEY  (user_id) REFERENCES users(id)
);

CREATE TABLE artistas (
	id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	pais VARCHAR(40),
	region VARCHAR (50),
	provincia VARCHAR (50), 
	años_experiencia INT (11),
	direccion VARCHAR (120),
	disciplina_principal VARCHAR (50),
	disciplina_sec VARCHAR (50), 
	biografia TEXT,
	frase TEXT,
	user_id INT (11),
	CONSTRAINT fk_usuario2 FOREIGN KEY  (user_id) REFERENCES users(id)
);

CREATE VIEW usuarioArtista AS ( 
	SELECT a.pais, a.region, a.provincia, a.años_experiencia, a.direccion, a.disciplina_principal,a.disciplina_sec, a.biografia, a.frase,
		   u.email, u.telefono, u.nombre, u.apellido, u.foto_nombre, u.foto_ubicacion, u.id
	FROM artistas a
	JOIN users u 
	ON u.id = a.user_id
); 

CREATE TABLE obras (
	id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	nombreObra VARCHAR(150),
	coleccion VARCHAR(250) DEFAULT 'N/A',
	lugarCreacion VARCHAR(50),
	tecnica VARCHAR(250),
	estilo VARCHAR(110),
	ancho INT(11),
	alto INT (20),
	subastar ENUM ('Si', 'No') DEFAULT 'No',
	copias ENUM ('Si', 'No') DEFAULT 'No',
	en_venta ENUM ('Si', 'No') DEFAULT 'No',
    precio INT (50),
	descripcion TEXT,
    artista_id INT (11) DEFAULT 0,
	fecha_creacion timestamp DEFAULT current_timestamp,
	coleccion_id INT(11) DEFAULT 0,
	CONSTRAINT fk_artista2 FOREIGN KEY  (artista_id) REFERENCES artistas(id)

);


CREATE TABLE colecciones (
	id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	nombreColeccion VARCHAR (250),
	anio INT (11),
	descripcion TEXT,
	tecnica VARCHAR (250),
	estilo VARCHAR (250),
	ciudad VARCHAR (200),
	pais VARCHAR (200),
	artista_id INT (11),
	fotoNombre VARCHAR (300) DEFAULT 'false',
	CONSTRAINT fk_artista3 FOREIGN KEY  (artista_id) REFERENCES artistas(id)

);

CREATE TABLE fotosObras (
	id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	fotoNombre VARCHAR (300),
	fotoUbicacion VARCHAR (300),
    obra_id INT (11),
	principal ENUM ('true', 'false') DEFAULT 'false',
	CONSTRAINT fk_obras2 FOREIGN KEY  (obra_id) REFERENCES obras(id)
);

CREATE VIEW obraCompleta AS
SELECT o.id, o.nombreObra, o.en_venta, o.coleccion, o.coleccion_id, o.lugarCreacion, o.descripcion, o.tecnica, o.fecha_creacion, o.estilo, o.ancho, o.alto, o.subastar, o.copias, o.precio, o.artista_id,
		a.pais, a.region, a.provincia, a.años_experiencia, a.direccion, a.disciplina_principal,a.disciplina_sec, a.biografia, a.frase,
		u.email, u.telefono, u.nombre, u.apellido, u.foto_nombre, u.foto_ubicacion,
		f.fotoNombre, f.fotoUbicacion, f.principal
FROM obras o 
JOIN fotosObras f ON f.obra_id = o.id AND f.principal = 'True'
JOIN artistas a ON a.id = o.artista_id
JOIN users u ON u.id = a.user_id
;


CREATE TABLE ResetTokens (
  id int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
  email varchar(255) DEFAULT NULL,
  token varchar(255) DEFAULT NULL,
  expiration datetime DEFAULT NULL,
  createdAt datetime,
  updatedAt datetime,
  used int(11) NOT NULL DEFAULT '0'
);








-- THIS IS NEW

ALTER TABLE obras 
modify fecha_creacion year default '2020';


CREATE TABLE eventos (
	id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	nombre VARCHAR(150),
	titulo VARCHAR(250) DEFAULT 'N/A',
	organizadores INT (11),
	hora_inicio TIME DEFAULT '00:00',
	fecha_inicio timestamp DEFAULT '2020-01-01',
	fecha_fin timestamp DEFAULT '2020-12-31',
	dir_local VARCHAR(50),
	direccion VARCHAR(50),
	ciudad VARCHAR(50),
	pais VARCHAR(50),
	piezas INT(11),
	estilo VARCHAR (50),
	descripcion TEXT,
    artista_id INT (11) DEFAULT 0,
	CONSTRAINT fk_artista4 FOREIGN KEY  (artista_id) REFERENCES artistas(id)
);

CREATE TABLE fotosEventos (
	id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	fotoNombre VARCHAR (300),
	fotoUbicacion VARCHAR (300),
    evento_id INT (11),
	principal ENUM ('true', 'false') DEFAULT 'false',
	CONSTRAINT fk_evento FOREIGN KEY  (evento_id) REFERENCES eventos(id)
);

CREATE VIEW eventoCompleto AS
SELECT 	e.id, e.nombre, e.titulo, e.organizadores, e.hora_inicio, e.fecha_inicio, e.fecha_fin, e.dir_local, e.direccion, e.ciudad, e.pais, e.piezas, e.estilo, e.descripcion, e.artista_id,
		a.pais as paisArtis, a.region, a.provincia, a.años_experiencia, a.direccion as dirArtist, a.disciplina_principal,a.disciplina_sec, a.biografia, a.frase,
		u.email, u.telefono, u.nombre as nombreArtist, u.apellido, u.foto_nombre, u.foto_ubicacion, u.id AS userID,
		f.fotoNombre, f.fotoUbicacion, f.principal
FROM eventos e 
JOIN fotosEventos f ON f.evento_id = e.id AND f.principal = 'True'
JOIN artistas a ON a.id = e.artista_id
JOIN users u ON u.id = a.user_id
;

CREATE TABLE subastasInfo (
	id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
    obra_id INT (11) DEFAULT 0,
	fecha_inicio timestamp DEFAULT '2020-01-01',
	hora_inicio TIME DEFAULT '00:00',
	hora_fin TIME DEFAULT '23:59',
	precio_base INT DEFAULT 0,
	CONSTRAINT fk_obra3 FOREIGN KEY  (obra_id) REFERENCES obras(id)
);


ALTER TABLE obras 
add destacar ENUM ('Si', 'No') default 'No';

ALTER TABLE obras 
add recomendar ENUM ('Si', 'No') default 'No';

ALTER TABLE obras 
add titulo_recomendada VARCHAR(100) DEFAULT 'Obra Recomendada';

ALTER TABLE obras 
add cantidad INT default 1;

ALTER TABLE artistas
add destacar ENUM ('Si', 'No') default 'No';

ALTER TABLE artistas
add info_destacar TEXT;

ALTER TABLE obras 
add ocultar ENUM ('Si', 'No') default 'No';

ALTER TABLE artistas
add numero_obras INT DEFAULT 0;

ALTER TABLE users 
add inactivo ENUM ('Si', 'No') default 'No';

drop view usuarioArtista;

CREATE VIEW usuarioArtista AS ( 
	SELECT a.pais, a.region, a.provincia, a.destacar, a.info_destacar, a.numero_obras, a.años_experiencia, a.direccion, a.disciplina_principal,a.disciplina_sec, a.biografia, a.frase,
		   u.email, u.telefono, u.nombre, u.apellido, u.foto_nombre, u.foto_ubicacion, u.id
	FROM artistas a
	JOIN users u 
	ON u.id = a.user_id
); 


drop view obraCompleta;

CREATE VIEW obraCompleta AS
SELECT o.id, o.nombreObra, o.en_venta, o.coleccion, o.coleccion_id, o.lugarCreacion, o.descripcion, o.tecnica, o.fecha_creacion, o.estilo, o.ancho, o.alto, o.subastar, o.copias, o.precio, o.artista_id,
		o.destacar, o.recomendar, o.cantidad, o.ocultar, o.titulo_recomendada,
		a.pais, a.region, a.provincia, a.años_experiencia, a.direccion, a.disciplina_principal,a.disciplina_sec, a.biografia, a.frase,
		u.email, u.telefono, u.nombre, u.apellido, u.foto_nombre, u.foto_ubicacion,
		f.fotoNombre, f.fotoUbicacion, f.principal
FROM obras o 
JOIN fotosObras f ON f.obra_id = o.id AND f.principal = 'True'
JOIN artistas a ON a.user_id = o.artista_id
JOIN users u ON u.id = a.user_id
;


-- THIS IS NEW II xd

ALTER TABLE colecciones
add destacar ENUM ('Si', 'No') default 'No';

ALTER TABLE colecciones
add ocultar ENUM ('Si', 'No') default 'No';

ALTER TABLE colecciones
add piezas INT DEFAULT 0;

ALTER TABLE colecciones
add precioPromedio INT DEFAULT 0;

INSERT INTO users (email, password, tipo, nombre, apellido) VALUES('noreply@artelibre.mx', '$2a$10$l75FU.VAJA9nDGtVUSTSFuNVkLc.2EN9G8gLxmr32DYwVsnoWz93i', 'Admin', 'ArteLibre', 'Admin');

CREATE VIEW coleccionArtista AS
SELECT c.id, c.nombreColeccion, c.anio, c.estilo, c.tecnica, c.pais, c.ciudad, c.descripcion, c.fotoNombre, c.destacar, c.ocultar, c.piezas, c.precioPromedio,
       u.nombre, u.apellido, a.id as artistaId
FROM colecciones c
JOIN artistas a ON a.user_id = c.artista_id
JOIN users u ON u.id = a.user_id
;

ALTER TABLE artistas
add numero_colecciones INT DEFAULT 0;

ALTER TABLE artistas
add numero_eventos INT DEFAULT 0;

drop view usuarioArtista;

CREATE VIEW usuarioArtista AS ( 
	SELECT a.pais, a.region, a.provincia, a.destacar, a.info_destacar, a.numero_obras, a.años_experiencia, a.direccion, a.id as idArtist,
		   a.disciplina_principal,a.disciplina_sec, a.biografia, a.frase, a.numero_eventos, a.numero_colecciones,
		   u.email, u.telefono, u.nombre, u.apellido, u.foto_nombre, u.foto_ubicacion, u.id, u.inactivo
	FROM artistas a
	JOIN users u 
	ON u.id = a.user_id
); 

ALTER TABLE obras
 DROP FOREIGN KEY fk_artista2;

ALTER TABLE colecciones
 DROP FOREIGN KEY fk_artista3;

ALTER TABLE eventos
 DROP FOREIGN KEY fk_artista4;

drop view obraCompleta;

CREATE VIEW obraCompleta AS
SELECT o.id, o.nombreObra, o.en_venta, o.coleccion, o.coleccion_id, o.lugarCreacion, o.descripcion, o.tecnica, o.fecha_creacion, o.estilo, o.ancho, o.alto, o.subastar, o.copias, o.precio, o.artista_id,
		o.destacar, o.recomendar, o.cantidad, o.ocultar, o.titulo_recomendada,
		a.pais, a.region, a.provincia, a.años_experiencia, a.direccion, a.disciplina_principal,a.disciplina_sec, a.biografia, a.frase,
		u.email, u.telefono, u.nombre, u.apellido, u.foto_nombre, u.foto_ubicacion,
		f.fotoNombre, f.fotoUbicacion, f.principal
FROM obras o 
JOIN fotosObras f ON f.obra_id = o.id AND f.principal = 'True'
JOIN artistas a ON a.user_id = o.artista_id
JOIN users u ON u.id = a.user_id
;


drop VIEW eventoCompleto;

CREATE VIEW eventoCompleto AS
SELECT 	e.id, e.nombre, e.titulo, e.organizadores, e.hora_inicio, e.fecha_inicio, e.fecha_fin, e.dir_local, e.direccion, e.ciudad, e.pais, e.piezas, e.estilo, e.descripcion, e.artista_id,
		a.pais as paisArtis, a.region, a.provincia, a.años_experiencia, a.direccion as dirArtist, a.disciplina_principal,a.disciplina_sec, a.biografia, a.frase,
		u.email, u.telefono, u.nombre as nombreArtist, u.apellido, u.foto_nombre, u.foto_ubicacion, u.id AS userID,
		f.fotoNombre, f.fotoUbicacion, f.principal
FROM eventos e 
JOIN fotosEventos f ON f.evento_id = e.id AND f.principal = 'True'
JOIN artistas a ON a.user_id = e.artista_id
JOIN users u ON u.id = a.user_id
;


--HEY THERE THIS IS NEW, YES, AGAIN xd

ALTER TABLE subastasInfo
add duracion INT DEFAULT 1;

ALTER TABLE subastasInfo
add descripcion TEXT;

ALTER TABLE subastasInfo
add estadoSubasta ENUM ('En espera', 'Publicada', 'En Proceso', 'Cancelada', 'Finalizada') 
DEFAULT 'En espera';

CREATE VIEW obraSubasta AS
SELECT o.id as obraId, o.nombreObra, o.en_venta, o.coleccion, o.coleccion_id, o.lugarCreacion, o.descripcion, o.tecnica, o.fecha_creacion, o.estilo, o.ancho, o.alto, o.subastar, o.copias, o.precio, o.artista_id,
		o.destacar, o.recomendar, o.cantidad, o.ocultar, o.titulo_recomendada,
		a.pais, a.region, a.provincia, a.años_experiencia, a.direccion, a.disciplina_principal,a.disciplina_sec, a.biografia, a.frase,
		u.email, u.telefono, u.nombre, u.apellido, u.foto_nombre, u.foto_ubicacion,
		f.fotoNombre, f.fotoUbicacion, f.principal,
		s.fecha_inicio, s.hora_inicio, s.hora_fin, s.precio_base, s.duracion, s.estadoSubasta, s.id, s.descripcion as subastaDescripcion
FROM obras o 
JOIN fotosObras f ON f.obra_id = o.id AND f.principal = 'True'
JOIN subastasInfo s ON s.obra_id = o.id AND o.subastar = 'Si'
JOIN artistas a ON a.user_id = o.artista_id
JOIN users u ON u.id = a.user_id
;


--- NUEVAS CONFIGURACIONES

CREATE TABLE artistStripe(
	id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	id_stripe VARCHAR (200),
	estado ENUM ('No Registrado', 'Registrado') DEFAULT 'No Registrado',
	id_user INT (11)
);

CREATE TABLE clienteCompra(
	id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	estado ENUM ('Pago', 'No Pago') DEFAULT 'No Pago',
	estadoObra ENUM ('En espera', 'Enviado', 'Recibido') DEFAULT 'En espera',
	fecha_compra TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
	id_obra INT (11),
	id_user INT (11)
);

ALTER TABLE obras 
modify en_venta ENUM ('Si', 'No') default 'Si';

ALTER TABLE obras 
add comprada ENUM ('Si', 'No') default 'No';

drop view obraCompleta;

CREATE VIEW obraCompleta AS
SELECT o.id, o.nombreObra, o.en_venta, o.coleccion, o.coleccion_id, o.lugarCreacion, o.descripcion, o.tecnica, o.fecha_creacion, o.estilo, o.ancho, o.alto, o.subastar, o.copias, o.precio, o.artista_id,
		o.destacar, o.recomendar, o.cantidad, o.ocultar, o.titulo_recomendada, o.comprada,
		a.pais, a.region, a.provincia, a.años_experiencia, a.direccion, a.disciplina_principal,a.disciplina_sec, a.biografia, a.frase,
		u.email, u.telefono, u.nombre, u.apellido, u.foto_nombre, u.foto_ubicacion,
		f.fotoNombre, f.fotoUbicacion, f.principal
FROM obras o 
JOIN fotosObras f ON f.obra_id = o.id AND f.principal = 'True'
JOIN artistas a ON a.user_id = o.artista_id
JOIN users u ON u.id = a.user_id
;


--// Newwww

ALTER TABLE obras 
add visitas INT DEFAULT 0;

ALTER TABLE artistas
add visitas INT DEFAULT 0;