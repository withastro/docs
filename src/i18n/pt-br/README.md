# Guia PT-BR de Tradução do Astro

Este guia foi feito pelo core maintainer [@Yan-Thomas](https://github.com/Yan-Thomas) para auxiliar contribuidores dessa tradução. Sinta-se livre para se juntar a nós nosso [grupo do Discord](https://astro.build/chat) para fazer perguntas, sugestões, etc.

## Princípios da tradução

- **Manter a intenção do escritor original:** Ao máximo possível, adaptar frases de forma com que o seu tom e direcionamento se alinhem com o que foi escrito na versão inglesa. Na documentação do Astro temos vários exemplos de frases com uma tonalidade amigável e divertida para tornar a leitura um pouco mais “humana”, e trazer isso à versão brasileira é algo importante.

- **Priorizar a fácil compreensão:** Em contrapartida ao primeiro princípio, adaptar um texto para outra língua não é fácil, e muitas vezes precisamos negociar entre uma tradução fiel e uma que seja facilmente compreensível. Portanto, às vezes se torna necessário omitir algum termo e substituí-lo por sua explicação, por exemplo. Também há uma preocupação no vocabulário utilizado, que deve manter-se o mais simples e conciso possível, mantendo distância de uma “verborragia não ortodoxa”. Tradução, assim como a produção de filmes baseados em livros, é um processo de adaptação e é nada mais do que esperado que mudanças ocorram ao texto original quando necessário.

- **Inspirar-se em outras traduções relevantes:** É valioso manter-se atento em outras traduções e se basear nelas. Isso é especialmente importante quando estamos traduzindo termos, pois precisamos tomar uma decisão informada sobre o quão fácil é compreender um termo traduzido, e se ao menos, esse termo já foi traduzido da mesma forma anteriormente. Visitar a documentação técnica traduzida de algumas tecnologias como [TypeScript](https://www.typescriptlang.org/pt/docs/), [Vue.js](https://pt.vuejs.org/guide/introduction.html) e a [MDN](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript) em português são ótimas fontes para tomar esse tipo de decisão. Também é super válido conferir blogs brasileiros no assunto que está sendo traduzido e ver como o escritor lida com os jargões e outros termos.


## Padrões

Para manter uma tradução concisa e consistente, alguns padrões são recomendados:

### Links

Links para páginas externas, caso possuam versão em português, como os diversos links da MDN, devem ter sua URL atualizada para ir diretamente na versão em português. Caso contrário, se mantém a URL para a página em inglês. Caso o link se referia a um título da página que não existe na tradução, opte pelo link original.

Já links a páginas da própria documentação do Astro devem ter “/en” substituído por “/pt-BR” em todos os casos. Inclusive, links que se encaminham a um título específico também precisam ter seus IDs automáticos substituídos pela versão em português. Para obter o ID específico de um cabeçalho da página, clique no link de navegação na barra lateral direita para o título específico e então a URL da página terá o ID que você está procurando por.

Caso a página que o link leva ainda não tenha sido traduzida, apenas não modifique o ID de cabeçalho (caso possua). Quando esta página for traduzida, o sistema de CI irá notificar que os links em questão estão quebrados, e caso você seja a pessoa traduzindo uma página que foi linkada anteriormente, adicione essas modificações as outras páginas como parte do seu PR.

Exemplo:
```md
⚙️ Our [Installation Guide](/en/install/auto/)
```

Deve ser traduzido como:
```md
⚙️ Nosso [Guia de Instalação](/pt-BR/install/auto/)
```


### Imagens

Imagens devem ser mantidas em sua URL original com texto em inglês, porém entre os colchetes, que representam o texto alternativo da imagem, uma descrição deve ser adicionada para a imagem ser explicativa a usuários de leitores de tela.

Exemplo:
```md
![diagram](https://res.cloudinary.com/wedding-website/image/upload/v1596766231/islands-architecture-1.png)
```

Deve ser traduzido como:
```md
![Diagrama da estrutura de uma arquitetura em ilha, com seções de conteúdo estático e seções em destaque representando os componentes que serão hidratados, sendo eles o cabeçalho, o carrossel de imagens e uma barra lateral](https://res.cloudinary.com/wedding-website/image/upload/v1596766231/islands-architecture-1.png)
```

### Código

Comentários, componentes de exemplo, variáveis, caminhos de arquivos e outros devem ser traduzidos caso não sejam parte da API do Astro, JavaScript ou outras bibliotecas. Isso tem a intenção de tornar os códigos de exemplo o menos restritivo possível para leitores com menor proficiência em inglês, levando em conta que parte fundamental de entender algumas páginas é ver os códigos de exemplo e os comentários que vem junto.

Exemplo:
```astro
---
// Example: src/pages/index.astro
import MySiteLayout from '../layouts/MySiteLayout.astro';
---
<MySiteLayout>
  <p>My page content, wrapped in a layout!</p>
</MySiteLayout>
```

Deve ser traduzido como:
```astro
---
// Exemplo: src/pages/index.astro
import LayoutDoMeuSite from '../layouts/LayoutDoMeuSite.astro';
---
<LayoutDoMeuSite>
  <p>Conteúdo da minha página, envolto em um layout!</p>
</LayoutDoMeuSite>
```

## Glossário

Tabela com a versão original e tradução (se houver) para diversos termos encontrados na documentação:

| Original                            | Tradução                                |
| ----------------------------------- | --------------------------------------- |
| build/build time/build process      | build/processo de build/tempo de build  |
| client side script                  | script no lado do cliente               |
| server side rendering (SSR)         | renderização no lado do servidor (SSR)  |
| client side rendering               | renderização no lado do cliente         |
| template                            | \-                                      |
| bundle/bundling                     | \-                                      |
| CSS Modules                         | Módulos CSS                             |
| hoisting/hoisted                    | \-                                      |
| playgrounds                         | \-                                      |
| runtime                             | \-                                      |
| run/running                         | executar/executando                     |
| Partial Hydration                   | Hidratação Parcial                      |
| frontend/backend                    | \-                                      |
| Islands Architecture                | Arquitetura em Ilhas                    |
| Intellisense                        | \-                                      |
| UI frameworks                       | frameworks de UI                        |
| Integrations                        | Integrações                             |
| built-in                            | Integrado                               |
| assets                              | \-                                      |
| static                              | estático                                |
| dynamic                             | dinâmico                                |
| reference                           | referência                              |
| hook                                | \-                                      |
| deploy                              | \-                                      |
| NPM packages                        | pacotes do NPM                          |
| project structure                   | estrutura de projetos                   |
| layout                              | \-                                      |
| Data Fetching                       | Busca de Dados                          |
| third-party                         | de terceiros                            |
| directive                           | diretiva                                |
| adapter                             | adaptador                               |
| CLI                                 | interface de linha de comando           |
| helpers                             | \-                                      |
| API endpoints                       | endpoints de API                        |
| RSS feeds                           | feeds RSS                               |
| package manager                     | gerenciador de pacotes                  |
| stylesheet                          | folha de estilos                        |
| deprecated                          | descontinuado                           |
| entrypoint                          | \-                                      |
| demo                                | demonstração                            |
| namespace                           | \-                                      |
| log                                 | \-                                      |
| serverless                          | \-                                      |
| output                              | saída/resultado final                   |
| routing                             | roteamento                              |
| absolute url path                   | URL de caminho absoluto                 |
| top-level                           | \-                                      |
| debugging                           | depuração                               |
| setup                               | configuração/instalação                 |
| sitemap                             | \-                                      |
| syntax highlight/syntax highlighter | \-                                      |
| query                               | \-                                      |
| frontmatter                         | \-                                      |
| string                              | ?                                       |
| streaming                           | \-                                      |
| tag/tags                            | \-                                      |
| middleware                          | \-                                      |
| flag                                | \-                                      |
| opt-in                              | optar em/optar por                      |
| opt-out                             | optar em não/optar por sair             |
| metadata                            | metadados                               |
| cheatsheet                          | \-                                      |
| callback                            | \-                                      |
| pipeline                            | \-                                      |