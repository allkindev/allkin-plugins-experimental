# Web browser

Opens websites in tabs of Allkin. A link clicked in a conversation, a document or a page no longer
takes you out of the application: the site opens in a tab, next to the rest.

## Getting started

- **A link**: a click on a link to another site opens it in a tab of Allkin. **Ctrl + click**
  (⌘ + click on a Mac), Shift + click or a middle click keep the browser's behaviour: a new tab of
  the browser, as before.
- **An address**: Tools list of the sidebar › **Web browser**, then the address. What is not an
  address starts a search.
- In the tab: the address bar (Enter to go), **Reload**, **Copy the link**, **Open in the
  browser**. The padlock tells whether the connection is encrypted (HTTPS).

Each site keeps its page while its tab is open: switching to another window and back finds it as it
was (eight sites at most; past that, the oldest reloads when you come back).

## Sites that refuse

Many sites forbid being shown inside another one (Google, GitHub, banks, most online accounts): it
protects against click hijacking. The browser would not say so — the frame would stay blank. The
service of the plugin reads the site's headers before showing it; if it refuses, the tab says so
and offers **Open in the browser**. "Try anyway" shows the frame regardless.

The address shown is the one that was opened: when you follow links inside the site, the browser
does not let Allkin know it.

## Settings

- **Local port** (9345): the port of the service, on this machine only. Change it if it is taken.

## Rights asked

- **Interface**: the tabs of the browser, and opening external links in them.
- **Network**: the service reads the headers of a site (nothing else, nothing kept). It only
  listens on 127.0.0.1, behind the session of Allkin.

For the check to work, also allow the plugin to **start as a service** on its page. Without the
service, sites still open; only the warning is missing.

## When it does not work

- *A tab stays blank*: the site probably refuses to be framed and the service is not running
  (plugin page › service). Use "Open in the browser".
- *Allkin is on HTTPS and an HTTP site does not show*: the browser blocks unencrypted content in an
  encrypted page. Open it in the browser.
- *Links still open outside Allkin*: reload the page after activating the plugin.

Experimental plugin: a first draft, to be validated.
