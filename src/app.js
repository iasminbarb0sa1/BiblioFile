import express from "express";
import mysql from "mysql2/promise";
import cors from "cors"; 

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const pool = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "senai",
  database: "bibliofile",
});

app.get("/api/livros", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT l.id_livro, l.titulo, l.autor, g.nome_genero AS genero,
             SUM(le.nota)/COUNT(le.id_leitura) AS media_nota,
             SUM(le.tempo_leitura_horas) AS total_horas
      FROM livros l
      LEFT JOIN generos g ON l.id_genero = g.id_genero
      LEFT JOIN leituras le ON l.id_livro = le.id_livro
      GROUP BY l.id_livro
      ORDER BY l.id_livro DESC
    `);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar livros" });
  }
});


app.post("/api/livros", async (req, res) => {
  const { titulo, autor, genero, paginas, tempoLeitura, nota, comentario } = req.body;

  if (!titulo || !autor) return res.status(400).json({ error: "Título e autor são obrigatórios" });

try{
    let id_genero = null;
    if (genero) {
      const [rows] = await pool.query("SELECT id_genero FROM generos WHERE nome_genero = ?", [genero]);
      if (rows.length > 0) id_genero = rows[0].id_genero;
    }

    // 2️⃣ Inserir livro
    const [resultLivro] = await pool.query(
      "INSERT INTO livros (titulo, autor, id_genero, total_paginas) VALUES (?, ?, ?, ?)",
      [titulo, autor, id_genero, paginas || null]
    );

    await pool.query(
      "INSERT INTO leituras (id_usuario, id_livro, tempo_leitura_horas, nota, resenha) VALUES (1, ?, ?, ?, ?)",
      [resultLivro.insertId, tempoLeitura || null, nota || null, comentario || null]
    );

    res.status(201).json({ message: "Livro registrado com sucesso!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao adicionar livro" });
  }
});

app.delete("/api/livros/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query("DELETE FROM leituras WHERE id_livro = ?", [id]);
    await pool.query("DELETE FROM livros WHERE id_livro = ?", [id]);
    res.json({ message: "Livro excluído com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao excluir livro" });
  }
});

app.listen(PORT, () => console.log(` Servidor rodando em http://localhost:${PORT}`));
