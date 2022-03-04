# Akademic

Monorepo para projetos front-end utilizando:

- Angular 12
- Nx (Workspace 13)
- Jest - JavaScript Testing Framework
- Cypress - JavaScript End-to-End Testing Framework

## Lista de apps

| App                       | Descrição                            |
| ------------------------- | ------------------------------------ |
| atividades-complementares | Sistema de atividades complementares |

## Configurações iniciais

> Garanta que seu Node esteja na versão 12 ou superior e NPM na versão 6 ou superio, para uma melhor
> compatibilidade com o Nx.

Na raíz do repositóriio execute o comando:

```shell
npm install
```

Para subir o servidor de desenvolvimento local cada projeto tem um comando específico, por exemplo:

```shell
nx serve <projeto>
```

## Comandos úteis

| COMANDO    | DESCRIÇÃO                                                                                |
| ---------- | ---------------------------------------------------------------------------------------- |
| `serve`    | Serve a aplicação na porta `4200`                                                        |
| `build`    | Faz o build da aplicação ou biblioteca                                                   |
| `test`     | Executa os testes unitários do projeto                                                   |
| `e2e`      | Executa os testes ponta-a-ponta do projeto                                               |
| `affected` | Executa algum comando somente se sua alteração teve algum impacto em determinado projeto |

## Exemplos

Serve a aplicação na porta `4200`

```shell
nx serve <projeto>
```

Executa os testes unitários do projeto

```shell
nx test <projeto>
```

Executa todos os testes unitários do projeto

```shell
nx run-many --target=test --all
```

Executa o comando de LINT somente nos projetos afetados pela sua modificação local da branch

```shell
nx affected:lint
```
