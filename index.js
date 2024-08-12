addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  const githubToken = 'token';
  const githubApiUrl = 'https://api.github.com/users/joelsinhox/repos';

  try {
    // Realiza a solicitação com o User-Agent
    const response = await fetch(githubApiUrl, {
      headers: {
        'Authorization': `token ${githubToken}`,
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    // Cria um clone da resposta para poder ler o corpo mais de uma vez
    const [responseClone, responseBody] = await Promise.all([
      response.clone(),
      response.text()
    ]);

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.statusText}`);
    }

    const repos = await responseClone.json();

    // Gerar HTML para exibir os repositórios
    let html = `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Blog do Joel</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 0; padding: 0; background-color: #f4f4f4; min-height: 100vh; display: flex; flex-direction: column; }
          .container { flex: 1; width: 80%; margin: auto; padding: 20px; }
          h1 { color: #333; text-align: center; }
          ul { list-style-type: none; padding: 0; }
          li { margin: 10px 0; }
          a { text-decoration: none; color: #1e90ff; }
          a:hover { text-decoration: underline; }
          .avatar { display: block; margin: 0 auto 20px; border-radius: 50%; width: 150px; height: 150px; object-fit: cover; }
          .social-links { text-align: center; margin: 20px 0; }
          .social-links img { width: 40px; height: 40px; margin: 0 10px; vertical-align: middle; }
          .footer { text-align: center; color: #888; font-size: 14px; background-color: #f4f4f4; padding: 10px; position: fixed; width: 100%; bottom: 0; left: 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Blog do Joel</h1>
          <img src="https://avatars.githubusercontent.com/u/20174092?v=4&size=1000" alt="Avatar" class="avatar">

          <div class="social-links">
            <a href="https://www.instagram.com/joelsilva00/" target="_blank" title="Instagram">
              <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/e/e7/Instagram_logo_2016.svg/768px-Instagram_logo_2016.svg.png" alt="Instagram">
            </a>          
            <a href="https://x.com/joelsilva001" target="_blank" title="X (Twitter)">
              <img src="https://img.freepik.com/vetores-gratis/novo-design-de-icone-x-do-logotipo-do-twitter-em-2023_1017-45418.jpg?size=338&ext=jpg&ga=GA1.1.2008272138.1723248000&semt=ais_hybrid" alt="X">
            </a>
            <a href="https://www.linkedin.com/in/joel-silva-4b0155210/" target="_blank" title="LinkedIn">
              <img src="https://t.ctcdn.com.br/IwwDh-BajTE4ZwE4zuIcvz9Q2ZY=/i490027.jpeg" alt="LinkedIn">
            </a>
            <a href="https://github.com/joelsinhox" target="_blank" title="GitHub">
              <img src="https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg" alt="GitHub">
            </a>
          </div>
          <h2>Meus Projetos</h2>
          <ul>
    `;

    repos.forEach(repo => {
      html += `
        <li>
          <a href="${repo.html_url}" target="_blank">${repo.name}</a> - ${repo.description || 'Sem descrição'}
        </li>
      `;
    });

    html += `
          </ul>
        </div>
        <div class="footer">
          <p>Powered by CloudFlare Workers | <a href="https://github.com/joelsinhox/blog" target="_blank">Github</a></p>
          <p>© <span id="currentYear"></span> Joel Blog</p>
        </div>
        <script>
          // Atualiza o ano automaticamente
          document.getElementById('currentYear').textContent = new Date().getFullYear();
        </script>
      </body>
      </html>
    `;

    return new Response(html, {
      headers: { 'content-type': 'text/html' },
    });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    return new Response('Erro ao buscar repositórios.', { status: 500 });
  }
}
