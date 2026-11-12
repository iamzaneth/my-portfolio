/** Original code-native pixel scenery; the licensed cat atlas stays untouched. */
export default function MoonGarden() {
  return <svg className="garden-scenery" viewBox="0 0 480 360" preserveAspectRatio="xMidYMax meet" shapeRendering="crispEdges" aria-hidden="true">
    <g transform="translate(105 -5) scale(.8)">
    <path d="M352 34h36v6h12v12h6v36h-6v12h-12v6h-36v-6h-12V88h-6V52h6V40h12z" fill="var(--warm)" />
    <path d="M352 40h12v12h-12zM382 70h12v12h-12zM346 82h18v12h-18z" fill="#b28f71" />
    </g>
    <path d="M0 286h28v-16h26v-12h24v12h32v16h30v-12h28v12h24v-20h22v-12h28v18h28v14h32v-10h24v-20h28v12h26v18h30v-12h24v12h32v74H0z" fill="#193b50" />
    <path d="M0 322h40v-12h28v-16h32v16h40v12h40v-10h34v-10h32v12h44v8h38v-16h30v-12h24v14h30v14h68v38H0z" fill="#24566a" />
    <g fill="var(--cyan)"><path d="M49 290v-32h4v32zm-12-20v-8h12v4h-8v4zm16-12v-8h12v4h-8v4z" /><path d="M424 310v-40h4v40zm4-28v-12h12v4h-8v8zm-12 8v-8h8v4h-4v4z" /></g>
    <g fill="var(--accent)"><path d="M38 248h8v8h-8zM60 242h8v8h-8zM436 262h8v8h-8z" /><path d="M92 336h12v4H92zM362 334h16v4h-16z" /></g>
  </svg>
}
