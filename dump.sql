
CREATE DATABASE  bibliofile;
USE bibliofile;


CREATE TABLE  usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    senha VARCHAR(255) NOT NULL,
    foto_perfil VARCHAR(255),
    tipo_perfil ENUM('Leitor', 'Administrador') DEFAULT 'Leitor',
    media_notas DECIMAL(3,1) DEFAULT 0,
    livros_lidos INT DEFAULT 0
);


CREATE TABLE  generos (
    id_genero INT AUTO_INCREMENT PRIMARY KEY,
    nome_genero VARCHAR(100) NOT NULL
);


CREATE TABLE  livros (
    id_livro INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(200) NOT NULL,
    autor VARCHAR(150) NOT NULL,
    id_genero INT,
    total_paginas INT,
    capa_url VARCHAR(255),
    FOREIGN KEY (id_genero) REFERENCES generos(id_genero)
);


CREATE TABLE leituras (
    id_leitura INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_livro INT NOT NULL,
    tempo_leitura_horas INT,
    nota INT CHECK (nota BETWEEN 1 AND 5),
    resenha TEXT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_livro) REFERENCES livros(id_livro)
);


CREATE TABLE  interacoes (
    id_interacao INT AUTO_INCREMENT PRIMARY KEY,
    id_usuario INT NOT NULL,
    id_leitura INT NOT NULL,
    tipo ENUM('Curtir', 'Comentar', 'Recomendar', 'Discutir') NOT NULL,
    comentario TEXT,
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
    FOREIGN KEY (id_leitura) REFERENCES leituras(id_leitura)
);



INSERT INTO usuarios (nome, email, senha, media_notas, livros_lidos)
VALUES ('Maria Silva', 'maria@bibliofile.com', '123456', 4.2, 47);

INSERT INTO generos (nome_genero)
VALUES ('Fantasia'), ('Ficção Científica'), ('Romance'), ('Terror'), ('Drama'), ('Outros');

INSERT INTO livros (titulo, autor, id_genero, total_paginas)
VALUES 
('O Senhor dos Anéis', 'J.R.R. Tolkien', 1, 1216),
('Duna', 'Frank Herbert', 2, 896),
('Orgulho e Preconceito', 'Jane Austen', 3, 432);
INSERT INTO leituras (id_usuario, id_livro, tempo_leitura_horas, nota, resenha)
VALUES
(1, 1, 45, 5, 'Uma aventura épica e envolvente.'),
(1, 2, 32, 4, 'Complexo e fascinante.'),
(1, 3, 18, 5, 'Um clássico atemporal.');


INSERT INTO interacoes (id_usuario, id_leitura, tipo, comentario)
VALUES
(1, 1, 'Recomendar', 'Leitura obrigatória!'),
(1, 3, 'Discutir', 'Excelente história de amor.');
 
 select * from generos;
 