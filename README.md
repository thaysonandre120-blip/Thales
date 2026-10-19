J. Thales Pinturas — Site institucional

Site institucional da J. Thales Pinturas, empresa de pintura de Itajaí, SC, que atende Itajaí e região.

Endereço: https://www.thalespinturas.com.br

O site apresenta a empresa, seus serviços (pintura residencial, predial e comercial, aplicação de pedras naturais, revitalização, limpeza pós-obra e limpeza de vidros em altura), obras realizadas, avaliações de clientes e os canais de contato, com atendimento direto pelo WhatsApp.

Tecnologias

Projeto estático, sem framework e sem etapa de build:

HTML5 semântico
CSS3 (layout responsivo, mobile first)
JavaScript puro (sem bibliotecas)
Hospedagem na Vercel, com publicação automática a partir deste repositório
Estrutura do projeto
.
├── index.html          # Página única (todas as seções)
├── css/
│   └── style.css       # Estilos do site
├── js/
│   ├── main.js         # Comportamentos (menu, rolagem, efeitos)
│   └── config.js       # Textos e contatos editáveis (WhatsApp, links, etc.)
├── images/             # Fotos do site (hero, sobre, obras)
├── videos/             # Vídeos do banner e da seção de mensagem
└── public/             # Cópia dos arquivos de mídia (não é usada na publicação)

O site é publicado a partir da raiz do repositório. Os caminhos no código começam com / (por exemplo, /images/hero.jpg), e não com /public/.

Na raiz também existem arquivos de verificação de propriedade para ferramentas de busca (veja Verificações de busca). Não os remova.

Seções da página
Cabeçalho fixo com menu (Sobre, Serviços, Obras, Região, Contato) e botão de WhatsApp
Banner principal com vídeo
Faixa de credibilidade
Sobre
Serviços
Obras (galeria)
Mensagem institucional com vídeo de fundo
Avaliações
Região de atendimento
Contato
Rodapé (Instagram e YouTube)
Decisões de design
Visual institucional e sóbrio, inspirado em sites de grandes empresas da região
Paleta em verde esmeralda e tons terrosos, com azul-água apenas como detalhe
Cantos retos (border-radius: 0)
Foco em celular: a maior parte dos acessos vem de smartphones
Sem preços no site: o contato é direcionado ao WhatsApp
Botão de WhatsApp apenas no cabeçalho e na seção Contato, sem repetição de chamadas para orçamento ao longo da página
Fotos de obras em preto e branco leve, que ganham cor ao passar o mouse ou tocar
Animações discretas, sem animação de abertura
Como rodar localmente

Não é preciso instalar nada.

Abra a pasta do projeto no Antigravity ou no VS Code.
Instale a extensão Live Server.
Clique com o botão direito em index.html e escolha Open with Live Server.

Também é possível abrir o index.html diretamente no navegador (dois cliques no arquivo).

Como editar o conteúdo
O que mudar	Onde
Número de WhatsApp, links de Instagram e YouTube, textos e depoimentos	js/config.js (confira os nomes das constantes dentro do arquivo)
Estrutura e textos das seções	index.html
Cores, fontes e espaçamentos	css/style.css
Fotos	images/
Vídeos	videos/

Para trocar uma imagem: substitua o arquivo mantendo o mesmo nome, ou altere o caminho no index.html. Use nomes simples, sem espaços nem acentos, e atenção às maiúsculas e minúsculas (Hero.jpg e hero.jpg são arquivos diferentes na Vercel).

Recomendações para mídia:

Fotos: JPG ou WebP, de preferência até 300 a 500 KB cada
Vídeos: MP4 sem áudio, de preferência até 2 a 3 MB
Publicação (deploy)

O repositório está conectado à Vercel. Cada push na branch main gera uma nova publicação em cerca de 1 a 2 minutos.

Configuração do projeto na Vercel:

Campo	Valor
Framework Preset	Other
Build Command	vazio
Install Command	vazio
Output Directory	raiz (.)

Se o site abrir com erro 404 mesmo com o deploy concluído, confira essas configurações. Em projeto sem build, a Vercel pode tentar servir a pasta public em vez da raiz.

Fluxo de trabalho recomendado
bash
# trabalhar numa branch separada
git switch -c nome-da-alteracao

# ... editar, testar ...

git add .
git commit -m "descrição da alteração"

# publicar: juntar na main e enviar
git switch main
git merge nome-da-alteracao
git push

Links com letras e números aleatórios gerados pela Vercel (por exemplo, thales-xxxxx-....vercel.app) são de uso interno e pedem login. Para acessar o site, use sempre o endereço do domínio.

Domínio
Domínio: thalespinturas.com.br, registrado no Registro.br
DNS: servidores do próprio Registro.br
Registros usados: A para thalespinturas.com.br e CNAME para www, apontando para a Vercel
thalespinturas.com.br redireciona para www.thalespinturas.com.br
Certificado SSL (HTTPS) emitido automaticamente pela Vercel
A renovação do domínio é anual
Verificações de busca

Estes itens comprovam a propriedade do site nas ferramentas de busca e não devem ser removidos:

Ferramenta	Método	Onde fica
Google Search Console	Arquivo HTML	Arquivo google...html, na raiz do projeto
Bing Webmaster Tools	Meta tag msvalidate.01	Dentro do <head> do index.html
Em desenvolvimento
Assistente virtual "Cobalto" (chat com IA sobre tintas, pintura e serviços da empresa), em uma branch separada (cobalto), ainda não publicado. Ele usa uma função serverless da Vercel (api/chat.js) e exige variáveis de ambiente configuradas no painel da Vercel. Nunca versione chaves de API ou arquivos .env.
Segurança
Não commitar chaves, senhas ou arquivos .env
Este repositório é público: não inclua dados pessoais, valores contratuais ou informações sigilosas em arquivos ou mensagens de commit
Créditos

Desenvolvido por Thayson André dos Santos para a J. Thales Pinturas.

© 2026 J. Thales Pinturas. Todos os direitos reservados.
