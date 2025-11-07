import express from "express";
import mysql from "mysql2/promise";

const app = express();
const PORT = 3000;

app.use(express.json());


const pool = await mysql.createPool({
  host: "localhost",
  user: "root",
  password: "senai",  
  database: "bibliofile_db",
});


app.get("/api/livros", async (req, res) => {
  try {
    const [rows] = await pool.query("SELECT * FROM livros ORDER BY id DESC");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao buscar livros" });
  }
});

app.post("/api/livros", async (req, res) => {
  try {
    const { titulo, autor, genero, paginas, tempoLeitura, nota, comentario } = req.body;
    if (!titulo || !autor) return res.status(400).json({ error: "Título e autor são obrigatórios" });

    const [result] = await pool.query(
      `INSERT INTO livros (titulo, autor, genero, paginas, tempoLeitura, nota, comentario)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [titulo, autor, genero, paginas, tempoLeitura, nota, comentario]
    );

    res.status(201).json({ id: result.insertId, titulo, autor });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao adicionar livro" });
  }
});

app.delete("/api/livros/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM livros WHERE id = ?", [id]);
    res.json({ message: "Livro excluído com sucesso" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Erro ao excluir livro" });
  }
});


app.listen(PORT, () => console.log(` Servidor rodando em http://localhost:${PORT}`));
