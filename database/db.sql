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
	foto_ubicacion VARCHAR 

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
	WHERE u.id = a.user_id
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
    precio INT (50),
	descripcion TEXT,
    artista_id INT (11) DEFAULT 0,
	fecha_creacion timestamp DEFAULT current_timestamp;
	CONSTRAINT fk_artista2 FOREIGN KEY  (artista_id) REFERENCES artistas(id)

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
SELECT o.id, o.nombreObra, o.coleccion, o.lugarCreacion, o.descripcion, o.tecnica, o.fecha_creacion, o.estilo, o.ancho, o.alto, o.subastar, o.copias, o.precio, o.artista_id,
		a.pais, a.region, a.provincia, a.años_experiencia, a.direccion, a.disciplina_principal,a.disciplina_sec, a.biografia, a.frase,
		u.email, u.telefono, u.nombre, u.apellido, u.foto_nombre, u.foto_ubicacion,
		f.fotoNombre, f.fotoUbicacion, f.principal
FROM obras o 
JOIN fotosObras f ON f.obra_id = o.id AND f.principal = 'True'
JOIN artistas a ON a.id = o.artista_id
JOIN users u ON u.id = a.user_id
;

