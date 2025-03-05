---
title: Actions
description: Learn how to create type-safe server functions you can call from anywhere.
i18nReady: true
---

import { Steps } from '@astrojs/starlight/components';
import Since from '~/components/Since.astro';
import ReadMore from '~/components/ReadMore.astro';

<p><Since v="4.15" /></p>

Astro Actions allow you to define and call backend functions with type-safety. Actions perform data fetching, JSON parsing, and input validation for you. This can greatly reduce the amount of boilerplate needed compared to using an [API endpoint](/en/guides/endpoints/).

Use actions instead of API endpoints for seamless communication between your client and server code and to:

- Automatically validate JSON and form data inputs using [Zod validation](https://zod.dev/?id=primitives).
- Generate type-safe functions to call your backend from the client and even [from HTML form actions](#call-actions-from-an-html-form-action). No need for manual `fetch()` calls.
- Standardize backend errors with the [`ActionError`](/en/reference/modules/astro-actions/#actionerror) object.

## Basic usage

Actions are defined in a `server` object exported from `src/actions/index.ts`:

```ts title="src/actions/index.ts"
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const server = {
  myAction: defineAction({ /* ... */ })
}
```

Your actions are available as functions from the `astro:actions` module. Import `actions` and call them client-side within a [UI framework component](/en/guides/framework-components/), [a form POST request](#call-actions-from-an-html-form-action), or by using a `<script>` tag in an Astro component.

When you call an action, it returns an object with either `data` containing the JSON-serialized result, or `error` containing thrown errors.

```astro title="src/pages/index.astro"
---
---

<script>
import { actions } from 'astro:actions';

async () => {
  const { data, error } = await actions.myAction({ /* ... */ });
}
</script>
```

### Write your first action

Follow these steps to define an action and call it in a `script` tag in your Astro page.

<Steps>

1. Create a `src/actions/index.ts` file and export a `server` object.

    ```ts title="src/actions/index.ts"
    export const server = {
      // action declarations
    }
    ```

2. Import the `defineAction()` utility from `astro:actions`, and the `z` object from `astro:schema`.

    ```ts ins={1-2} title="src/actions/index.ts"
    import { defineAction } from 'astro:actions';
    import { z } from 'astro:schema';

     export const server = {
      // action declarations
    }
    ```

3. Use the `defineAction()` utility to define a `getGreeting` action. The `input` property will be used to validate input parameters with a [Zod](https://zod.dev) schema and the `handler()` function includes the backend logic to run on the server.

    ```ts ins={5-12} title="src/actions/index.ts"
    import { defineAction } from 'astro:actions';
    import { z } from 'astro:schema';

    export const server = {
      getGreeting: defineAction({
        input: z.object({
          name: z.string(),
        }),
        handler: async (input) => {
          return `Hello, ${input.name}!`
        }
      })
    }
    ```

4. Create an Astro component with a button that will fetch a greeting using your `getGreeting` action when clicked.

    ```astro title="src/pages/index.astro"
    ---
    ---

    <button>Get greeting</button>

    <script>
    const button = document.querySelector('button');
    button?.addEventListener('click', async () => {
      // Show alert pop-up with greeting from action
    });
    </script>
    ```

5. To use your action, import `actions` from `astro:actions` and then call `actions.getGreeting()` in the click handler. The `name` option will be sent to your action’s `handler()` on the server and, if there are no errors, the result will be available as the `data` property.

    ```astro title="src/pages/index.astro" ins={7, 12-13}
    ---
    ---

    <button>Get greeting</button>

    <script>
    import { actions } from 'astro:actions';

    const button = document.querySelector('button');
    button?.addEventListener('click', async () => {
      // Show alert pop-up with greeting from action
      const { data, error } = await actions.getGreeting({ name: "Houston" });
      if (!error) alert(data);
    })
    </script>
    ```

</Steps>

<ReadMore>See the full Actions API documentation for details on [`defineAction()`](/en/reference/modules/astro-actions/#defineaction) and its properties.</ReadMore>

## Organizing actions

All actions in your project must be exported from the `server` object in the `src/actions/index.ts` file. You can define actions inline or you can move action definitions to separate files and import them. You can even group related functions in nested objects.

For example, to colocate all of your user actions, you can create a `src/actions/user.ts` file and nest the definitions of both `getUser` and `createUser` inside a single `user` object.

```ts
// src/actions/user.ts
import { defineAction } from 'astro:actions';

export const user = {
  getUser: defineAction(/* ... */),
  createUser: defineAction(/* ... */),
}
```

Then, you can import this `user` object into your `src/actions/index.ts` file and add it as a top-level key to the `server` object alongside any other actions:

```ts title="src/actions/index.ts" ins={1,5}
import { user } from './user';

export const server = {
  myAction: defineAction({ /* ... */ }),
  user,
}
```

Now, all of your user actions are callable from the `actions.user` object:

- `actions.user.getUser()`
- `actions.user.createUser()`


## Handling returned data

Actions return an object containing either `data` with the type-safe return value of your `handler()`, or an `error` with any backend errors. Errors may come from validation errors on the `input` property or thrown errors within the `handler()`.

Actions return a custom data format that can handle Dates, Maps, Sets, and URLs [using the Devalue library](https://github.com/Rich-Harris/devalue). Therefore, you can't easily inspect the response from the network like you can with regular JSON. For debugging, you can instead inspect the `data` object returned by actions.

<ReadMore>[See the `handler()` API reference](/en/reference/modules/astro-actions/#handler-property) for full details.</ReadMore>

### Checking for errors

It's best to check if an `error` is present before using the `data` property. This allows you to handle errors in advance and ensures `data` is defined without an `undefined` check.

```ts
const { data, error } = await actions.example();

if (error) {
  // handle error cases
  return;
}
// use `data`
```

### Accessing `data` directly without an error check

To skip error handling, for example while prototyping or using a library that will catch errors for you, use the `.orThrow()` property on your action call to throw errors instead of returning an `error`. This will return the action's `data` directly.

This example calls a `likePost()` action that returns the updated number of likes as a `number` from the action `handler`:

```ts ins="orThrow"
const updatedLikes = await actions.likePost.orThrow({ postId: 'example' });
//    ^ type: number
```

### Handling backend errors in your action

You can use the provided `ActionError` to throw an error from your action `handler()`, such as "not found" when a database entry is missing, or "unauthorized" when a user is not logged in. This has two main benefits over returning `undefined`:


- You can set a status code like `404 - Not found` or `401 - Unauthorized`. This improves debugging errors in both development and in production by letting you see the status code of each request.

- In your application code, all errors are passed to the `error` object on an action result. This avoids the need for `undefined` checks on data, and allows you to display targeted feedback to the user depending on what went wrong.

#### Creating an `ActionError`

To throw an error, import the `ActionError()` class from the `astro:actions` module. Pass it a human-readable status `code` (e.g. `"NOT_FOUND"` or `"BAD_REQUEST"`), and an optional `message` to provide further information about the error.

This example throws an error from a `likePost` action when a user is not logged in, after checking a hypothetical "user-session" cookie for authentication:

```ts title="src/actions/index.ts" ins=/ActionError(?= )/ ins={9-12}
import { defineAction, ActionError } from "astro:actions";
import { z } from "astro:schema";

export const server = {
  likePost: defineAction({
    input: z.object({ postId: z.string() }),
    handler: async (input, ctx) => {
      if (!ctx.cookies.has('user-session')) {
        throw new ActionError({
          code: "UNAUTHORIZED",
          message: "User must be logged in.",
        });
      }
      // Otherwise, like the post
    },
  }),
};
```

#### Handling an `ActionError`

To handle this error, you can call the action from your application and check whether an `error` property is present. This property will be of type `ActionError` and will contain your `code` and `message`.

In the following example, a `LikeButton.tsx` component calls the `likePost()` action when clicked. If an authentication error occurs, the `error.code` attribute is used to determine whether to display a login link:

```tsx title=src/components/LikeButton.tsx ins="if (error.code === 'UNAUTHORIZED') setShowLogin(true);"
import { actions } from 'astro:actions';
import { useState } from 'preact/hooks';

export function LikeButton({ postId }: { postId: string }) {
  const [showLogin, setShowLogin] = useState(false);
  return (
    <>
      {
        showLogin && <a href="/signin">Log in to like a post.</a>
      }
      <button onClick={async () => {
        const { data, error } = await actions.likePost({ postId });
        if (error?.code === 'UNAUTHORIZED') setShowLogin(true);
        // Early return for unexpected errors
        else if (error) return;
        // update likes
      }}>
        Like
      </button>
    </>
  )
}
```

### Handling client redirects

When calling actions from the client, you can integrate with a client-side library like `react-router`, or you can use Astro's [`navigate()` function](/en/guides/view-transitions/#trigger-navigation) to redirect to a new page when an action succeeds.

This example navigates to the homepage after a `logout` action returns successfully:

```tsx title=src/pages/LogoutButton.tsx {2,7-8}
import { actions } from 'astro:actions';
import { navigate } from 'astro:transitions/client';

export function LogoutButton() {
  return (
    <button onClick={async () => {
      const { error } = await actions.logout();
      if (!error) navigate('/');
    }}>
      Logout
    </button>
  );
}
```

## Accepting form data from an action

Actions accept JSON data by default. To accept form data from an HTML form, set `accept: 'form'` in your `defineAction()` call:

```ts title="src/actions/index.ts" ins={6}
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const server = {
  comment: defineAction({
    accept: 'form',
    input: z.object(/* ... */),
    handler: async (input) => { /* ... */ },
  })
}
```

### Validating form data

Actions will parse submitted form data to an object, using the value of each input’s `name` attribute as the object keys. For example, a form containing `<input name="search">` will be parsed to an object like `{ search: 'user input' }`. Your action's `input` schema will be used to validate this object.

To receive the raw `FormData` object in your action handler instead of a parsed object, omit the `input` property in your action definition.

The following example shows a validated newsletter registration form that accepts a user's email and requires a "terms of service" agreement checkbox.

<Steps>

1. Create an HTML form component with unique `name` attributes on each input:

    ```astro title="src/components/Newsletter.astro" /name="\w+"/
    <form>
      <label for="email">E-mail</label>
      <input id="email" required type="email" name="email" />
      <label>
        <input required type="checkbox" name="terms">
        I agree to the terms of service
      </label>
      <button>Sign up</button>
    </form>
    ```

2. Define a `newsletter` action to handle the submitted form. Validate the `email` field using the `z.string().email()` validator, and the `terms` checkbox using `z.boolean()`:

    ```ts title="src/actions/index.ts" ins={5-12}
    import { defineAction } from 'astro:actions';
    import { z } from 'astro:schema';

    export const server = {
      newsletter: defineAction({
        accept: 'form',
        input: z.object({
          email: z.string().email(),
          terms: z.boolean(),
        }),
        handler: async ({ email, terms }) => { /* ... */ },
      })
    }
    ```

    <ReadMore>See the [`input` API reference](/en/reference/modules/astro-actions/#input-validator) for all available form validators.</ReadMore>

3. Add a `<script>` to the HTML form to submit the user input. This example overrides the form's default submit behavior to call `actions.newsletter()`, and redirects to `/confirmation` using the `navigate()` function:

    ```astro title=src/components/Newsletter.astro ins={12-23} collapse={2-8}
    <form>
      <label for="email">E-mail</label>
      <input id="email" required type="email" name="email" />
      <label>
        <input required type="checkbox" name="terms">
        I agree to the terms of service
      </label>
      <button>Sign up</button>
    </form>

    <script>
      import { actions } from 'astro:actions';
      import { navigate } from 'astro:transitions/client';

      const form = document.querySelector('form');
      form?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const formData = new FormData(form);
        const { error } = await actions.newsletter(formData);
        if (!error) navigate('/confirmation');
      })
    </script>
    ```

    <ReadMore>See [“Call actions from an HTML form action”](#call-actions-from-an-html-form-action) for an alternative way to submit form data.</ReadMore>

</Steps>

### Displaying form input errors

You can validate form inputs before submission using [native HTML form validation attributes](https://developer.mozilla.org/en-US/docs/Learn/Forms/Form_validation#using_built-in_form_validation) like `required`, `type="email"`, and `pattern`. For more complex `input` validation on the backend, you can use the provided [`isInputError()`](/en/reference/modules/astro-actions/#isinputerror) utility function.

To retrieve input errors, use the `isInputError()` utility to check whether an error was caused by invalid input. Input errors contain a `fields` object with messages for each input name that failed to validate. You can use these messages to prompt your user to correct their submission.

The following example checks the error with `isInputError()`, then checks whether the error is in the email field, before finally creating a message from the errors. You can use JavaScript DOM manipulation or your preferred UI framework to display this message to users.

```js /isInputError(?= )/ {5-12}
import { actions, isInputError } from 'astro:actions';

const form = document.querySelector('form');
const formData = new FormData(form);
const { error } = await actions.newsletter(formData);
if (isInputError(error)) {
  // Handle input errors.
  if (error.fields.email) {
    const message = error.fields.email.join(', ');
  }
}
```

## Call actions from an HTML form action

:::note
Pages must be on-demand rendered when calling actions using a form action. [Ensure prerendering is disabled on the page](/en/guides/on-demand-rendering/#enabling-on-demand-rendering) before using this API.
:::

You can enable zero-JS form submissions with standard attributes on any `<form>` element.  Form submissions without client-side JavaScript may be useful both as a fallback for when JavaScript fails to load, or if you prefer to handle forms entirely from the server.

Calling [Astro.getActionResult()](/en/reference/api-reference/#getactionresult) on the server returns the result of your form submission (`data` or `error`), and can be used to dynamically redirect, handle form errors, update the UI, and more.

To call an action from an HTML form, add `method="POST"` to your `<form>`, then set the form's `action` attribute using your action, for example `action={actions.logout}`. This will set the `action` attribute to use a query string that is handled by the server automatically.

For example, this Astro component calls the `logout` action when the button is clicked and reloads the current page:

```astro title="src/components/LogoutButton.astro"
---
import { actions } from 'astro:actions';
---

<form method="POST" action={actions.logout}>
  <button>Log out</button>
</form>
```

### Redirect on action success

If you need to redirect to a new route on success, you can use an action’s result on the server. A common example is creating a product record and redirecting to the new product's page, e.g. `/products/[id]`.

For example, say you have a `createProduct` action that returns the generated product id:

```ts title="src/actions/index.ts" mark={10}
import { defineAction } from 'astro:actions';
import { z } from 'astro:schema';

export const server = {
  createProduct: defineAction({
    accept: 'form',
    input: z.object({ /* ... */ }),
    handler: async (input) => {
      const product = await persistToDatabase(input);
      return { id: product.id };
    },
  })
}
```

You can retrieve the action result from your Astro component by calling `Astro.getActionResult()`. This returns an object containing `data` or `error` properties when an action is called, or `undefined` if the action was not called during this request.

Use the `data` property to construct a URL to use with `Astro.redirect()`:

```astro title="src/pages/products/create.astro" {4-7}
---
import { actions } from 'astro:actions';

const result = Astro.getActionResult(actions.createProduct);
if (result && !result.error) {
  return Astro.redirect(`/products/${result.data.id}`);
}
---

<form method="POST" action={actions.createProduct}>
  <!--...-->
</form>
```

### Handle form action errors

Calling `Astro.getActionResult()` in the Astro component containing your form gives you access to the `data` and `error` objects for custom error handling.

The following example displays a general failure message when a `newsletter` action fails:

```astro title="src/pages/index.astro" {4,7-9}
---
import { actions } from 'astro:actions';

const result = Astro.getActionResult(actions.newsletter);
---

{result?.error && (
  <p class="error">Unable to sign up. Please try again later.</p>
)}
<form method="POST" action={actions.newsletter}>
  <label>
    E-mail
    <input required type="email" name="email" />
  </label>
  <button>Sign up</button>
</form>
```

For more customization, you can [use the `isInputError()` utility](#displaying-form-input-errors) to check whether an error is caused by invalid input.

The following example renders an error banner under the `email` input field when an invalid email is submitted:

```astro title="src/pages/index.astro" ins={5,13} ins='aria-describedby="error"'
---
import { actions, isInputError } from 'astro:actions';

const result = Astro.getActionResult(actions.newsletter);
const inputErrors = isInputError(result?.error) ? result.error.fields : {};
---

<form method="POST" action={actions.newsletter}>
  <label>
    E-mail
    <input required type="email" name="email" aria-describedby="error" />
  </label>
  {inputErrors.email && <p id="error">{inputErrors.email.join(',')}</p>}
  <button>Sign up</button>
</form>
```

#### Preserve input values on error

Inputs will be cleared whenever a form is submitted. To persist input values, you can [enable view transitions](/en/guides/view-transitions/#adding-view-transitions-to-a-page) on the page and apply the `transition:persist` directive to each input:

```astro ins="transition:persist"
<input transition:persist required type="email" name="email" />
```

### Update the UI with a form action result

To use an action's return value to display a notification to the user on success, pass the action to `Astro.getActionResult()`. Use the returned `data` property to render the UI you want to display.

This example uses the `productName` property returned by an `addToCart` action to show a success message.

```astro title="src/pages/products/[slug].astro"
---
import { actions } from 'astro:actions';

const result = Astro.getActionResult(actions.addToCart);
---

{result && !result.error && (
  <p class="success">Added {result.data.productName} to cart</p>
)}

<!--...-->
```

### Advanced: Persist action results with a session

<p><Since v="5.0.0" /></p>

Action results are displayed as a POST submission. This means that the result will be reset to `undefined` when a user closes and revisits the page. The user will also see a "confirm form resubmission?" dialog if they attempt to refresh the page.

To customize this behavior, you can add middleware to handle the result of the action manually. You may choose to persist the action result using a cookie or session storage.

Start by [creating a middleware file](/en/guides/middleware/) and importing [the `getActionContext()` utility](/en/reference/modules/astro-actions/#getactioncontext) from `astro:actions`. This function returns an `action` object with information about the incoming action request, including the action handler and whether the action was called from an HTML form. `getActionContext()` also returns the `setActionResult()` and `serializeActionResult()` functions to programmatically set the value returned by `Astro.getActionResult()`:

```ts title="src/middleware.ts" {2,5}
import { defineMiddleware } from 'astro:middleware';
import { getActionContext } from 'astro:actions';

export const onRequest = defineMiddleware(async (context, next) => {
  const { action, setActionResult, serializeActionResult } = getActionContext(context);
  if (action?.calledFrom === 'form') {
    const result = await action.handler();
    // ... handle the action result
    setActionResult(action.name, serializeActionResult(result));
  }
  return next();
});
```

A common practice to persist HTML form results is the [POST / Redirect / GET pattern](https://en.wikipedia.org/wiki/Post/Redirect/Get). This redirect removes the "confirm form resubmission?" dialog when the page is refreshed, and allows action results to be persisted throughout the user's session.

This example applies the POST / Redirect / GET pattern to all form submissions using session storage with the [Netlify server adapter](/en/guides/integrations-guide/netlify/) installed. Action results are written to a session store using [Netlify Blob](https://docs.netlify.com/blobs/overview/), and retrieved after a redirect using a session ID:

```ts title="src/middleware.ts"
import { defineMiddleware } from 'astro:middleware';
import { getActionContext } from 'astro:actions';
import { randomUUID } from "node:crypto";
import { getStore } from "@netlify/blobs";

export const onRequest = defineMiddleware(async (context, next) => {
  // Skip requests for prerendered pages
  if (context.isPrerendered) return next();
  
  const { action, setActionResult, serializeActionResult } =
    getActionContext(context);
  // Create a Blob store to persist action results with Netlify Blob
  const actionStore = getStore("action-session");
  
  // If an action result was forwarded as a cookie, set the result
  // to be accessible from `Astro.getActionResult()`
  const sessionId = context.cookies.get("action-session-id")?.value;
  const session = sessionId
    ? await actionStore.get(sessionId, {
        type: "json",
      })
    : undefined;
  
  if (session) {
    setActionResult(session.actionName, session.actionResult);
  
    // Optional: delete the session after the page is rendered.
    // Feel free to implement your own persistence strategy
    await actionStore.delete(sessionId);
    context.cookies.delete("action-session-id");
    return next();
  }
  
  // If an action was called from an HTML form action,
  // call the action handler and redirect to the destination page
  if (action?.calledFrom === "form") {
    const actionResult = await action.handler();
  
    // Persist the action result using session storage
    const sessionId = randomUUID();
    await actionStore.setJSON(sessionId, {
      actionName: action.name,
      actionResult: serializeActionResult(actionResult),
    });
  
    // Pass the session ID as a cookie
    // to be retrieved after redirecting to the page
    context.cookies.set("action-session-id", sessionId);
  
    // Redirect back to the previous page on error
    if (actionResult.error) {
      const referer = context.request.headers.get("Referer");
      if (!referer) {
        throw new Error(
          "Internal: Referer unexpectedly missing from Action POST request.",
        );
      }
      return context.redirect(referer);
    }
    // Redirect to the destination page on success
    return context.redirect(context.originPathname);
  }
  
  return next();
});
```

## Security when using actions

Actions are accessible as public endpoints based on the name of the action. For example, the action `blog.like()` will be accessible from `/_actions/blog.like`. This is useful for unit testing action results and debugging production errors. However, this means you **must** use same authorization checks that you would consider for API endpoints and on-demand rendered pages.

### Authorize users from an action handler

To authorize action requests, add an authentication check to your action handler. You may want to use [an authentication library](/en/guides/authentication/) to handle session management and user information.

Actions expose the full `APIContext` object to access properties passed from middleware using `context.locals`. When a user is not authorized, you can raise an `ActionError` with the `UNAUTHORIZED` code:

```ts title="src/actions/index.ts" {6-8}
import { defineAction, ActionError } from 'astro:actions';

export const server = {
  getUserSettings: defineAction({
    handler: async (_input, context) => {
      if (!context.locals.user) {
        throw new ActionError({ code: 'UNAUTHORIZED' });
      }
      return { /* data on success */ };
    }
  })
}
```

### Gate actions from middleware

<p><Since v="5.0.0" /></p>

Astro recommends authorizing user sessions from your action handler to respect permission levels and rate-limiting on a per-action basis. However, you can also gate requests to all actions (or a subset of actions) from middleware.

Use the `getActionContext()` function from your middleware to retrieve information about any inbound action requests. This includes the action name and whether that action was called using a client-side remote procedure call (RPC) function (e.g. `actions.blog.like()`) or an HTML form.

The following example rejects all action requests that do not have a valid session token. If the check fails, a "Forbidden" response is returned. Note: this method ensures that actions are only accessible when a session is present, but is _not_ a substitute for secure authorization.

```ts title="src/middleware.ts"
import { defineMiddleware } from 'astro:middleware';
import { getActionContext } from 'astro:actions';

export const onRequest = defineMiddleware(async (context, next) => {
  const { action } = getActionContext(context);
  // Check if the action was called from a client-side function
  if (action?.calledFrom === 'rpc') {
    // If so, check for a user session token
    if (context.cookies.has('user-session')) {
      return new Response('Forbidden', { status: 403 });
    }
  }
  
  context.cookies.set('user-session', /* session token */);
  return next();
});
```

## Call actions from Astro components and server endpoints

You can call actions directly from Astro component scripts using the `Astro.callAction()` wrapper (or `context.callAction()` when using a [server endpoint](/en/guides/endpoints/#server-endpoints-api-routes)). This is common to reuse logic from your actions in other server code.

Pass the action as the first argument and any input parameters as the second argument. This returns the same `data` and `error` objects you receive when calling actions on the client:

```astro title="src/pages/products.astro" {6}
---
import { actions } from 'astro:actions';

const searchQuery = Astro.url.searchParams.get('search');
if (searchQuery) {
  const { data, error } = await Astro.callAction(actions.findProduct, { query: searchQuery });
  // handle result
}
---
```
