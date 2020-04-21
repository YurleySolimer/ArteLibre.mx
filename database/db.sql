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
    apellido VARCHAR(100) NOT NULL

);

CREATE TABLE artistas (
	id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	biografia TEXT,
	categoria ENUM ('Fotografia', 'Escultura', 'Pintura', 'Otro') DEFAULT 'Pintura',
	tecnica VARCHAR(50),
	ultima_obra VARCHAR(250) DEFAULT 'N/A',
	inicio VARCHAR(110),
	ubicacion VARCHAR(110),
	estilos VARCHAR(110)
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
    artista_id INT (11) DEFAULT 0
);

CREATE TABLE fotosObras (
	id INT(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	fotoNombre VARCHAR (300),
	fotoUbicacion VARCHAR (300),
    obra_id INT (11),
	CONSTRAINT fk_obra FOREIGN KEY  (obra_id) REFERENCES obras(id)
);