# 3. Implement webhooks for integrations with external services

Date: 2019-10-25

## Status

Proposed

## Context

Currently Postfacto does not integrate with other services. We're aware from user research that integrations with external tools like Pivotal Tracker, Slack and Trello would be useful, especially for tracking retro actions within existing task lists and backlogs (see e.g. #20, #29).

However, there are many possible tools (Jira, Azure DevOps, ...) and it is impractical to build out integration with all of them. It is the author's experience that not all retro actions will necessarily end up in the same backlog. This could lead to either: very complex implementation (for us) and configuration (for our users); or meeting the needs of only a small subset of our users.

This has also led to people using the API directly to implement integrations with these external tools, which means that when we change these endpoints (which are not documented, and have never been deliberately exposed for direct consumption) they potentially disrupt our users' workflows.


## Decision

Rather than build out integration with some subset of the services we've identified, we'll implement a webhook-based integration. When a retro is completed, if a webhook URL is set in the retro configuration, Postfacto will call that webhook with a payload containing the retro actions.

Additionally, we could provide examples of integrations that users could copy and modify as appropriate for their purposes.

Alongside this we will not support direct usage of the API, so #186 will not addressed.


## Consequences

Pros:

  - We will, albeit indirectly, support a far broader range of tools than would be possible for us to build out.

  - Users will have the flexibility to manage their actions as appropriate for them, either using existing integration tools (e.g. IFTTT and Zapier) or by building their own apps.

  - We will reduce direct usage of the API, thereby reducing user disruption when we change it for product or operational reasons.

Cons:

  - Integration will require more work (and technical expertise) on the part of our users, compared to a bundled integration.

  - Two-way integration (i.e. the action in Postfacto gets marked done when the associated item in the external tool is completed) will not be supported.
