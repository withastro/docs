---
title: Deploy your Astro Site to AWS with Flightcontrol
description: How to deploy your Astro site to AWS with Flightcontrol
layout: ~/layouts/DeployGuideLayout.astro
---

[Flightcontrol](https://www.flightcontrol.dev?ref=astro) enables any developer to deploy to AWS without being a wizard. It's extremely easy to use but lets you pop the hood and leverage the raw power of AWS when needed.

Supports both static and SSR Astro sites.

## How to Deploy

1. Create a Flightcontrol account at [app.flightcontrol.dev/signup](https://app.flightcontrol.dev/signup?ref=astro)
1. Go to [app.flightcontrol.dev/projects/new/1](https://app.flightcontrol.dev/projects/new/1)
1. Connect your Github account and select your repo
1. Select your desired "Config Type":
    1. `GUI` (all config managed through flightcontrol dashboard)
       1. Then select the Astro Static or Astro SSR preset
    1. `flightcontrol.json` ("infrastructure as code" option where all config is in your repo)
       1. Then select an Astro example config, then add it to your codebase as `flightcontrol.json`
1. Adjust any configuration as needed
1. Click "Create Project" and complete any required steps like linking your AWS account.


### SSR Setup

To deploy with SSR support, make sure you first set up the [`@astro/node`](/en/guides/integrations-guide/node) adapter.


If you have *any* problems or questions, Flightcontrol is very responsive in [their support Discord](https://discord.gg/yY8rSPrD6q).

