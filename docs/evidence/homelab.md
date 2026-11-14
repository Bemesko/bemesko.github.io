# Evidências: Homelab (bernats-homelab)

Levantado em 14/11/2026 a partir dos clones locais em `C:\dev\bernats-homelab\` e `C:\dev\grocery-ops\` e da API do GitHub. Material de apoio para o estudo de caso; não é publicado no site.

## Repositórios públicos

| Repo | O que é | Commits | Período |
|---|---|---|---|
| [bernats-homelab/2026-kubernetes](https://github.com/bernats-homelab/2026-kubernetes) | Repo central: bootstrap do k3s (Ansible) + GitOps (ArgoCD app-of-apps) | 45 | 31/10 → 12/11/2026 |
| [bernats-homelab/repotpl-k8s-app](https://github.com/bernats-homelab/repotpl-k8s-app) | Template de repo para apps do cluster (golden path) | 3 | 02/11/2026 |
| [Bemesko/grocery-ops](https://github.com/Bemesko/grocery-ops) | App real gerada do template (PWA Nuxt 4 + Postgres + OTel) | 32, 11 releases (v0.1.0 → v0.5.0) | 07/11 → 12/11/2026 |
| bernats-homelab/kubernetes-standard-services | Geração anterior: serviços padrão via ArgoCD | 30 | até 12/2025 |
| bernats-homelab/kubernetes-hosts, github-org, azure-devops-org, repotpl-terraform, azure-pipeline-templates | Gerações anteriores: hosts, Terraform da org do GitHub e do Azure DevOps | — | 01/2025 → 05/2025 |

A história mostra uma evolução de quase 2 anos (Terraform da org em 01/2025, hosts em 05/2025, serviços padrão em 12/2025) até a versão atual, reconstruída do zero em 2 semanas.

## Arquitetura (2026-kubernetes)

- **Host:** notebook antigo com Ubuntu 26.04, k3s single-node. NAS openmediavault em outro notebook.
- **Controle remoto:** o Ansible roda no WSL e chega ao notebook por SSH pela tailnet (ADR 003).
- **Ordem do playbook:** preflight → base → power → tailscale_check → k3s → cluster_bootstrap → otel_host_agent → nas_storage → kubeconfig; depois o play do NAS (power, nas_syncthing). São 11 roles.
- **GitOps:** ArgoCD self-managed, app-of-apps em Helm; `kubernetes/apps/values.yaml` é a fonte única das versões dos charts, e o Ansible também lê esse arquivo.
- **Rede:** Tailscale Operator expõe cada app como Ingress HTTPS na tailnet, sem nada aberto para a internet.
- **Workloads:** Immich (fotos do NAS via NFS, read-only), Obsidian no navegador (vault no NAS), Home Assistant (Postgres CNPG + config no NAS), hello-world, observabilidade e apps externas (grocery-ops).
- **Dados:** CloudNativePG para Postgres; NFS do NAS para volumes grandes.

## Guardrails (o que mostra maturidade de plataforma)

- **Sem lockout:** o playbook nunca altera Tailscale, SSH, firewall ou rede do host; um hook `no-lockout` barra tasks que tentem fazer isso.
- **Repo público sem dados identificáveis:** inventário real gitignored, nome da tailnet descoberto em runtime e barrado pelo gitleaks.
- **Segredos:** SOPS + age; bootstrap descriptografado pelo Ansible (ADR 002), apps com KSOPS no ArgoCD e chave própria do cluster (ADR 004). Hook `sops-encrypted` impede commit em texto claro.
- **Supply chain:** binários fixados por versão + sha256 (k3s, helm, kubectl, sops, age, kubeconform, kube-linter, kustomize); imagens por digest; dashboards do Grafana vendorizados com `dashboards.lock` (versão + sha256) e patches em jq.
- **Multi-tenancy:** apps externas rodam no AppProject `homelab-apps`, que só aceita repos da org, bloqueia recursos cluster-scoped e namespaces de plataforma.
- **Regras para agentes de IA:** `AGENTS.md` com toolchain, estrutura, restrições e testes. O repo foi construído com Claude Code.

## Qualidade e CI

- `make test`: pre-commit + helm unittest + render com kubeconform e kube-linter, incluindo charts upstream.
- **CI e2e:** sobe k3s + ArgoCD no runner do GitHub, aplica o bootstrap, **roda de novo e exige `changed=0` (idempotência)**, confere Applications Healthy e testa o reset.
- Scripts próprios: `check-no-lockout.sh`, `check-sops-encrypted.sh`, `check-alert-rules.py`, `check-dashboard-metrics.py`, `assert-idempotent.sh`.
- Execuções do CI (últimas 100): 2026-kubernetes 39/53 `ci` verdes; grocery-ops 34/43 `ci`, 11/11 `release`, 15/15 Dependabot.

## Observabilidade (ADR 008)

- Tudo em OTLP: OpenTelemetry Collector no cluster + agente OTel no host, LGTM enxuto (Loki, Grafana, Tempo, Mimir).
- **6 arquivos de regras, ~40 alertas** (apps, homelab, hosts, kubernetes, NAS, observabilidade), por exemplo: ArgoCD fora de sync/Healthy, Postgres CNPG fora do ar, XID age alto, disco enche em 24h, OOM kill, nó NotReady, NAS sem métricas, notebook na bateria, réplica de backup acima de 85%.
- **6 pastas de dashboards** (Apps, Hosts, Kubernetes, Logs, Observabilidade, Rede).
- grocery-ops instrumentado: traces de HTTP e de cada consulta Postgres, métricas de runtime e de negócio (compras, valor, itens), logs JSON com `trace_id`; o e2e confere a chegada de traces e métricas ao coletor.

## Golden path para apps (repotpl-k8s-app → grocery-ops)

1. *Use this template* → `scripts/init.sh <nome>` → `make test`.
2. Release pelo GitHub Actions publica a imagem no GHCR, grava o digest no kustomize e cria a tag semver.
3. PR no repo central troca o `targetRevision`; o job de release já imprime o trecho pronto.
4. O kube-linter exige probes, requests, `runAsNonRoot`, `readOnlyRootFilesystem` e capabilities removidas.

**Prova de uso:** o grocery-ops saiu do template em 07/11 e chegou a 11 releases em 6 dias, com deploys via PR no repo central (PRs #3, #4, #5). Inclui ponte com a lista de compras da Alexa via Home Assistant (ADR 009).

## Decisões registradas (12 ADRs, 31/10 → 14/11/2026)

001 k3s + Ansible + ArgoCD · 002 SOPS + age · 003 controle remoto via WSL · 004 KSOPS · 005 Immich + NFS · 006 Obsidian + NFS · 007 apps de outros repos · 008 OTel + LGTM · 009 Home Assistant e Alexa · 010 atualizações do SO · 011 Syncthing do NAS via Ansible · 012 energia (tampa, bateria, RTC)

## Incidentes e post-mortems (as melhores histórias)

- **ADR 010, atualização do SO travou o cluster (11/11/2026):** o unattended-upgrades instalou kernel + módulos NVIDIA às 06:40; o SSD SATA de entrada (115 GB, 76% cheio) ficou 84% ocupado gravando 3–8 MB/s e os dois SQLite (Grafana e outro) travaram por ~7 min. Correção: role `os_updates` com horário fixo, prioridade idle de CPU e I/O, kernel fora do automático, `make kernel-upgrade` que reinicia e valida nó, Applications, Postgres e AppArmor; Grafana em WAL; alerta `host-disk-saturated`. Também testou GC agressivo do kubelet e descartou com dados (liberaria 0 bytes).
- **ADR 011, Syncthing do NAS parado em silêncio:** instalado à mão como root, não voltou num reboot; o índice parou em 01/10 e nada sincronizou por semanas. Passou a ser gerenciado pelo Ansible.
- **ADR 012, energia:** notebooks-servidor nunca suspendem; guardião de bateria avisa, desliga com 10% e arma o RTC para religar; limite de carga em 80%.
- Commits de troubleshooting: `ndots` para timeouts de DNS do c-ares no Home Assistant, polling do Alexa Devices gerando 429 da Amazon.

## Roadmap aberto (issues)

Kargo para promoção de imagens, SLOs com Sloth, OpenCost, catálogo de apps, backup off-site do NAS com restic (PR #7), métricas do Tailscale e do Home Assistant, revisão de backup dos Postgres, traduzir o repo para inglês (#11), migrar para `Bemesko/homelab` (#22).

## Pontos de atenção antes de publicar

- **36 dos 45 commits do 2026-kubernetes usam o email corporativo** (`@sou.cloud`), e há commits como `root@<hostname>.localdomain`. É público hoje; vale decidir se reescreve o histórico ou só ajusta o git config daqui pra frente.
- **Docs, ADRs e commits estão em português**, e o site é em inglês para vagas no exterior (issue #11).
- **Migração para `Bemesko/homelab` (#22)** vai mudar os links; melhor publicar o estudo de caso já com a URL final ou contar com o redirect do GitHub.
- **CI com falhas** (39/53 verdes): normal num repo em evolução, mas evite citar "CI sempre verde".
- **Prazo curto (2 semanas):** é ponto forte (velocidade com agentes) mas também pode ser lido como "projeto de fim de semana". A narrativa deve focar nas práticas de plataforma, não no tamanho.
