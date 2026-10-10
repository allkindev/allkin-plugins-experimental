# Creator

Allkin's tool workshop. You describe what you want; the **Creator** agent writes the tool or
the service; the **workbench** checks it, installs it into your Allkin and helps you debug it.

## What it is for

- **Create a tool**: a program that keeps running, a page, a piece of Allkin's interface, a
  dedicated agent — or several at once.
- **Create a service**: teach Allkin how to reach an external API, so that your agents call it
  with your key.

Everything Creator writes follows the **Allkin standard**, shipped with the tool
(`standard/PLUGIN-STANDARD.md`, `standard/SERVICE-STANDARD.md` and `standard/SKILL-STANDARD.md`) and verified by the **Check**
button.

## Getting started

1. Install Creator, then grant its four rights on its page. The Creator agent and your local
   repository are created at that moment.
2. Reload the page, then open **Creator** from the Allkin menu (Tools list).
3. Click **New**, choose *Tool* or *Service*, give a name and describe the need.
4. The conversation with the agent opens on the right. Answer its questions; it writes the files.

## The workbench

**At the top**: the project shown (drop-down list), **New**, and **Conversation** to reopen the
discussion with the agent.

**The state of the project**: its version, whether it is installed in your Allkin, the state of
its service, and the verdict of the check (conformant, errors, warnings).

**The actions**:

| Button | Effect |
|--------|--------|
| Check | Checks the project against the standard |
| Install / Reinstall | Copies the tool from your repository into Allkin. Blocked while an error remains |
| Tool's page | Opens its Allkin page: rights to grant, settings, log |
| Start / Restart / Stop | Drives the tool's service |
| Reload the page | Loads the interface of a freshly installed interface tool |
| Open Services | For a service: it is already in the catalogue, it only needs connecting |

**Ask the agent**: buttons that send an instruction about the project shown — fix the issues of
the check, complete the translations, write the documentation, review the code, explain the
project.

**The three panes**:

- **Check** — the list of deviations from the standard. Red: Allkin would refuse the tool, or
  it would break in use. Orange: the standard asks for it.
- **Files** — the files of the project; a click opens the file in the editor. Those the agent
  just wrote stand out.
- **Debug** — the service's log and the errors caught in the page since it loaded. **Send to the
  agent** hands it all over so that it finds the cause.

## Where your files are

In the agent's working folder: `~/.allkin/plugin-data/creator/workspace/`, with a `plugins/`
folder and a `services/` folder. This folder is a **local repository**: it appears in the
*Repositories* window of the Tools and Services pages, and your creations are listed there with
the "Creator" tag.

This folder **is not deleted** when you uninstall Creator. To publish a creation, copy its folder
into your tool repository.

## The rights asked

| Right | Why |
|-------|-----|
| Interface | Add the workbench to Allkin's page; with your session, create projects, install your tools and drive their service |
| Dedicated agent | The Creator agent, which writes the files. It has no access to the machine outside its working folder |
| Repository | Make the working folder a source of tools and services for this Allkin |
| Network | Let the agent read the online documentation of APIs |

## When it does not work

- **"Its agent does not exist yet"**: a right is not granted. Open the tool's page.
- **Install is greyed out**: the check found an error. Click *Fix the issues*.
- **Reinstall brings nothing**: the version did not change. The check says so; ask the agent to
  raise it.
- **The tool's interface does not appear**: grant its rights on its page, then reload.
- **The agent does not answer**: check your AI provider in Allkin's Settings.
