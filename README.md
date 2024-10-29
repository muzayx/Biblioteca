<h1>Sistema de Gerenciamento de Biblioteca 📚</h1>
<p>Desenvolvido por mim, este projeto é uma aplicação web em HTML, Tailwind CSS, JavaScript e PHP, que facilita a gestão de uma biblioteca. A plataforma permite visualizar livros disponíveis, verificar sua disponibilidade, e gerenciar empréstimos (quem alugou e quando). Inclui funcionalidades para adicionar, editar e remover livros, além de uma barra de busca eficiente. Com uma interface intuitiva e responsiva, o projeto visa tornar o gerenciamento da biblioteca mais prático e eficiente.</p>

<h1>Como usar?</h1>
<h3>1. Configuração da Conexão com o Banco de Dados</h3>

<p>Abra o arquivo api.php e localize as seguintes linhas:</p>

```
$host = 'localhost';
$db   = 'biblioteca';
$user = 'root';
$pass = '';
```
> [!Tip]
> <p>Primeiro campo: Substitua "localhost" pelo nome do servidor (normalmente, é localhost)</p>
> <p>Segundo campo: Não substitua "biblioteca", pois o nome do banco de dados importado, já está correto</p>
> <p>Terceiro campo: Substitua "root" pelo usuário do banco de dados</p>
> <p>Quarto campo: Substitua a senha conforme necessário (se não houver senha, deixe em branco)</p>

<h3>2. Configuração do Ambiente</h3>

<p>Mova todos os arquivos do projeto para um ambiente de desenvolvimento PHP que suporte interação com o banco de dados, como Laragon, XAMPP, ou outro servidor local de sua escolha.</p>

<h3>3. Importando o Banco de Dados</h3>

- Navegue até a pasta /db e verifique se o arquivo biblioteca.sql está presente.
- Acesse o phpMyAdmin (ou outro gerenciador de banco de dados).
- Vá para a aba Importar e selecione o arquivo biblioteca.sql dessa pasta.
- Clique em "Executar" para importar as tabelas e dados no banco de dados.

<h3>4. Iniciando o Aplicativo</h3>

<p>Após configurar o banco de dados e o ambiente, o aplicativo estará pronto para ser utilizado.</p>
