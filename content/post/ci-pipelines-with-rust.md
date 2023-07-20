---
title: "Ci Pipelines With Rust"
description: "A overview of Contionus Integration and a implementation of it with Rust"
#image: ""
date: 2023-07-19T21:01:12-04:00
draft: false
keywords: ["unorthodoxdev"]
toc: true
---

*Give a man a fish, and you feed him for a day. Teach a man to fish, and you feed him for a lifetime.*

CI, Continuous onus Integration allows for each member of a team to integrate their changes into the main branch, multiple times a day. 

Continuous Integration allows us to tighten the feed back loop. We are less likely to go off on your own and develop for days or weeks just to find out the approach you have taken isn't working, or isn't approved by peers. Continuous Integration forces you to work with your teammates earlier than when you feel is comfortable allowing for course correcting actions to be taken *before* you have wasted your time. So how do we make Continuous Integration a reality?

1. Tests
2. Code Coverage
3. Linting
4. Formatting
5. Security Vulnerabilities

## Tests

Tests in rust are a first-class concept. This being said rust allows you to easily leverage the rust ecosystem to run unit and integration tests using 

```bash
cargo test
```

`cargo test` also takes care of building the project before running tests saving you a command or two.

## Code Coverage

Code coverage is a easy way to see if we have overlooked any section of the code base that have been poorly tested. The easiest way to measure code coverage of a rust project is via `cargo tarpaulin` a cargo subcommand developed by xd009642. You can install tarpaulin with

```bash
cargo install cargo-tarpaulin
```

You can run cargo-tarpaulin with

```bash
cargo tarpaulin --ignore-tests
```

## Linting

Rust maintains `clippy` the official rust linter. Clippy is included in the set of components installed by rustup if you are using the default profile. You can run clippy with 

```bash
cargo clippy
```

In this CI pipeline we would like to fail the linter check if clippy emits any warnings. To do so we can run the following command

```bash
cargo clippy -- -D warnings
```

Note, from time to time clippy might suggest something you do not belive to be correct or desirable. You can mute these warnings with the following

```rust
#[allow(clippy::lint_name)]
```

## Formatting

Let machines deal with formatting while reviewers focus on architecture, testing thoroughness, reliability, and observability. Automated formatting removes a distraction from the complex equation of the PR review process. You might dislike this or that formatting choice but the complete erasure of formatting bikeshedding is worth the minor discomfort.

Rust actually has a built in formatter called `rustfmt`. `rustfmt` should be included in the default rustup components but if you are missing it you can install it via 

```bash
rustup component add rustfmt
```

To format your whole project you can run 

```bash
cargo fmt
```

In the CI pipeline we will ad a formatting step.

```bash
cargo fmt -- --check
```

This will ultimately fail when a commit contains unformatted code, printing the difference to the console. You can tune a project with a configuration file `rustfmt.toml`. 

## Security Vulnerabilities

Caro makes it very easy to leverage existing crates in the ecosystem to solve at hand. On the flip side, each of those crates might hide an exploitable vulnerability that could compromise the security posture of your software. The Rust Secure Code group maintains an *Advisory Database* on reported vulnerabilities for crates published on crates.io. You can leverage this advisory database with a tool called cargo-audit. You can install it with

```bash
cargo install cargo-audit
```

To use it you can run

```bash
cargo audit
```

# Github Actions

Below are some github actions you can add to your CI routines. To use them you will want too create the github actions folder and drop each of these files inside.

```bash
mkdir -p .github/workflows
cd .github/workflows
```

audit.yml
```yml
name: Security audit
on:
  schedule:
    - cron: '0 0 * * *'
  push:
    paths:
      - '**/Cargo.toml'
      - '**/Cargo.lock'
jobs:
  security_audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: taiki-e/install-action@cargo-deny
      - name: Scan for vulnerabilities
        run: cargo deny check advisories
```

general.yml
```yml
name: Rust

on:
  push:
    branches:
      - main
  pull_request:
    types: [ opened, synchronize, reopened ]
    branches:
      - main

env:
  CARGO_TERM_COLOR: always
  SQLX_VERSION: 0.6.2
  SQLX_FEATURES: "rustls"

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    services:
    steps:
      - uses: actions/checkout@v3
      - uses: dtolnay/rust-toolchain@stable
      - uses: Swatinem/rust-cache@v2
      - name: Run tests
        run: cargo test

  fmt:
    name: Rustfmt
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: dtolnay/rust-toolchain@stable
        with:
          components: rustfmt
      - name: Enforce formatting
        run: cargo fmt --check

  clippy:
    name: Clippy
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:14
        env:
          POSTGRES_USER: postgres
          POSTGRES_PASSWORD: password
          POSTGRES_DB: postgres
        ports:
          - 5432:5432
    steps:
      - uses: actions/checkout@v3
      - uses: dtolnay/rust-toolchain@stable
        with:
          components: clippy
      - uses: Swatinem/rust-cache@v2
      - name: Linting
        run: cargo clippy -- -D warnings

  coverage:
    name: Code coverage
    runs-on: ubuntu-latest
    services:
    steps:
      - name: Checkout repository
        uses: actions/checkout@v3
      - uses: dtolnay/rust-toolchain@stable
      - name: Generate code coverage
        run: cargo tarpaulin --verbose --workspace
```