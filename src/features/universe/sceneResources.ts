import * as THREE from 'three'

export function disposeSceneTree(root: THREE.Object3D, keep = new Set<unknown>()) {
  const resources = new Set<{ dispose: () => void }>()
  root.traverse(object => {
    if (object instanceof THREE.InstancedMesh) object.dispose()
    const mesh = object as THREE.Mesh
    if (mesh.geometry && !keep.has(mesh.geometry)) resources.add(mesh.geometry)
    for (const material of Array.isArray(mesh.material) ? mesh.material : mesh.material ? [mesh.material] : []) {
      if (!keep.has(material)) resources.add(material)
    }
  })
  resources.forEach(resource => resource.dispose())
}
