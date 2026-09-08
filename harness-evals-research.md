# AI Agent Harness Benchmarks

**A survey of actual evaluation suites used to compare agent harnesses**  
**Updated:** September 6, 2026

> This document focuses on concrete evaluations where researchers or companies ran one model through multiple harnesses, or published a suite intended for doing so. It does not attempt to catalog every agent benchmark or every paper proposing a new scaffold.

## Executive summary

Seven evaluations currently provide the clearest evidence about harness performance:

1. **FrontierHarness Eval v1.0** — the most reproducible public harness benchmark: 30 software-engineering tasks, 12 harness configurations, Kimi K3 held fixed, and public tasks/results.
2. **Composio’s Kimi K3 harness evaluation** — 25 business-application tool-use tasks across eight harnesses, with the model, provider, reasoning level, tools, instructions, data, and automated grading held fixed.
3. **Databricks’ internal coding-agent benchmark** — realistic tasks derived from merged pull requests in Databricks’ multi-million-line codebase; especially useful for its same-model, same-thinking-effort comparisons, but the benchmark is private.
4. **OpenBench** — a public, reusable coding-harness benchmark with fixed-model tracks, repeated trials, checker-based grading, Wilson intervals, and committed datasets.
5. **Artificial Analysis Coding Agent Index** — a 326-task composite with three attempts per task and a dedicated same-model harness comparison view.
6. **Harness Efficiency Bench** — a 12-harness, two-model study focused on startup prompt overhead, cache behavior, context handling, and tokens per solved task.
7. **Floatboat’s cross-benchmark harness study** — compares harness effects across several existing agent benchmarks and introduces a Harness Leverage Ratio, but is vendor-run and less independently reproducible.

The common result is that the harness can materially change **pass rate, cost, latency, context use, and reliability even when the model is fixed**. The evidence is directionally strong, but most studies still use only one run per task and lack confidence intervals.

---

# Comparison at a glance

| Evaluation | Tasks | Domain | Fixed model | Harnesses/configurations | Grading | Public artifacts |
|---|---:|---|---|---:|---|---|
| **FrontierHarness v1.0** | 30 | Terminal + repository software engineering | Kimi K3 | 12 configs / 9 original harnesses | Deterministic verifiers and hidden tests | Tasks, metadata, versions, aggregate and task-level results, rerun workflow |
| **Composio harness evaluation** | 25 valid tasks | Business-app and MCP tool use | Kimi K3 | 8 harnesses | Automated final-state checks | Detailed article; task dataset and raw runs not released |
| **Databricks coding-agent benchmark** | Not disclosed | Internal repository engineering | Several controlled same-model comparisons | Pi, Claude Code, Codex, others | Held-out tests | Private benchmark; methodology and summary results published |
| **OpenBench** | Multiple tiers; 24 currently validated tasks | Coding and terminal work | GPT-5.5 Medium track; separate open-model panels | Up to 8 harnesses | External checker scripts; optional partial credit | Public code, tasks, datasets, runner, reports |
| **Artificial Analysis** | 326 | Repository, terminal, and technical Q&A | Claude Opus 4.7 comparison view | Claude Code, Cursor CLI, OpenCode | Existing benchmark verifiers; 3 attempts/task | Public interactive results and methodology |
| **Harness Efficiency Bench** | 12 core + 10 SWE-bench Lite + context probes | Coding efficiency and context handling | DeepSeek V4 Flash and Nemotron 3 Ultra | 12 configurations | Task success plus network-level token accounting | Blog and paper; referenced repo unavailable |
| **Composio DeepSeek V4 Flash** | 30 | Multi-SaaS workflows | DeepSeek V4 Flash | 8 harnesses | Strict final-state verifier | Detailed article; no released suite/traces |
| **Floatboat harness study** | Five benchmark suites | Coding, terminal, browser, automation, tool use | DeepSeek V4 Flash for harness comparisons | Floatboat vs reference harnesses | Existing benchmark graders | Vendor report; reproducibility varies by underlying suite |
| **Local Pi vs OpenCode test** | Small/local | Local coding-agent use | Qwen3.6 35B A3B | 2 | Author-defined task success | Blog methodology only |

---

# 1. FrontierHarness Eval v1.0

## What it is

FrontierHarness is a public benchmark created by **Runta** specifically to compare coding-agent harnesses while holding the model and runtime constant. Version 1.0 ran **360 trials**: 30 tasks × 12 harness configurations.

It is currently the strongest starting point for someone who wants to run a new harness against a common, published suite.

## Task set

The benchmark contains **30 software-engineering tasks**:

- **21 Terminal-Bench 2.1 tasks** — command-line jobs such as recovering databases, building extensions, repairing repositories, processing data, and working with system tools.
- **9 DeepSWE tasks** — bug fixes or feature work in pinned open-source repositories, graded with hidden tests.

Every task directory in the public repository contains the instruction shown to each harness and public environment metadata.

## Harnesses tested

The original evaluation covered nine harnesses in 12 configurations:

- Codex
- Claude Code
- Pi
- Oh My Pi
- Kimi Code
- OpenCode
- Hermes
- Exo Harness
- DeepSeek Harness in Standard, Minimal, Creator, and PTC configurations

Published versions are recorded in the repository. Examples include Codex 0.148.0, Claude Code 2.1.237, Pi 0.84.2, Kimi Code 0.37.2, and OpenCode 1.18.19.

## What was controlled

- **Model:** Kimi K3 for all published runs
- **Provider:** Fireworks for the original evaluation
- **Runtime:** One golden checkpoint with the harnesses and task environments installed
- **Starting state:** A fresh restore for every trial
- **Resources:** Identical vCPU, memory, disk size, disk contents, and memory state
- **Attempts:** One canonical attempt per harness/task cell
- **Warm-cache protection:** Formal tasks were not run before the checkpoint was frozen
- **Scoring:** Deterministic verifier-based pass/fail outcomes

A gateway supported both OpenAI Responses and Anthropic Messages interfaces so harnesses could use their normal protocol against the same underlying model weights.

## Metrics

FrontierHarness reports:

- Pass rate
- Effective cost per pass
- Median cost
- Cache-hit rate
- Median wall-clock time
- Task-level results
- Failed-run costs, rather than calculating efficiency from successful runs alone

## Original results

| Harness/configuration | Pass rate | Effective cost per pass | Cache rate | Median successful time |
|---|---:|---:|---:|---:|
| Codex | **66.7%** | $3.47 | 88.0% | 6m 43s |
| DSH Creator | 63.3% | $3.28 | 84.3% | 6m 44s |
| Claude Code | 63.3% | $18.34 | 67.8% | 9m 38s |
| Pi | 60.0% | $2.43 | 79.4% | 7m 33s |
| DSH PTC | 60.0% | $4.58 | 87.2% | 7m 44s |
| DSH Standard | 60.0% | $3.46 | 86.5% | 6m 17s |
| Oh My Pi | 56.7% | $4.75 | 82.2% | 6m 46s |
| Kimi Code | 56.7% | $3.65 | 88.0% | 7m 56s |
| DSH Minimal | 56.7% | $4.72 | 84.6% | **5m 41s** |
| Exo Harness | 53.3% | **$1.05** | 70.3% | 6m 17s |
| OpenCode | 50.0% | $3.24 | 78.4% | 6m 27s |
| Hermes | 50.0% | $2.90 | 85.9% | 6m 58s |

The original field passed 209 of 360 trials, or 58.1%. Pass rates fell within a 16.7-point range, while effective cost per pass varied by roughly **17.5×**.

## Independent use: Mouse

Mouse subsequently ran the published suite and reported:

- **24/30 tasks passed (80%)**
- 18/21 Terminal-Bench tasks
- 6/9 DeepSWE tasks
- $3.13 effective cost per pass
- 4m 10s median successful time

Mouse attributes much of the result to a deterministic completion loop that requires inspection and verification before stopping. This is a useful example of the benchmark being used outside its original report, although the result is self-reported by Mouse’s vendor and still uses one trial per task.

## Strengths

- Explicitly designed to isolate harness effects
- Public tasks and task-level results
- Pinned harness versions
- Reusable workflow for adding another harness
- Fresh, equivalent runtime restore for every trial
- Includes terminal and repository-level tasks
- Reports failed-run cost and cache behavior

## Limitations

- Only 30 tasks and one run per cell
- No uncertainty intervals; many differences are too small to confidently rank
- One model, Kimi K3, so results may change with Claude, GPT, Gemini, or other models
- Coding and terminal work only
- Runta created the evaluation and supplied the proprietary runtime
- Full internal infrastructure, credentials, private evidence, and deployment configuration are not public
- Some cost differences may reflect model–protocol or model–harness fit, not universally better engineering

## Sources and artifacts

- [FrontierHarness live leaderboard](https://frontierharness.org/)
- [FrontierHarness public repository](https://github.com/frontier-harness-eval/eval)
- [Runta launch and methodology article](https://runta.com/blog/introducing-frontierharness-eval/)
- [Mouse’s FrontierHarness run](https://www.mouse.dev/blog/mouse-on-frontierharness/)
- [Terminal-Bench](https://www.tbench.ai/)

---

# 2. Composio’s Kimi K3 multi-harness evaluation

## What it is

Composio evaluated the same Kimi K3 model through **eight agent harnesses** on business-application tool-use workflows. This evaluation complements FrontierHarness because it tests agents acting through hosted MCP tools rather than editing code in a terminal.

The earlier X thread described an interim six-harness, 26-task comparison. Composio’s later full article reports the finalized evaluation as **eight harnesses across 25 valid tasks**.

## Task set

The valid set contains **25 tasks** involving:

- Gmail
- Google Calendar
- Google Sheets
- Airtable
- GitHub
- Slack
- Notion
- Linear
- PagerDuty

Tasks range from read-only audits to long workflows that modify multiple applications. Examples include:

- GitHub repository sweep
- Slack action-item extraction
- Calendar free/busy batch
- Sheets approval update
- Recurring calendar repair
- CRM migration archive
- Reimbursement audit
- Invoice synchronization
- Refund-ledger updates
- Vendor-directory verification

The evaluation began with 30 tasks. Five were removed for failing to provide a valid common comparison, leaving the same 25-task set for every harness.

## Harnesses tested

- Oh My Pi
- Kimi Code
- Hermes Agent
- Claude Code
- Pi Agent
- OpenCode
- Grok Build
- Codex

## What was controlled

- **Model:** `moonshotai/kimi-k3`
- **Provider:** OpenRouter
- **Reasoning:** Maximum reasoning
- **Tools:** The same hosted Composio MCP tools
- **Instructions:** The same task instructions
- **Data:** The same connected-application data
- **Scoring:** The same automated scoring rules
- **Attempts:** One valid scored run per task and harness

Attempts with provider, runtime, or evaluator failures were discarded and rerun with the same configuration. Ordinary failures and fixed-budget timeouts remained failures.

## Grading design

The grader inspected the **final state of connected applications**, rather than trusting the agent’s final message. Checks included:

- Exact record counts
- Exact identifier or name sets
- Numeric values within tolerance
- Required rows, messages, or replies
- Records that must remain unchanged
- Invalid or unsafe records that must remain excluded

This is a particularly useful design for tool-use agents because a confident textual answer cannot turn an incorrect sequence of actions into a pass.

## Results

| Harness | Tasks passed | Pass rate | Median time | Tool calls | Estimated cost per success |
|---|---:|---:|---:|---:|---:|
| Oh My Pi | **22/25** | **88%** | 231.7s | 248 | $0.52 |
| Kimi Code | 21/25 | 84% | 281.9s | 301 | $0.64 |
| Hermes Agent | 20/25 | 80% | 164.0s | 262 | **$0.46** |
| Claude Code | 19/25 | 76% | 330.5s | 293 | $1.96 |
| Pi Agent | 18/25 | 72% | **156.2s** | **223** | $0.57 |
| OpenCode | 18/25 | 72% | 270.5s | 299 | $0.72 |
| Grok Build | 18/25 | 72% | 196.2s | 402 | $0.66 |
| Codex | 17/25 | 68% | 233.4s | 297 | $0.66 |

Cost was estimated using OpenRouter’s Kimi K3 list prices on a shared 24-task slice; one task lacked complete usage data for at least one harness.

## What the task distribution showed

- All eight harnesses passed the same **12 tasks**.
- All eight failed the same **three hardest tasks**.
- The harnesses disagreed on **10 middle-difficulty tasks**.

Those 10 mixed tasks provide the best evidence of a harness effect because the model, provider, tools, instructions, and application data remained fixed.

The study also found that more tool calls did not consistently help. Grok Build made 402 calls and Pi made 223, but both passed 18 tasks.

## Strengths

- Same model, provider, reasoning level, tools, prompts, and data
- Tests consequential multi-application workflows, not only coding
- Uses application-state verification
- Reports pass rate, latency, tokens, tool calls, and estimated cost
- Discusses task-level disagreement and shared failures

## Limitations

- Only 25 tasks and one scored run per cell
- No confidence intervals or repeated-run reliability
- The task dataset, raw traces, and evaluator code are not publicly released
- Composio sells the MCP tool infrastructure used in the study
- Claude Code and Codex were tested with a non-native external model
- Costs are estimates based on list prices
- Removing tasks and replacing infrastructure-invalid runs introduces judgment calls that cannot be independently audited from the article alone

## Sources

- [Composio full evaluation: “8 Best AI Agent Harnesses in 2026”](https://composio.dev/content/best-ai-agent-harnesses)
- [Composio’s original X thread](https://x.com/composio/status/2083161873357111297)

---

# 3. Databricks’ internal coding-agent benchmark

## What it is

Databricks built an internal benchmark from work performed in its own multi-million-line codebase. The goal was to measure how coding agents perform on realistic company tasks and how performance changes with model, harness, and price.

Unlike FrontierHarness, this is not a public suite that another organization can rerun. Its value comes from the realism of the tasks and from Databricks’ reported same-model harness comparisons.

## Task construction

Databricks reports deriving tasks from real merged pull requests across a codebase using more than 10 languages and technologies, including Scala, Go, Rust, Java, Python, TypeScript, Bazel, and Protobuf.

The construction process reportedly included:

1. Selecting recent, human-written pull requests
2. Requiring high-quality tests and reasonably self-contained changes
3. Rewriting the original intent into a solution-free task prompt
4. Holding out tests for grading
5. Manually reviewing tasks
6. Sealing git history after traces revealed that agents could recover the original implementation from repository history

The number of tasks was not publicly disclosed.

## What was evaluated

Databricks evaluated combinations of models and coding harnesses used by its engineers. The harness analysis highlighted Pi, Claude Code, and Codex.

The most relevant comparison held the **model and thinking effort constant** while changing the harness.

## Grading and metrics

- Pass/fail based on held-out test execution
- End-to-end model cost per task
- Pass rate and quality tiers
- Context and run behavior examined through traces

No LLM judge was used for the primary correctness decision.

## Reported harness findings

Databricks reports that:

- The same model at the same thinking effort could cost **more than 2× as much per task** in one harness as another while maintaining similar quality.
- Pi sent roughly **3× less context per turn** in the cited comparison.
- Pi maintained a tighter working set and completed tasks in fewer runs.
- Pi with Opus 4.8 at `xhigh` reasoning reportedly achieved the highest overall pass rate at substantially lower cost than Claude Code and Codex in the configurations discussed by Earendil.

The broader study also argues that token price is a poor proxy for completed-task price: a cheaper model or token rate can require more context, turns, and retries.

## Related Pi autoresearch evidence

Earendil’s article also discusses Shopify’s `pi-autoresearch`, an extension that repeatedly changes code, runs a measurable experiment, keeps improvements, and rejects regressions. Reported internal examples include much faster tests, faster React component mounting, and reduced build times.

These are useful case studies of an optimization harness, but they are **not the Databricks benchmark** and should not be treated as a standardized harness leaderboard.

## Strengths

- Tasks derived from real internal engineering work
- Broad, large, multilingual production codebase
- Test-based grading
- Same-model, same-thinking-effort harness comparisons
- Identified and closed a realistic contamination route through git history
- Measures completed-task economics rather than token price alone

## Limitations

- Private task set and undisclosed task count
- No raw trajectories, per-task result table, or evaluator release
- Cannot be independently rerun
- One company’s codebase and engineering distribution
- Earendil’s summary is written by the organization behind Pi and should be read alongside Databricks’ primary report

## Sources

- [Databricks, “Benchmarking Coding Agents on Databricks’ Multi-Million Line Codebase”](https://www.databricks.com/blog/benchmarking-coding-agents-databricks-multi-million-line-codebase)
- [Earendil, “Pi, Minimal and Performant”](https://earendil.com/posts/pi-autoresearch-and-databricks/)

---

# 4. Floatboat’s multi-benchmark harness study

## What it is

Floatboat evaluated harness effects across several existing task suites rather than creating one new task set. Its central comparison runs the same **DeepSeek V4 Flash** model through different harnesses and compares the gain from changing the harness with the gain from changing the model.

## Evaluation suites used

The report covers five benchmark families:

- Terminal-Bench 2.1
- AutomationBench
- Toolathlon
- BrowseComp
- DeepSWE

Together these span terminal work, automation, tool use, browsing, and repository-level software engineering.

## Harness Leverage Ratio

Floatboat proposes a **Harness Leverage Ratio (HLR)**:

> improvement from changing the harness ÷ improvement from changing the model

The metric is intended to answer whether engineering the agent loop produced a larger gain than buying a stronger model. Floatboat reports an HLR of 3.6× on DeepSWE in one comparison.

## Why it is useful

- Tests whether harness gains transfer across multiple domains
- Frames harness performance relative to model upgrades
- Uses established external benchmarks rather than only vendor-created tasks

## Limitations

- Vendor-created evaluation of the vendor’s own harness
- Exact controls and reproducibility depend on each underlying benchmark
- Cross-benchmark summary numbers can hide different budgets, graders, and task distributions
- HLR can be unstable when the denominator—the measured model improvement—is small
- Results should be verified from released trajectories or independent reruns where available

## Source

- [Floatboat harness benchmark report](https://floatboat.ai/news/harness-benchmark)

---

# 5. OpenBench

## What it is

OpenBench is an open-source benchmark and runner built explicitly around the question: given the same model and task, how much does the coding-agent harness matter? It separates **Harness Bench**, which varies the harness, from **Gateway Bench**, which fixes the Pi harness and varies the API gateway.

## Task sets and tracks

OpenBench includes several separately reported tiers:

- Eight historical repo-authored coding tasks, including `make-ci-green`, `add-feature`, and `misleading-error`
- Eleven Exercism-derived tasks with provenance
- Five adapted Terminal-Bench tasks
- A Harbor-native `openbench-lite` suite

Its primary same-model **Track A** pins compatible harnesses to GPT-5.5 Medium. Separate open-model panels test Pi, OpenCode, Claude, and Codex adapters with models including GLM-5.2, DeepSeek V4 Flash, Kimi K2.7 Code, and GLM-4.7 Flash. Harness support includes Codex, Pi, OpenCode, Cursor, Devin, Aider, Grok Build, and an open-model Claude adapter.

## Evaluation design

- Fresh disposable workspace for every cell
- External `checker.sh` is the sole judge; harness self-reports never count
- Optional `SCORE:` contract provides partial credit
- Checkers must fail on untouched workspaces and pass on golden solutions
- Built-in null harness acts as a negative control
- Repeated trials and Wilson 95% confidence intervals
- Pinned models, adapters, command lines, timeouts, and harness versions
- Public, sealed result bundles and append-only JSONL data

## Findings

OpenBench reports that frontier harnesses reached a correctness ceiling on its easier repo-authored tasks, while efficiency continued to separate them: up to roughly **4× wall-clock spread** and **8× token spread**. Pi was repeatedly among the fastest and leanest. A 72-run open-model panel reportedly cost about $1.02, and a 45-cell Terminal-Bench run produced 12/15 passes for each of three harnesses.

## Strengths and limitations

This is one of the most reproducible projects in the field: code, tasks, datasets, adapters, checker validation, confidence intervals, and a cheap reproduction path are public. However, the task counts remain small, several easier tiers saturate, closed harnesses cannot use every open model, and some Terminal-Bench data was still local-only when documented.

**Sources:** [OpenBench repository](https://github.com/minghinmatthewlam/openbench) · [Live leaderboard](https://openbench.run/)

---

# 6. Harness Efficiency Bench

## What it tested

Eishan Lawrence ran **12 harness configurations** on the same 12 small Python tasks, first with DeepSeek V4 Flash and then with Nvidia Nemotron 3 Ultra through OpenRouter. Harnesses included Aider and Aider Architect, Claude Code, Codex, Goose, Hermes, Kilo, Kimi Code, Nanobot, OpenClaw, OpenCode, and Qwen Code.

Follow-ups tested four harnesses on 10 SWE-bench Lite tasks and injected 20k, 50k, and 100k irrelevant tokens to probe context handling.

## Main results

- Tokens per solved core task ranged from roughly **3,500–4,100** for Aider Architect to **191,000–292,000** for OpenClaw—a 70–80× spread.
- The ordering was stable across two unrelated models.
- Startup prompt/tool overhead ranged from about 700 to 26,000 tokens.
- Startup overhead × turn count predicted tokens per solved task with reported **R² = 0.99**.
- Prompt caching could reverse cost rankings: raw token count alone was misleading.
- On 10 SWE-bench Lite tasks, all four selected harnesses solved the same one task while spending from 0.8M to 15M tokens.
- The 100k context probe exposed sharply different behavior: full pass-through, attention failure, explicit refusal, crashes, and silent truncation.

## Why it matters

This study evaluates harness **efficiency and context integrity**, not only pass rate. Running the core suite with two models helps show that the ranking reflects harness behavior rather than one model’s quirks.

## Limitations

The core tasks are small and nearly saturated, there was one run per pairing, the hard-task follow-up was only 10 tasks, and gateway-specific caching affects costs. The article links a GitHub repository, but it was unavailable during verification; the public blog and paper are therefore the accessible evidence.

**Source:** [“I tested 12 coding harnesses for efficiency”](https://www.eishanlawrence.com/blog/harness-efficiency-bench)

---

# 7. Artificial Analysis Coding Agent Index

## What it is

Artificial Analysis publishes a 326-task composite coding-agent index and a dedicated **Harness Comparison** that holds Claude Opus 4.7 fixed while comparing Claude Code, Cursor CLI, and OpenCode.

## Task set and scoring

- DeepSWE: 113 tasks
- Terminal-Bench v2.1: 89 tasks
- SWE-Atlas-QnA: 124 tasks
- Three attempts per task
- Task-normalized pass@1 within each component
- Equal weight across the three benchmark components

It also reports input, cached-input, and output tokens; estimated API cost; cache behavior; and active agent wall time.

## Why it stands out

At 326 tasks and three attempts per task, this has substantially more statistical depth than most harness studies. It also spans repository implementation, terminal workflows, and technical repository Q&A. The dedicated Opus 4.7 view is a clean same-model comparison.

## Limitations

Only three harnesses appear in the clean fixed-model view. The broader leaderboard changes both model and harness and must not be interpreted as a harness ranking. The site publishes methodology and interactive results but not a self-contained rerun bundle comparable to FrontierHarness or OpenBench.

**Source:** [Artificial Analysis Coding Agent Benchmarks](https://artificialanalysis.ai/agents/coding-agents)

---

# 8. Composio’s DeepSeek V4 Flash evaluation

## Design

This second Composio study ran **30 difficult multi-SaaS workflows** through Pi Agent, Prime Agent, Oh My Pi, Claude Code, Codex, DeepAgents, Hermes Agent, and OpenCode using DeepSeek V4 Flash and the same hosted Composio MCP tools. Runs had a 900-second cap.

Fixtures included decoy records and unique run tags. A strict programmatic verifier inspected final application state, exact calculations, required actions, untouched decoys, final-response format, and actual tool use. Partial completion did not pass.

## Results

| Harness | Reported pass rate | Median time | Estimated cost/success |
|---|---:|---:|---:|
| Pi Agent | **66.7%** | 132.2s | **$0.028** |
| Prime Agent | 62.5%* | 242.1s | $0.131 |
| Oh My Pi | 56.7% | 272.4s | $0.103 |
| Claude Code | 53.3% | **122.7s** | $0.195 |
| Codex | 53.3% | 245.0s | $0.081 |
| DeepAgents | 53.3% | 187.1s | $0.045 |
| Hermes Agent | 50.0% | 175.5s | $0.056+ |
| OpenCode | 46.7% | 129.7s | $0.073 |

Across 240 scheduled runs, 129 succeeded. Only six workflows were passed by every harness.

## Important caveats

This comparison is less clean than Composio’s Kimi K3 study. Pi used a different reasoning setting and two providers; only 24 of Prime’s 30 runs were gradable; Hermes lacked final usage on two timeouts; and costs are estimates. The tasks, traces, and verifier are not released. It remains useful because these imperfections are disclosed and the application-state grading is strong.

**Source:** [Composio, “Finding the Best Harness for DeepSeek V4 Flash”](https://composio.dev/content/best-agent-harness-deepseek-v4-flash)

---

# 9. Smaller and emerging harness evaluations

## 9.1 PDD: Pi versus official DeepSeek Harness

Prompt Driven Development published a highly controlled but small local comparison using the same Qwen3.8 27B MLX model, machine, endpoint, sampling, context, reasoning setting, task bytes, checker, and timeout. Pi 0.73.1 and DeepSeek Harness 0.1.1-rc.2 each ran four OpenBench tasks twice, with order reversed between trials.

Pi passed 6/8 externally checked runs versus DSH’s 4/8 and used 14% less total wall time. However, the entire outcome gap came from one task: six pairs tied and only two favored Pi. The authors explicitly reject a general ranking or significance claim. Public artifacts include runner code, pinned dependencies, clean result JSON, task hashes, external scores, timing, and request telemetry. This is a strong template for transparent paired experiments despite its tiny sample.

**Source:** [PDD Pi vs DeepSeek Harness study](https://github.com/promptdriven/pdd/tree/main/research/omlx-qwen38-pi-deepseek-harness-2026-08-23)

## 9.2 Ten-task GLM 5.3 harness comparison

Carlo Capocasa ran Claude Code, OpenCode, Pi, zcode, Hermes, and 3code on the same 10 difficulty-selected SWE-bench Verified tasks with GLM 5.3. 3code and OpenCode each reportedly solved 9/10; Pi solved 6/10. The test emphasizes total tokens and cache rate as well as solves.

This is useful emerging evidence but weak for ranking: it uses 10 selected tasks, one run per cell, has no raw result release, and the author develops 3code and zcode. The author openly describes it as an imperfect, non-deterministic diagnostic benchmark.

**Source:** [10-task GLM 5.3 harness bench](https://capocasa.dev/10-task-glm-5-3-harness-bench-claude-opencode-pi-zcode-hermes-and-3code)

## 9.3 Local Pi versus OpenCode benchmark

A smaller community evaluation compares **Pi and OpenCode using the same local Qwen3.6 35B A3B model**. It is useful as evidence that harness comparison is also relevant for local models, where context size, prompt-prefix stability, and inference latency matter greatly.

It is not comparable in rigor or scale to FrontierHarness: the tasks and scoring are author-defined, the number of harnesses is two, and the report is not a reusable standardized suite.

**Source:** [Local Harness Benchmark: Pi Coding Agent vs. OpenCode](https://grigio.org/local-harness-benchmark-pi-coding-agent-vs-opencode/)

## 9.4 Strands benchmark-harnesses

The `strands-labs/benchmark-harnesses` repository publishes harness implementations and results intended for running agents across software-engineering benchmarks such as SWE-Pro, Terminal-Bench 2, and SWE-bench Verified.

This is relevant infrastructure for cross-benchmark harness testing, but individual claims must be inspected for whether the model, budget, prompts, and environment were actually held constant.

**Source:** [strands-labs/benchmark-harnesses](https://github.com/strands-labs/benchmark-harnesses)

## 9.5 Mouse on FrontierHarness

Mouse is not a separate task suite; it is an important **third-party use of FrontierHarness**. It demonstrates why a reusable benchmark matters: a new harness can run the same 30 tasks and compare its task-level outcomes with the original field.

**Source:** [Mouse on FrontierHarness](https://www.mouse.dev/blog/mouse-on-frontierharness/)

---

# 10. Benchmarks used inside harness evaluations

The following are not, by themselves, controlled harness comparisons. They are task suites that harness researchers reuse.

## Terminal-Bench

Tests agents on terminal-based, verifiable tasks. It is the source of 21 FrontierHarness v1.0 tasks and is also used in Floatboat and other harness reports.

- [Terminal-Bench](https://www.tbench.ai/)

## DeepSWE

Repository-level bug-fix and feature tasks with hidden tests. Nine DeepSWE tasks appear in FrontierHarness, and DeepSWE also appears in Floatboat’s study.

## SWE-bench Verified

Tests real GitHub issue resolution. It is widely used to rank complete model-and-harness systems, but most public leaderboard rows change the model, harness, budget, and sampling strategy simultaneously. It becomes a harness evaluation only when those other variables are controlled.

- [SWE-bench](https://www.swebench.com/)
- [SWE-bench repository](https://github.com/SWE-bench/SWE-bench)

## AutomationBench, Toolathlon, and BrowseComp

These broaden harness testing beyond coding into automation, tool-use, and browser research. Floatboat uses them as part of its cross-domain evaluation. Their results should be interpreted with each benchmark’s original grading and contamination limitations in mind.

---

# 11. What the current benchmarks collectively show

## Harness choice changes success

- FrontierHarness: original pass rates ranged from **50.0% to 66.7%** on identical tasks with Kimi K3.
- Composio: pass rates ranged from **68% to 88%** with Kimi K3, the provider, tools, task instructions, data, and reasoning level held fixed.
- Mouse’s later FrontierHarness run reached **80%**, suggesting that verification and stopping policy can create large gains on long tasks.

## Harness choice changes cost even more

- FrontierHarness reported roughly **17.5×** variation in effective cost per pass.
- Databricks reported **more than 2×** cost variation with the same model and thinking effort at similar quality.
- Composio reported cost per successful task from **$0.46 to $1.96**.

## Efficiency and quality are separate axes

Pi was the fastest and used the fewest calls in Composio’s evaluation but did not have the highest pass rate. Mouse improved FrontierHarness pass rate through repeated verification but incurred additional model calls. A useful leaderboard therefore needs a Pareto view, not one overall rank.

## The harness effect is concentrated in middle-difficulty tasks

Composio found that every harness passed 12 tasks and every harness failed three; the harness mattered most on the 10 tasks between those extremes. This suggests benchmark designers should prioritize discriminative tasks rather than filling suites with universally easy or impossible items.

## Native-harness advantage remains unresolved

Both FrontierHarness and Composio deliberately use Kimi K3 as a common model. That improves control but may disadvantage harnesses tuned for Claude or OpenAI models. A proper harness × model matrix is still needed.

---

# 12. Evidence-quality ranking

## Tier A — reusable public benchmark

### FrontierHarness and OpenBench

Both provide public task definitions, task-level results, pinned versions, and a rerun workflow. Main weaknesses: small sample, one run per cell, one model, and vendor-controlled runtime.

## Tier B — large controlled evaluation with limited rerun access

### Artificial Analysis

Its fixed-model harness view spans 326 tasks with three attempts per task. Interactive results and methodology are public, but it is not packaged as a self-contained rerun suite.

## Tier C — strong controlled company evaluation, not reproducible

### Composio

Good control and strong final-state grading across business applications, but no released task set, raw traces, or evaluator.

### Databricks

High-realism internal tasks and test-based grading, but private data and incomplete numerical reporting prevent independent verification.

## Tier D — useful vendor or community studies

### Floatboat

Broad cross-benchmark coverage and an interesting leverage metric, but vendor-run and dependent on heterogeneous suites.

### Local Pi vs OpenCode

Useful controlled local-model case study, but too small and bespoke to support broad rankings.

### Individual FrontierHarness submissions such as Mouse

Comparable because they reuse a public suite, but self-reported and still statistically noisy.

---

# 13. What a better next-generation harness benchmark should do

A rigorous successor should combine the best aspects of FrontierHarness, Composio, and Databricks.

## Task coverage

- Terminal and repository engineering
- Browser and desktop interaction
- Business-application tool use
- Long-running optimization and experimentation
- Read-only, mutating, and safety-sensitive tasks
- A mixture of easy, discriminative middle, and hard tasks

## Experimental design

- Full **harness × model matrix**, including native and neutral models
- At least 3–5 independent runs per cell
- Exact model snapshots and pinned harness commits
- Equal token, time, and dollar-budget tracks
- Fresh environment restore for every trial
- Explicit treatment of provider and infrastructure failures
- Pre-registered task exclusions
- Confidence intervals and paired statistical tests

## Metrics

- Pass rate and partial-credit score
- Repeated-run reliability
- Effective cost per pass, including failed runs
- Wall-clock latency
- Input, output, reasoning, cache-read, and cache-write tokens
- Tool calls and tool errors
- Context compactions and truncations
- Safety violations and unintended mutations
- Verification quality and premature stopping

## Reproducibility

- Public task definitions where legally possible
- Hidden tests with auditable versioning
- Public evaluator code
- Raw trajectories with secrets removed
- Per-task cost and timing
- Container or checkpoint definitions
- Pinned prompts, configurations, and harness versions

---

# Bottom line

If the goal is to compare a new coding harness today, **FrontierHarness and OpenBench are the clearest public baselines**. FrontierHarness offers a fixed 30-task terminal/repository suite and standardized runtimes; OpenBench offers broader experiment tooling, repeated trials, confidence intervals, partial credit, and inexpensive model panels. If the goal is to evaluate MCP and business-application agents, **Composio’s test design** is the most relevant published example, although its suite is not released. For realistic private-codebase evaluation, **Databricks provides the strongest construction methodology**, but organizations must recreate it from their own pull-request history.

The field does not yet have a large, independent, repeated-run harness benchmark spanning multiple models and domains. Current evidence is nevertheless consistent: the harness is not a cosmetic wrapper. It can change whether a task succeeds, how much context the model consumes, when the agent stops, and the cost of obtaining a correct result.
