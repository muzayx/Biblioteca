<?php
header('Content-Type: application/json');
error_reporting(E_ALL);
ini_set('display_errors', 1);

$host = 'localhost';
$db   = 'biblioteca';
$user = 'root';
$pass = '';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
];

function respondWithError($message) {
    echo json_encode(['error' => $message]);
    exit;
}

try {
    $pdo = new PDO($dsn, $user, $pass, $options);
} catch (\PDOException $e) {
    respondWithError('Conexão com o banco de dados falhou: ' . $e->getMessage());
}

$action = $_GET['action'] ?? $_POST['action'] ?? '';

function formatarData($data) {
    if (!$data) return 'Data inválida';
    $timestamp = strtotime($data);
    return $timestamp ? date('d/m/Y', $timestamp) : 'Data inválida';
}

switch ($action) {
    case 'getLivrosDisponiveis':
        try {
            $stmt = $pdo->query("SELECT * FROM livros WHERE disponivel = 1");
            echo json_encode($stmt->fetchAll());
        } catch (\PDOException $e) {
            respondWithError('Erro ao buscar livros disponíveis: ' . $e->getMessage());
        }
        break;

    case 'getLivrosAlugados':
        try {
            $stmt = $pdo->query("SELECT a.id, l.id as livro_id, l.titulo, a.leitor, a.data_aluguel, a.data_devolucao,
                                 CASE WHEN a.data_devolucao < CURDATE() THEN 'Atrasado' ELSE 'No prazo' END AS status
                                 FROM alugueis a 
                                 JOIN livros l ON a.livro_id = l.id 
                                 WHERE a.devolvido = 0");
            $livros = $stmt->fetchAll();
            foreach ($livros as &$livro) {
                $livro['data_aluguel'] = formatarData($livro['data_aluguel']);
                $livro['data_devolucao'] = formatarData($livro['data_devolucao']);
            }
            echo json_encode($livros);
        } catch (\PDOException $e) {
            respondWithError('Erro ao buscar livros alugados: ' . $e->getMessage());
        }
        break;

        case 'buscarLivros':
            try {
                $termo = '%' . $_GET['termo'] . '%';
                $stmt = $pdo->prepare("
                    SELECT l.*, 
                           CASE WHEN a.id IS NULL THEN 1 ELSE 0 END AS disponivel,
                           a.data_devolucao,
                           CASE WHEN a.data_devolucao < CURDATE() THEN 'Atrasado' ELSE 'No prazo' END AS status
                    FROM livros l
                    LEFT JOIN alugueis a ON l.id = a.livro_id AND a.devolvido = 0
                    WHERE l.titulo LIKE ? OR l.autor LIKE ? OR l.genero LIKE ?
                    ORDER BY disponivel DESC, l.titulo ASC
                ");
                $stmt->execute([$termo, $termo, $termo]);
                $livros = $stmt->fetchAll();
                foreach ($livros as &$livro) {
                    $livro['data_devolucao'] = $livro['data_devolucao'] ? formatarData($livro['data_devolucao']) : null;
                }
                echo json_encode($livros);
            } catch (\PDOException $e) {
                respondWithError('Erro ao buscar livros: ' . $e->getMessage());
            }
            break;

    case 'alugarLivro':
        $livro_id = $_POST['livro_id'];
        $leitor = $_POST['leitor'];
        $data_devolucao = $_POST['data_devolucao'];
        
        $pdo->beginTransaction();
        try {
            $stmt = $pdo->prepare("INSERT INTO alugueis (livro_id, leitor, data_aluguel, data_devolucao) VALUES (?, ?, CURDATE(), ?)");
            $stmt->execute([$livro_id, $leitor, $data_devolucao]);
            
            $stmt = $pdo->prepare("UPDATE livros SET disponivel = 0 WHERE id = ?");
            $stmt->execute([$livro_id]);
            
            $pdo->commit();
            echo json_encode(['success' => true]);
        } catch (\Exception $e) {
            $pdo->rollBack();
            respondWithError('Erro ao alugar livro: ' . $e->getMessage());
        }
        break;

    case 'adicionarLivro':
        $titulo = $_POST['titulo'];
        $autor = $_POST['autor'];
        $genero = $_POST['genero'];
        
        try {
            $stmt = $pdo->prepare("INSERT INTO livros (titulo, autor, genero, disponivel) VALUES (?, ?, ?, 1)");
            $stmt->execute([$titulo, $autor, $genero]);
            echo json_encode(['success' => true]);
        } catch (\PDOException $e) {
            respondWithError('Erro ao adicionar o livro: ' . $e->getMessage());
        }
        break;

    case 'getLivroPorId':
        $id = $_GET['id'];
        try {
            $stmt = $pdo->prepare("SELECT * FROM livros WHERE id = ?");
            $stmt->execute([$id]);
            $livro = $stmt->fetch();
            if ($livro) {
                echo json_encode($livro);
            } else {
                echo json_encode(null);
            }
        } catch (\PDOException $e) {
            respondWithError('Erro ao buscar o livro: ' . $e->getMessage());
        }
        break;

    case 'editarLivro':
        $id = $_POST['id'];
        $titulo = $_POST['titulo'];
        $autor = $_POST['autor'];
        $genero = $_POST['genero'];
        
        try {
            $stmt = $pdo->prepare("UPDATE livros SET titulo = ?, autor = ?, genero = ? WHERE id = ?");
            $stmt->execute([$titulo, $autor, $genero, $id]);
            echo json_encode(['success' => true]);
        } catch (\PDOException $e) {
            respondWithError('Erro ao editar o livro: ' . $e->getMessage());
        }
        break;

    case 'deletarLivro':
        $id = $_POST['id'];
        
        try {
            $stmt = $pdo->prepare("DELETE FROM livros WHERE id = ?");
            $stmt->execute([$id]);
            echo json_encode(['success' => true]);
        } catch (\PDOException $e) {
            respondWithError('Erro ao deletar o livro: ' . $e->getMessage());
        }
        break;

    case 'devolverLivro':
        $id = $_POST['id'];
        
        try {
            $pdo->beginTransaction();
            
            $stmt = $pdo->prepare("DELETE FROM alugueis WHERE id = ?");
            $stmt->execute([$id]);
            
            $stmt = $pdo->prepare("UPDATE livros SET disponivel = 1 WHERE id = (SELECT livro_id FROM alugueis WHERE id = ?)");
            $stmt->execute([$id]);
            
            $pdo->commit();
            echo json_encode(['success' => true]);
        } catch (\PDOException $e) {
            $pdo->rollBack();
            respondWithError('Erro ao devolver o livro: ' . $e->getMessage());
        }
        break;

    case 'getDashboardData':
        try {
            $total_livros = $pdo->query("SELECT COUNT(*) FROM livros")->fetchColumn();
            $livros_alugados = $pdo->query("SELECT COUNT(*) FROM alugueis WHERE devolvido = 0")->fetchColumn();
            $leitores_ativos = $pdo->query("SELECT COUNT(DISTINCT leitor) FROM alugueis WHERE devolvido = 0")->fetchColumn();
            $livros_atrasados = $pdo->query("SELECT COUNT(*) FROM alugueis WHERE devolvido = 0 AND data_devolucao < CURDATE()")->fetchColumn();
            
            echo json_encode([
                'total_livros' => $total_livros,
                'livros_alugados' => $livros_alugados,
                'leitores_ativos' => $leitores_ativos,
                'livros_atrasados' => $livros_atrasados
            ]);
        } catch (\PDOException $e) {
            respondWithError('Erro ao buscar dados do dashboard: ' . $e->getMessage());
        }
        break;

    default:
        respondWithError('Ação não reconhecida');
        break;
}