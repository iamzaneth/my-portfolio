import HomeCosmos from './scenes/HomeCosmos'
import AboutCosmos from './scenes/AboutCosmos'
import ToolkitCosmos from './scenes/ToolkitCosmos'
import ProjectsCosmos from './scenes/ProjectsCosmos'
import ContactCosmos from './scenes/ContactCosmos'
import './cosmic.css'

const scenes = { home: HomeCosmos, about: AboutCosmos, toolkit: ToolkitCosmos, projects: ProjectsCosmos, contact: ContactCosmos }
export type CosmicWorld = keyof typeof scenes

/** Static art has no animation lifecycle or layout footprint. Both compositions
 * are declarative; CSS selects the artwork without a resize subscription. */
export default function CosmicBackground({ world }: { world: CosmicWorld }) {
  const Scene = scenes[world]
  return <div className={`cosmic-world cosmos-${world}`} aria-hidden="true" data-cosmic-world={world}>
    <div className="cosmic-atmosphere" />
    <svg className="cosmic-art cosmic-desktop" viewBox="0 0 1000 800" preserveAspectRatio="none" focusable="false"><Scene mobile={false} /></svg>
    <svg className="cosmic-art cosmic-mobile" viewBox="0 0 400 900" preserveAspectRatio="none" focusable="false"><Scene mobile /></svg>
  </div>
}
