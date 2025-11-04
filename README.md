## Retool Markdown Editor

This is a custom component library for Retool that provides a markdown editor implemented with [uiw/react-md-editor](https://github.com/uiwjs/react-md-editor).

## Installation

Requirements:

1. [Node.js](https://nodejs.org/) v20 or later installed in your development environment.
2. [Git](https://git-scm.com/) installed in your development environment.
3. [Admin permissions](https://docs.retool.com/org-users/concepts/permission-groups#default-permission-groups) in Retool.
4. \[Optional\] If you are running self-hosted Retool, setting the [ALLOW_SAME_ORIGIN_OPTION, and SANDBOX_DOMAIN environment variables](https://docs.retool.com/self-hosted/guides/origin-sandbox) is recommended.

Steps:

1. Run `git clone https://github.com/jamesg31/retool-wysiwyg-editor.git`
2. Run `npm install`
3. Run `npx retool-ccl login`
4. Run `npx retool-ccl publish`

## Usage

To use the editor in your Retool project, simply add the `MarkdownEditor` component to your canvas.

Access the components current value by using the `value` property. Set the value in the components `Default value` field within the components settings.

You can also set the `Theme` property in the components settings to customize the theme. This can be `Light` or `Dark`.

## License

This project is licensed under the GPL-3.0 License - see the [LICENSE](LICENSE) file for details.
