# 2. Replace p-flux with Redux

Date: 2019-07-15

## Status

Accepted

## Context

Currently browser state is managed by [p-flux](https://github.com/pivotal-cf/p-flux). This tool hasn't been updated for some time and causes a number of issues that make it harder to work with the code:
1. Static dispatch of actions
  * This makes it harder to test as evidenced by the complex global set up in `application_globals.js` that each test has to hook into.
2. Data segregation
  * This isn't entirely caused by p-flux but at the moment, the entire store's state is passed down to every component as there is no way to connect specific components to the store.
3. Hard to see and reason about state
  * We log each action to the console but other than that we have no way really understand and debug how and when state changes.

In terms of alternatives, Redux seems to be winning as the most common, go to state, management system.

## Decision

The reason this hasn't been done before is because the p-flux patterns and components are woven throughout the code, so changing it is complex and risks. However, this proposal suggests that there is a way to incrementally make those changes as such:


For each piece of state in the store (i.e retros, retro, session)
1. Define redux reducer to store and manipulate state in all the ways main-dispatcher.js does
2. Create a 'boundActionCreator' that can dispatch the events identified 1.
3. Pass the action creator to main-dispatcher as a dependency
4. Call action creator whenever state is modified in main-dispatcher
5. Replace state provided to router from p-flux with redux by connecting router to store

Doing this for each piece of state means we will have remove p-flux from the storage of state, however we will still be relying on it for action dispatch and will still have poor data segregation.

At this point, we can start pushing state down to child components by connecting them directly rather than passing them down. Once we have done this, we can swap the static dispatch calls from those components to use redux's mapDispatchToProps approach, also replacing `api-dispatcher` with redux middleware.

At this point most of p-flux will be gone with a couple of exceptions such as the `analytics-dispatcher` which should probably be refactored into either dependencies or redux middleware.


## Consequences

Once the above changes have been made the repository will have a much more standard layout, with no static, global setup and testing, this should mean that the front end is:

* Easier to contribute & understand
* Easier to test as no more static method calls to dispatch events

It will also allow us to use tools such as `redux-dev-tools` with will allow us to more easily see and understand the state changes as they happen the the app which will help us make better decisions about how we manage state in the future.
