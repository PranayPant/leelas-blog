"use strict"
var __makeTemplateObject =
  (this && this.__makeTemplateObject) ||
  function (cooked, raw) {
    if (Object.defineProperty) {
      Object.defineProperty(cooked, "raw", { value: raw })
    } else {
      cooked.raw = raw
    }
    return cooked
  }
Object.defineProperty(exports, "__esModule", { value: true })
exports.query = exports.Head = void 0
// If you don't want to use TypeScript you can delete this file!
var React = require("react")
var gatsby_1 = require("gatsby")
var layout_1 = require("components/layout")
var seo_1 = require("components/seo")
var UsingTypescript = function (_a) {
  var data = _a.data,
    location = _a.location
  return (
    <layout_1.default>
      <h1>
        Gatsby supports <b>TypeScript by default</b>
      </h1>
      <p>
        This means that you can create and write <code>.ts/.tsx</code> files for your pages,
        components, and <code>gatsby-*</code> configuration files (for example{" "}
        <code>gatsby-config.ts</code>).
      </p>
      <p>
        For type checking you'll want to install <code>typescript</code> via npm and run{" "}
        <code>tsc --init</code> to create a <code>tsconfig</code> file.
      </p>
      <p>
        You're currently on the page <code>{location.pathname}</code> which was built on{" "}
        {data.site.buildTime}.
      </p>
      <p>
        To learn more, head over to our{" "}
        <a href="https://www.gatsbyjs.com/docs/how-to/custom-configuration/typescript/">
          documentation about TypeScript
        </a>
        .
      </p>
      <gatsby_1.Link to="/">Go back to the homepage</gatsby_1.Link>
    </layout_1.default>
  )
}
var Head = function () {
  return <seo_1.default title="Using TypeScript" />
}
exports.Head = Head
exports.default = UsingTypescript
exports.query = (0, gatsby_1.graphql)(
  templateObject_1 ||
    (templateObject_1 = __makeTemplateObject(
      ['\n  {\n    site {\n      buildTime(formatString: "YYYY-MM-DD hh:mm a z")\n    }\n  }\n'],
      ['\n  {\n    site {\n      buildTime(formatString: "YYYY-MM-DD hh:mm a z")\n    }\n  }\n'],
    )),
)
var templateObject_1
